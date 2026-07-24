import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const migration = readFileSync(
  resolve("supabase/migrations/202607230001_initial_schema.sql"),
  "utf8",
);

describe("Supabase initial migration", () => {
  it("quotes every dynamic policy name and table name as an identifier", () => {
    const statements = migration
      .split("\n")
      .filter((line) => line.includes("execute format('create policy"));

    expect(statements).toHaveLength(4);
    expect(statements).not.toContainEqual(
      expect.stringMatching(/policy\s+%L/i),
    );
    for (const statement of statements) {
      expect(statement).toContain("create policy %I on public.%I");
    }
  });

  it("quotes dynamic trigger and table names as identifiers", () => {
    const statements = migration
      .split("\n")
      .filter((line) => line.includes("execute format('create trigger"));

    expect(statements).toHaveLength(2);
    for (const statement of statements) {
      expect(statement).toContain("create trigger %I");
      expect(statement).toContain("on public.%I");
    }
  });

  it("keeps the complete migration in one explicit transaction", () => {
    expect(migration.trimStart().startsWith("begin;")).toBe(true);
    expect(migration.trimEnd().endsWith("commit;")).toBe(true);
    expect(migration.match(/^begin;$/gim)).toHaveLength(1);
    expect(migration.match(/^commit;$/gim)).toHaveLength(1);
  });
});
