/**
 * Monaco 에디터 파일을 CDN 대신 우리 사이트에서 제공하려고 public/monaco/<버전>/vs로 복사한다
 * (pnpm dev · pnpm build가 먼저 실행한다). 복사본은 커밋하지 않는다 (.gitignore).
 * 버전이 주소에 들어 있어서 브라우저가 오래 캐시해도 된다 (next.config의 headers).
 */
import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const pkg = path.join(root, "node_modules", "monaco-editor");
const { version } = JSON.parse(readFileSync(path.join(pkg, "package.json"), "utf8"));
const base = path.join(root, "public", "monaco");
const target = path.join(base, version, "vs");
/** 복사가 끝까지 됐다는 표시 (중간에 멈춘 복사본을 다시 쓰지 않게) */
const done = path.join(base, version, ".complete");

/** fs.cpSync는 Windows·OneDrive 폴더에서 비정상 종료될 때가 있어 파일을 하나씩 복사한다 */
function copyDir(from, to) {
  mkdirSync(to, { recursive: true });
  let count = 0;
  for (const entry of readdirSync(from, { withFileTypes: true })) {
    const source = path.join(from, entry.name);
    const destination = path.join(to, entry.name);
    if (entry.isDirectory()) count += copyDir(source, destination);
    else {
      copyFileSync(source, destination);
      count += 1;
    }
  }
  return count;
}

if (existsSync(done)) {
  console.log(`[monaco] ${version} 이미 준비됨`);
} else {
  rmSync(base, { recursive: true, force: true }); // 다른 버전·중간에 멈춘 복사본 정리
  const count = copyDir(path.join(pkg, "min", "vs"), target);
  copyFileSync(path.join(pkg, "package.json"), done);
  console.log(`[monaco] ${version} → public/monaco/${version}/vs (${count}개 파일)`);
}
