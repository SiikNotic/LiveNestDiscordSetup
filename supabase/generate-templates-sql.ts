import { writeFileSync } from "node:fs";
import { SERVER_TEMPLATES } from "../src/lib/server-templates";

// Ids the current installer already builds; those keep their existing structure.
const BUILTIN = new Set(["gaming-community", "streamer-hub", "fivem-roleplay", "anime-community", "tech-ai", "study-campus"]);

const rows = SERVER_TEMPLATES.filter((t) => !BUILTIN.has(t.id)).map((t) => ({
  id: t.id,
  name: t.name,
  category: t.category,
  spec: {
    version: 1,
    description: { en: t.description, es: t.descriptionEs },
    roles: t.roles.map((r) => ({ name: r.name, color: r.color, permissions: [...r.permissions], hoist: Boolean(r.hoist) })),
    categories: t.categories.map((c) => ({
      name: c.name,
      ...(c.privateTo ? { privateTo: [...c.privateTo] } : {}),
      channels: c.channels.map((ch) => ({
        name: ch.name,
        kind: ch.kind,
        ...(ch.readOnly ? { readOnly: true } : {}),
        ...(ch.topic ? { topic: ch.topic } : {}),
      })),
    })),
  },
}));

const q = (s: string) => "'" + s.replace(/'/g, "''") + "'";
const values = rows
  .map((r) => `  (${q(r.id)}, ${q(r.name)}, ${q(r.category)}, true, $spec$${JSON.stringify(r.spec)}$spec$::jsonb)`)
  .join(",\n");

const sql = `-- LiveNest: template catalogue for the Discord installer.
-- Generated from src/lib/server-templates.ts (${rows.length} templates). Safe to run more than once.
-- The six templates the installer already builds (${[...BUILTIN].join(", ")}) are not included.

create table if not exists public.livenest_templates (
  id          text primary key,
  name        text not null,
  category    text not null,
  installable boolean not null default true,
  spec        jsonb not null,
  updated_at  timestamptz not null default now()
);

alter table public.livenest_templates enable row level security;

-- Anyone may read the catalogue; only the service role (edge functions) can write it.
drop policy if exists "livenest_templates are public" on public.livenest_templates;
create policy "livenest_templates are public"
  on public.livenest_templates for select
  using (true);

insert into public.livenest_templates (id, name, category, installable, spec)
values
${values}
on conflict (id) do update
  set name = excluded.name,
      category = excluded.category,
      installable = excluded.installable,
      spec = excluded.spec,
      updated_at = now();

-- Check: should return ${rows.length}
select count(*) as livenest_templates from public.livenest_templates where installable;
`;
writeFileSync(new URL("./livenest_templates.sql", import.meta.url), sql);
console.log(rows.length, "templates,", (sql.length / 1024).toFixed(0), "KB");
