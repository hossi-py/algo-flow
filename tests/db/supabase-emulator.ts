import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { PGlite } from "@electric-sql/pglite";

/**
 * Supabase와 같은 역할·권한 환경을 PGlite(WASM Postgres)에 흉내 내고 마이그레이션을 적용한다.
 * - anon / authenticated / service_role(bypassrls) 역할
 * - auth.users, auth.uid() (request.jwt.claims의 sub)
 * - Supabase 기본 권한: public 스키마의 새 테이블·함수는 세 역할 모두에게 권한을 준다
 */
const BOOTSTRAP = `
create role anon nologin;
create role authenticated nologin;
create role service_role nologin bypassrls;
create schema auth;
create table auth.users (
  id uuid primary key,
  email text,
  raw_user_meta_data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  last_sign_in_at timestamptz
);
create function auth.uid() returns uuid language sql stable as $$
  select nullif(coalesce(current_setting('request.jwt.claim.sub', true), current_setting('request.jwt.claims', true)::jsonb ->> 'sub'), '')::uuid
$$;
grant usage on schema auth to anon, authenticated, service_role;
grant usage on schema public to anon, authenticated, service_role;
alter default privileges in schema public grant all on tables to anon, authenticated, service_role;
alter default privileges in schema public grant all on functions to anon, authenticated, service_role;
alter default privileges in schema public grant all on sequences to anon, authenticated, service_role;
`;

const MIGRATIONS_DIR = path.join(process.cwd(), "supabase", "migrations");

export async function createSupabaseEmulator(): Promise<PGlite> {
  const db = new PGlite();
  await db.exec(BOOTSTRAP);
  for (const file of readdirSync(MIGRATIONS_DIR)
    .filter((name) => name.endsWith(".sql"))
    .sort()) {
    await db.exec(readFileSync(path.join(MIGRATIONS_DIR, file), "utf8"));
  }
  return db;
}

export type Role = { kind: "anon" } | { kind: "user"; id: string } | { kind: "service" };

/** 역할을 바꿔 쿼리를 실행하고, 끝나면 되돌린다 */
export async function as<T>(db: PGlite, role: Role, run: () => Promise<T>): Promise<T> {
  const name = role.kind === "anon" ? "anon" : role.kind === "user" ? "authenticated" : "service_role";
  await db.exec(`set role ${name}`);
  await db.query("select set_config('request.jwt.claim.sub', $1, false)", [role.kind === "user" ? role.id : ""]);
  try {
    return await run();
  } finally {
    await db.exec("reset role");
    await db.query("select set_config('request.jwt.claim.sub', '', false)");
  }
}

export async function signUp(db: PGlite, id: string, name?: string) {
  await db.query("insert into auth.users (id, email, raw_user_meta_data) values ($1, $2, $3)", [
    id,
    `${id.slice(0, 4)}@example.com`,
    JSON.stringify(name ? { name } : {}),
  ]);
}
