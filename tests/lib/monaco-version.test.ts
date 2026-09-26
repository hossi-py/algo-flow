import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

describe("Monaco 셀프 호스팅", () => {
  it("에디터가 받는 버전이 설치된 monaco-editor와 같다 (다르면 복사본 경로가 어긋나 에디터가 안 뜬다)", () => {
    const root = path.resolve(__dirname, "../..");
    const installed = JSON.parse(readFileSync(path.join(root, "node_modules/monaco-editor/package.json"), "utf8")) as {
      version: string;
    };
    const declared = JSON.parse(readFileSync(path.join(root, "package.json"), "utf8")) as {
      dependencies: Record<string, string>;
    };
    const source = readFileSync(path.join(root, "src/components/workspace/code-editor.tsx"), "utf8");
    const used = /MONACO_VERSION = "([^"]+)"/.exec(source)?.[1];
    expect(used).toBe(installed.version);
    expect(declared.dependencies["monaco-editor"]).toBe(installed.version);
  });
});
