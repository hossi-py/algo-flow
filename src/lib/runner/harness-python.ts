/**
 * 브라우저(pyodide.worker.ts)와 Node(scripts/validate-content.ts, 테스트)가 함께 쓰는 Python 채점 하네스.
 * run_case(...)는 항상 JSON 문자열 하나를 돌려준다:
 *   { "ok": true,  "value": <반환값>, "stdout": str, "timeMs": float }
 *   { "ok": false, "phase": "compile" | "runtime", "error": {type, message, line, traceback}, "stdout": str, "timeMs": float }
 *
 * 주의: String.raw 템플릿이므로 Python 코드 안에 달러+중괄호 조합을 쓰지 않는다.
 */
export const PYTHON_HARNESS = String.raw`
import copy as _copy
import io as _io
import json as _json
import math as _math
import sys as _sys
import time as _time
import traceback as _traceback

_USER_FILE = "<solution>"
_MAX_SAFE_INT = 2 ** 53


class _LimitedWriter(_io.StringIO):
    def __init__(self, limit):
        super().__init__()
        self._limit = limit
        self._size = 0
        self.truncated = False

    def write(self, text):
        if self._size >= self._limit:
            self.truncated = True
            return len(text)
        room = self._limit - self._size
        chunk = text[:room]
        if len(chunk) < len(text):
            self.truncated = True
        self._size += len(chunk)
        super().write(chunk)
        return len(text)

    def result(self):
        value = self.getvalue()
        if self.truncated:
            value += "\n… (출력이 너무 길어서 잘랐어요)"
        return value


def _no_input(*_args, **_kwargs):
    raise RuntimeError("input()은 사용할 수 없어요. solution 함수의 인자로 입력을 받아요.")


def _normalize(value, depth=0):
    if depth > 200:
        raise ValueError("반환값이 너무 깊게 중첩되어 있어요")
    if value is None or isinstance(value, (bool, str)):
        return value
    if isinstance(value, int):
        if abs(value) > _MAX_SAFE_INT:
            raise ValueError("반환값의 정수가 너무 커요 (±2^53 이내여야 해요)")
        return value
    if isinstance(value, float):
        if _math.isnan(value) or _math.isinf(value):
            raise ValueError("반환값에 NaN 또는 무한대가 들어 있어요")
        return value
    if isinstance(value, (list, tuple)):
        return [_normalize(item, depth + 1) for item in value]
    if isinstance(value, (set, frozenset)):
        items = [_normalize(item, depth + 1) for item in value]
        try:
            return sorted(items)
        except TypeError:
            return sorted(items, key=lambda item: _json.dumps(item, sort_keys=True, ensure_ascii=False))
    if isinstance(value, dict):
        return {str(key): _normalize(item, depth + 1) for key, item in value.items()}
    raise TypeError(type(value).__name__ + " 타입은 반환할 수 없어요 (리스트, 딕셔너리, 숫자, 문자열, bool, None만 가능)")


def _error_payload(exc):
    frames = [frame for frame in _traceback.extract_tb(exc.__traceback__) if frame.filename == _USER_FILE]
    line = frames[-1].lineno if frames else None
    if isinstance(exc, SyntaxError) and exc.filename == _USER_FILE:
        line = exc.lineno
    body = "".join(_traceback.format_list(frames)) if frames else ""
    tail = "".join(_traceback.format_exception_only(type(exc), exc))
    message = exc.msg if isinstance(exc, SyntaxError) else str(exc)
    if isinstance(exc, RecursionError):
        message = "재귀 호출이 너무 깊어요 (" + str(exc) + ")"
    return {
        "type": type(exc).__name__,
        "message": message,
        "line": line,
        "traceback": (body + tail).replace('File "<solution>", ', ""),
    }


def run_case(code, function_name, args_json, recursion_limit, stdout_limit):
    started = _time.perf_counter()
    try:
        compiled = compile(code, _USER_FILE, "exec")
    except SyntaxError as exc:
        return _json.dumps(
            {"ok": False, "phase": "compile", "error": _error_payload(exc), "stdout": "", "timeMs": 0},
            ensure_ascii=False,
        )

    writer = _LimitedWriter(stdout_limit)
    saved_stdout, saved_stderr = _sys.stdout, _sys.stderr
    saved_limit = _sys.getrecursionlimit()
    namespace = {"__name__": "__main__", "input": _no_input}
    try:
        _sys.stdout = writer
        _sys.stderr = writer
        _sys.setrecursionlimit(recursion_limit)
        started = _time.perf_counter()
        exec(compiled, namespace)
        solution = namespace.get(function_name)
        if not callable(solution):
            raise NameError(function_name + " 함수를 찾을 수 없어요. def " + function_name + "(...): 로 정의해 주세요.")
        args = _copy.deepcopy(_json.loads(args_json))
        value = _normalize(solution(*args))
        elapsed = (_time.perf_counter() - started) * 1000
        payload = {"ok": True, "value": value, "stdout": writer.result(), "timeMs": elapsed}
    except BaseException as exc:  # SystemExit, KeyboardInterrupt까지 사용자 오류로 처리
        elapsed = (_time.perf_counter() - started) * 1000
        payload = {
            "ok": False,
            "phase": "runtime",
            "error": _error_payload(exc),
            "stdout": writer.result(),
            "timeMs": elapsed,
        }
    finally:
        _sys.stdout, _sys.stderr = saved_stdout, saved_stderr
        _sys.setrecursionlimit(saved_limit)
    return _json.dumps(payload, ensure_ascii=False)
`;
