/**
 * AI가 만든 정답 코드를 실행하기 전에 AST로 검사한다 (Node Pyodide 워커 안에서 실행).
 * check_code(code)는 문제점 목록(JSON 문자열 배열)을 돌려준다. 빈 배열이면 통과.
 *
 * 주의: String.raw 템플릿이므로 Python 코드 안에 달러+중괄호 조합을 쓰지 않는다.
 */

/** 정답 코드에서 import할 수 있는 모듈 (docs/02 §3.2) */
export const ALLOWED_MODULES = ["collections", "heapq", "itertools", "math", "functools", "bisect", "typing"] as const;

export const MAX_SOLUTION_CHARS = 8000;

export const PYTHON_STATIC_CHECK = String.raw`
import ast as _ast
import json as _json

_ALLOWED_MODULES = set(__ALLOWED__)
_FORBIDDEN_CALLS = {
    "open", "input", "print", "eval", "exec", "compile", "__import__", "globals", "locals", "vars",
    "breakpoint", "exit", "quit", "help", "getattr", "setattr", "delattr", "memoryview",
}


def check_code(code):
    issues = []
    try:
        tree = _ast.parse(code)
    except SyntaxError as exc:
        return _json.dumps(["문법 오류 (" + str(exc.lineno) + "번째 줄): " + str(exc.msg)], ensure_ascii=False)

    has_solution = any(
        isinstance(node, _ast.FunctionDef) and node.name == "solution" for node in tree.body
    )
    if not has_solution:
        issues.append("최상위에 def solution(...) 함수가 없어요")

    for node in _ast.walk(tree):
        if isinstance(node, _ast.Import):
            for alias in node.names:
                root = alias.name.split(".")[0]
                if root not in _ALLOWED_MODULES:
                    issues.append("허용되지 않은 import: " + alias.name)
        elif isinstance(node, _ast.ImportFrom):
            root = (node.module or "").split(".")[0]
            if node.level or root not in _ALLOWED_MODULES:
                issues.append("허용되지 않은 import: " + (node.module or "."))
        elif isinstance(node, _ast.Call) and isinstance(node.func, _ast.Name) and node.func.id in _FORBIDDEN_CALLS:
            issues.append("사용할 수 없는 함수 호출: " + node.func.id + "()")
        elif isinstance(node, _ast.Name) and node.id in ("__builtins__", "__loader__", "__spec__"):
            issues.append("사용할 수 없는 이름: " + node.id)
        elif isinstance(node, _ast.Attribute) and node.attr.startswith("__"):
            issues.append("던더 속성에 접근할 수 없어요: ." + node.attr)

    unique = []
    for issue in issues:
        if issue not in unique:
            unique.append(issue)
    return _json.dumps(unique, ensure_ascii=False)
`.replace("__ALLOWED__", JSON.stringify(ALLOWED_MODULES));
