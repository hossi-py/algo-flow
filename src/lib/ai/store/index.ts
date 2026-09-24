import "server-only";
import { createFileStore } from "./file-store";
import type { GeneratedProblemStore } from "./types";

const globalStore = globalThis as typeof globalThis & { __algoFlowGeneratedStore?: GeneratedProblemStore };

export function getGeneratedStore(): GeneratedProblemStore {
  return (globalStore.__algoFlowGeneratedStore ??= createFileStore());
}
