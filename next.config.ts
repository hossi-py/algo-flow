import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // AI 생성 문제 검증: Node에서 Pyodide를 worker_threads로 띄운다 (번들하지 않음)
  serverExternalPackages: ["pyodide"],
  outputFileTracingIncludes: {
    "/api/generate": ["./src/lib/runner-node/node-worker.mjs", "./node_modules/pyodide/**/*"],
  },
};

export default nextConfig;
