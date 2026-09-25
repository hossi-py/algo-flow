import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { GeneratedProblem } from "@/types";
import { UUID_PATTERN, type GeneratedProblemStore } from "./types";

/**
 * Supabase 없이 개발할 때 쓰는 파일 저장소 (.data/, git 제외).
 * 정답 코드는 별도 폴더에 저장하고 읽는 API는 두지 않는다.
 */
export function createFileStore(root = path.join(process.cwd(), ".data")): GeneratedProblemStore {
  const problemsDir = path.join(root, "generated");
  const solutionsDir = path.join(root, "generated-solutions");

  const fileOf = (id: string) => {
    if (!UUID_PATTERN.test(id)) throw new Error("잘못된 문제 id예요");
    return path.join(problemsDir, `${id}.json`);
  };

  async function read(id: string): Promise<GeneratedProblem | null> {
    if (!UUID_PATTERN.test(id)) return null;
    try {
      return JSON.parse(await readFile(fileOf(id), "utf8")) as GeneratedProblem;
    } catch {
      return null;
    }
  }

  async function write(record: GeneratedProblem) {
    await mkdir(problemsDir, { recursive: true });
    await writeFile(fileOf(record.id), JSON.stringify(record, null, 2), "utf8");
  }

  async function all(): Promise<GeneratedProblem[]> {
    let names: string[] = [];
    try {
      names = await readdir(problemsDir);
    } catch {
      return [];
    }
    const records = await Promise.all(
      names.filter((name) => name.endsWith(".json")).map((name) => read(name.slice(0, -".json".length))),
    );
    return records.filter((record): record is GeneratedProblem => record !== null);
  }

  return {
    create: write,
    async update(id, patch) {
      const record = await read(id);
      if (record) await write({ ...record, ...patch });
    },
    async complete(id, result, solution) {
      const record = await read(id);
      if (!record) return;
      await mkdir(solutionsDir, { recursive: true });
      await writeFile(path.join(solutionsDir, `${id}.py`), solution, "utf8");
      await write({ ...record, ...result, status: "verified", error: null });
    },
    get: read,
    async listByOwner(ownerId, limit) {
      return (await all())
        .filter((record) => record.ownerId === ownerId)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
        .slice(0, limit);
    },
    async countSince(ownerId, since) {
      const from = since.toISOString();
      return (await all()).filter((record) => record.ownerId === ownerId && record.createdAt >= from).length;
    },
  };
}
