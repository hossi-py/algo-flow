/** Pyodide 버전은 devDependency(pyodide)와 반드시 같아야 한다 — 브라우저와 Node 검증 결과를 일치시키기 위해 */
export const PYODIDE_VERSION = "314.0.7";
export const PYODIDE_INDEX_URL = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`;

/** 케이스당 print/console.log 출력 상한 (글자 수) */
export const STDOUT_LIMIT = 64 * 1024;

/** 엔진 준비(Pyodide 다운로드·초기화)에 허용하는 최대 시간 */
export const ENGINE_INIT_TIMEOUT_MS = 60_000;
