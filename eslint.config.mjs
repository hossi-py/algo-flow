import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    // 정답 코드는 채점기처럼 전역 solution 함수만 정의한다
    files: ["content-solutions/**/*.js"],
    rules: { "@typescript-eslint/no-unused-vars": "off" },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Monaco 에디터 복사본 (scripts/copy-monaco.mjs)
    "public/monaco/**",
  ]),
]);

export default eslintConfig;
