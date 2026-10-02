// Generates supabase/template_catalog_seed.sql: the LiveNest templates in the format the
// `discord-server` edge function installs from (public.template_catalog.definition).
//
//   npx tsx supabase/generate-templates-sql.ts
//
// Definition format (see supabase/functions/discord-server/index.ts):
//   roles[]:      { key, en, es, both?, color }
//   categories[]: { key, en, es, both?, private?: roleKey[] }
//   channels[]:   { key, category, type: 0|2|5|15, en, es, both?, topic?, readOnly? }
//   staff:        roleKey[] that may post in readOnly channels
import { writeFileSync } from "node:fs";
import { SERVER_TEMPLATES } from "../src/lib/server-templates";

// Ids the catalog already has; they keep their existing definitions.
const EXISTING = new Set(["gaming-community", "streamer-hub", "fivem-roleplay", "anime-community", "tech-ai", "study-campus"]);

/** Spanish for common channel/category/role words. Anything else keeps its English name. */
const ES: Record<string, string> = {
  welcome: "bienvenida",
  rules: "reglas",
  announcements: "anuncios",
  news: "noticias",
  "choose-roles": "elegir-roles",
  introductions: "presentaciones",
  media: "multimedia",
  suggestions: "sugerencias",
  feedback: "opiniones",
  help: "ayuda",
  questions: "preguntas",
  faq: "preguntas-frecuentes",
  "open-ticket": "abrir-ticket",
  support: "soporte",
  events: "eventos",
  giveaways: "sorteos",
  tournaments: "torneos",
  "looking-for-group": "busco-grupo",
  lfg: "busco-grupo",
  showcase: "escaparate",
  resources: "recursos",
  "staff-chat": "chat-staff",
  reports: "reportes",
  "mod-logs": "registros-mod",
  "bot-logs": "registros-bot",
  "ticket-logs": "registros-tickets",
  "bug-reports": "reportes-bugs",
  "feature-requests": "peticiones",
  changelog: "novedades",
  "start here": "empieza aquí",
  start: "inicio",
  community: "comunidad",
  hangout: "quedada",
  voice: "voz",
  team: "equipo",
  creative: "creativo",
  learn: "aprender",
  markets: "mercados",
  signals: "señales",
  members: "miembros",
  press: "prensa",
  campaigns: "campañas",
  // roles
  owner: "Dueño",
  administrator: "Administrador",
  moderator: "Moderador",
  member: "Miembro",
  "new member": "Nuevo miembro",
};

type Names = { en: string; es: string; both?: string };

/** "🌷︱welcome" → prefix "🌷︱", base "welcome". */
function split(name: string) {
  const m = name.match(/^(.*?[︱・⋆]\s*)(.+)$/u);
  return m ? { prefix: m[1]!, base: m[2]! } : { prefix: "", base: name };
}

function names(original: string, kind: "channel" | "category" | "role"): Names {
  const { prefix, base } = split(original);
  // Already bilingual ("rules・reglas"): split it.
  if (kind === "channel" && base.includes("・")) {
    const [en, es] = base.split("・");
    return { en: prefix + en, es: prefix + es, both: original };
  }
  const hit = ES[base.toLowerCase()];
  if (!hit || hit.toLowerCase() === base.toLowerCase()) return { en: original, es: original, both: original };
  const es = kind === "category" && base === base.toUpperCase() ? hit.toUpperCase() : hit;
  const sep = kind === "channel" ? "・" : " · ";
  return { en: original, es: prefix + es, both: `${prefix}${base}${sep}${es}` };
}

const slug = (s: string) =>
  split(s).base.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "x";
const STAFF = ["owner", "administrator", "moderator", "support"];

const rows = SERVER_TEMPLATES.filter((t) => !EXISTING.has(t.id)).map((t) => {
  const roleKey = new Map<string, string>();
  const used = new Set<string>();
  const roles = t.roles.map((r) => {
    let key = slug(r.name);
    while (used.has(key)) key += "-2";
    used.add(key);
    roleKey.set(r.name, key);
    return { key, ...names(r.name, "role"), color: parseInt(r.color.replace("#", ""), 16) };
  });
  const staff = roles.filter((r) => STAFF.includes(slug(r.en).replace(/-/g, " "))).map((r) => r.key);
  // Staff/team sections are private even when the template data doesn't say so.
  const isStaffSection = (name: string) => /^(STAFF|TEAM|OFFICERS)$/.test(split(name).base.trim().toUpperCase());
  const categories = t.categories.map((c, i) => ({
    key: `c${i + 1}`,
    ...names(c.name, "category"),
    ...(c.privateTo
      ? { private: c.privateTo.map((n) => roleKey.get(n)).filter(Boolean) }
      : isStaffSection(c.name)
        ? { private: staff }
        : {}),
  }));
  const channels = t.categories.flatMap((c, i) =>
    c.channels.map((ch, j) => ({
      key: `c${i + 1}-${j + 1}-${slug(ch.name)}`,
      category: `c${i + 1}`,
      type: ch.kind === "voice" ? 2 : ch.kind === "forum" ? 15 : ch.kind === "announcement" ? 5 : 0,
      ...names(ch.name, "channel"),
      ...(ch.topic ? { topic: ch.topic } : {}),
      ...(ch.readOnly ? { readOnly: true } : {}),
    })),
  );
  return { id: t.id, name: t.name, category: t.category, description: t.description, definition: { roles, categories, channels, staff } };
});

const q = (s: string) => "'" + s.replace(/'/g, "''") + "'";
const values = rows.map(
  (r) =>
    `  (${q(r.id)}, ${q(r.name)}, ${q(r.category)}, ${q(r.description)}, $def$${JSON.stringify(r.definition)}$def$::jsonb, true)`,
);

const sql = `-- LiveNest: ${rows.length} templates for public.template_catalog (the table the discord-server
-- edge function lists and installs from). Generated by supabase/generate-templates-sql.ts.
-- Safe to run more than once: existing rows with the same id are updated. The six templates
-- already in the catalog (${[...EXISTING].join(", ")}) are not touched.

insert into public.template_catalog (id, name, category, description, definition, enabled)
values
${values.join(",\n")}
on conflict (id) do update
  set name = excluded.name,
      category = excluded.category,
      description = excluded.description,
      definition = excluded.definition,
      enabled = excluded.enabled;

-- Check: should return ${rows.length + EXISTING.size}
select count(*) as enabled_templates from public.template_catalog where enabled;
`;

writeFileSync(new URL("./template_catalog_seed.sql", import.meta.url), sql);
writeFileSync(new URL("./template_catalog_seed.json", import.meta.url), JSON.stringify(rows));
console.log(`${rows.length} templates → supabase/template_catalog_seed.sql (${(sql.length / 1024).toFixed(0)} KB)`);
