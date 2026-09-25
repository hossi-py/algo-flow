import type { NextConfig } from "next";

/**
 * 배포 버전 (에러 기록에 함께 남긴다). 직접 넣은 NEXT_PUBLIC_RELEASE가 우선이고,
 * 없으면 Vercel이 빌드 때 주는 커밋 해시 앞 7자리를 쓴다. 로컬 빌드에서는 비어 있다.
 */
const release = process.env.NEXT_PUBLIC_RELEASE || process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) || "";

const nextConfig: NextConfig = {
  // AI 생성 문제 검증: Node에서 Pyodide를 worker_threads로 띄운다 (번들하지 않음)
  serverExternalPackages: ["pyodide"],
  outputFileTracingIncludes: {
    "/api/generate": ["./src/lib/runner-node/node-worker.mjs", "./node_modules/pyodide/**/*"],
  },
  // 브라우저·서버 코드의 process.env.NEXT_PUBLIC_RELEASE를 빌드 때 이 값으로 바꾼다
  env: { NEXT_PUBLIC_RELEASE: release },
};

export default nextConfig;
