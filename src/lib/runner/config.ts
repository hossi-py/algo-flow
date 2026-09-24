/** Pyodide 버전은 devDependency(pyodide)와 반드시 같아야 한다 — 브라우저와 Node 검증 결과를 일치시키기 위해 */
export const PYODIDE_VERSION = "314.0.7";
export const PYODIDE_INDEX_URL = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`;

/** 케이스당 print/console.log 출력 상한 (글자 수) */
export const STDOUT_LIMIT = 64 * 1024;

/** 엔진 준비(Pyodide·CheerpJ 다운로드·초기화)에 허용하는 최대 시간 */
export const ENGINE_INIT_TIMEOUT_MS = 90_000;

/** CheerpJ(브라우저 JVM) 버전과 로더. Java 채점 하네스는 public/java/에 있다 (pnpm build:java) */
export const CHEERPJ_LOADER_URL = "https://cjrtnc.leaningtech.com/4.3/loader.js";
/** CheerpJ가 돌릴 Java 버전 (ECJ가 이 버전 문법으로 컴파일한다) */
export const CHEERPJ_JAVA_VERSION = 11;
/** Java 케이스의 벽시계 제한에 더하는 여유 (입력 JSON → Java 값 변환·결과 직렬화 시간) */
export const JAVA_IO_ALLOWANCE_MS = 4_000;
