// LiveNest template installer for the `discord-server` edge function (Deno).
//
// Reads templates from public.livenest_templates (see supabase/livenest_templates.sql)
// and builds them in a Discord guild through the bot. It only adds or fixes things:
// it never deletes channels, roles or messages, and running it twice does not duplicate.

const DISCORD = "https://discord.com/api/v10";

type Kind = "text" | "voice" | "forum" | "announcement";
type ChannelSpec = { name: string; kind: Kind; readOnly?: boolean; topic?: string };
type CategorySpec = { name: string; privateTo?: string[]; channels: ChannelSpec[] };
type RoleSpec = { name: string; color: string; permissions: string[]; hoist?: boolean };
export type TemplateSpec = {
  version: number;
  description?: { en: string; es: string };
  roles: RoleSpec[];
  categories: CategorySpec[];
};
export type TemplateRow = { id: string; name: string; category: string; spec: TemplateSpec };
export type NameMode = "en" | "es" | "both";

type Role = { id: string; name: string };
type Channel = { id: string; name: string; type: number; parent_id: string | null };
type Overwrite = { id: string; type: 0 | 1; allow: string; deny: string };

// Minimal Supabase client shape so this file doesn't pin a supabase-js version.
type Db = {
  from: (table: string) => {
    select: (cols: string) => {
      eq: (col: string, v: unknown) => any;
    };
  };
};

const PERMS: Record<string, bigint> = {
  KICK_MEMBERS: 1n << 1n,
  ADMINISTRATOR: 1n << 3n,
  MANAGE_GUILD: 1n << 5n,
  VIEW_CHANNEL: 1n << 10n,
  SEND_MESSAGES: 1n << 11n,
  MANAGE_MESSAGES: 1n << 13n,
  CONNECT: 1n << 20n,
  MANAGE_THREADS: 1n << 34n,
  CREATE_PUBLIC_THREADS: 1n << 35n,
  CREATE_PRIVATE_THREADS: 1n << 36n,
  SEND_MESSAGES_IN_THREADS: 1n << 38n,
  MODERATE_MEMBERS: 1n << 40n,
};
const bits = (names: string[]) => names.reduce((a, n) => a | (PERMS[n] ?? 0n), 0n);

/** Templates the web app may offer as installable. Call it without requiring a Discord session. */
export async function listLivenestTemplates(
  db: Db,
): Promise<Array<{ id: string; name: string; category: string }>> {
  const { data, error } = await db
    .from("livenest_templates")
    .select("id,name,category")
    .eq("installable", true);
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getLivenestTemplate(db: Db, id: string): Promise<TemplateRow | null> {
  const { data, error } = await db
    .from("livenest_templates")
    .select("id,name,category,spec")
    .eq("id", id)
    .eq("installable", true)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data ?? null;
}

// ---------------------------------------------------------------- naming

/** Spanish names for the most common channel and category words. Anything else keeps its name. */
const ES: Record<string, string> = {
  welcome: "bienvenida",
  rules: "reglas",
  announcements: "anuncios",
  news: "noticias",
  roles: "roles",
  "choose-roles": "elegir-roles",
  general: "general",
  chat: "chat",
  introductions: "presentaciones",
  memes: "memes",
  media: "multimedia",
  clips: "clips",
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
  "looking-for-group": "buscar-grupo",
  lfg: "buscar-grupo",
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
  // categories (matched case-insensitively)
  "start here": "empieza aquí",
  start: "inicio",
  community: "comunidad",
  hangout: "quedada",
  voice: "voz",
  staff: "staff",
  team: "equipo",
  creative: "creativo",
  play: "juego",
  learn: "aprender",
  markets: "mercados",
  signals: "señales",
  live: "en directo",
  fans: "fans",
  members: "miembros",
  press: "prensa",
  playtest: "pruebas",
  campaigns: "campañas",
  tables: "mesas",
};

/** Splits "🌷︱welcome" / "👋・WELCOME" into a decorative prefix and the words. */
function splitName(name: string) {
  const m = name.match(/^(.*?[︱・⋆]\s*)(.+)$/u);
  return m ? { prefix: m[1], base: m[2] } : { prefix: "", base: name };
}

function localize(name: string, mode: NameMode, isCategory: boolean) {
  if (mode === "en") return name;
  const { prefix, base } = splitName(name);
  if (base.includes("・")) return name; // already bilingual
  const es = ES[base.toLowerCase()];
  if (!es || es === base.toLowerCase()) return name;
  const esCased = isCategory && base === base.toUpperCase() ? es.toUpperCase() : es;
  const sep = isCategory ? " · " : "・";
  return mode === "es" ? `${prefix}${esCased}` : `${prefix}${base}${sep}${esCased}`;
}

// ---------------------------------------------------------------- Discord

async function discord<T>(
  token: string,
  path: string,
  init: RequestInit = {},
  attempt = 0,
): Promise<T> {
  const res = await fetch(DISCORD + path, {
    ...init,
    headers: {
      Authorization: `Bot ${token}`,
      "content-type": "application/json",
      ...(init.headers ?? {}),
    },
  });
  if (res.status === 429 && attempt < 5) {
    const body = await res.json().catch(() => ({}));
    await new Promise((r) =>
      setTimeout(r, Math.ceil(((body as { retry_after?: number }).retry_after ?? 1) * 1000)),
    );
    return discord<T>(token, path, init, attempt + 1);
  }
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Discord ${res.status}: ${text.slice(0, 200)}`);
  }
  return (res.status === 204 ? undefined : await res.json()) as T;
}

const norm = (s: string) => s.trim().toLowerCase();
const TEXT_LIKE = [0, 5, 15];
const STAFF_SUFFIXES = ["owner", "administrator", "admin", "moderator", "support"];
const isStaff = (roleName: string) =>
  STAFF_SUFFIXES.includes(norm(roleName).split("・").pop() ?? "");

export type InstallResult = {
  ok: boolean;
  created: number;
  skipped: number;
  failed: number;
  community: boolean;
  log: string[];
  /** Set when something failed, so the web app shows the failure instead of success. */
  error?: string;
};

/**
 * Builds a template in a guild. Existing roles/categories/channels with the same name are
 * reused (never modified or deleted). Forum and announcement channels need a Community
 * server; elsewhere — or if Discord refuses — they are created as text channels.
 */
export async function installLivenestTemplate(opts: {
  guildId: string;
  spec: TemplateSpec;
  language?: NameMode;
  botToken: string;
}): Promise<InstallResult> {
  const { guildId, spec, botToken } = opts;
  const mode: NameMode = opts.language === "es" || opts.language === "both" ? opts.language : "en";
  const log: string[] = [];
  let created = 0;
  let skipped = 0;
  let failed = 0;

  const [roles, channels, guild] = await Promise.all([
    discord<Role[]>(botToken, `/guilds/${guildId}/roles`),
    discord<Channel[]>(botToken, `/guilds/${guildId}/channels`),
    discord<{ features?: string[] }>(botToken, `/guilds/${guildId}`),
  ]);
  const community = Boolean(guild.features?.includes("COMMUNITY"));
  const everyone = roles.find((r) => r.name === "@everyone")?.id ?? guildId;

  // Roles
  for (const r of spec.roles) {
    if (roles.some((x) => norm(x.name) === norm(r.name))) {
      skipped++;
      continue;
    }
    const create = (permissions: string) =>
      discord<Role>(botToken, `/guilds/${guildId}/roles`, {
        method: "POST",
        body: JSON.stringify({
          name: r.name,
          color: parseInt(r.color.replace("#", ""), 16),
          hoist: Boolean(r.hoist),
          permissions,
        }),
      });
    try {
      let role: Role;
      try {
        role = await create(bits(r.permissions).toString());
      } catch (e) {
        // The bot cannot grant permissions it doesn't hold (e.g. Administrator); keep the role, drop the perms.
        if (!r.permissions.length || !String((e as Error).message).includes("403")) throw e;
        role = await create("0");
        log.push(
          `role ${r.name}: created without permissions (the bot lacks ${r.permissions.join(", ")})`,
        );
      }
      roles.push(role);
      created++;
    } catch (e) {
      failed++;
      log.push(`role ${r.name}: ${(e as Error).message}`);
    }
  }
  const roleId = (name: string) => roles.find((x) => norm(x.name) === norm(name))?.id;
  const staffIds = roles.filter((x) => isStaff(x.name)).map((x) => x.id);

  // Categories and channels
  for (const cat of spec.categories) {
    const catName = localize(cat.name, mode, true);
    let parent = channels.find((c) => c.type === 4 && norm(c.name) === norm(catName));
    try {
      if (!parent) {
        const ow: Overwrite[] = cat.privateTo
          ? [
              { id: everyone, type: 0, allow: "0", deny: PERMS.VIEW_CHANNEL.toString() },
              ...cat.privateTo
                .map(roleId)
                .filter((id): id is string => Boolean(id))
                .map((id) => ({
                  id,
                  type: 0 as const,
                  allow: PERMS.VIEW_CHANNEL.toString(),
                  deny: "0",
                })),
            ]
          : [];
        parent = await discord<Channel>(botToken, `/guilds/${guildId}/channels`, {
          method: "POST",
          body: JSON.stringify({ name: catName, type: 4, permission_overwrites: ow }),
        });
        channels.push(parent);
        created++;
      } else {
        skipped++;
      }
    } catch (e) {
      failed++;
      log.push(`category ${catName}: ${(e as Error).message}`);
      continue;
    }

    for (const ch of cat.channels) {
      const name = localize(ch.name, mode, false);
      const exists = channels.find(
        (c) =>
          norm(c.name) === norm(name) &&
          (ch.kind === "voice" ? c.type === 2 : TEXT_LIKE.includes(c.type)),
      );
      if (exists) {
        skipped++;
        continue;
      }
      const type =
        ch.kind === "voice"
          ? 2
          : community && ch.kind === "forum"
            ? 15
            : community && ch.kind === "announcement"
              ? 5
              : 0;
      const ow: Overwrite[] = ch.readOnly
        ? [
            {
              id: everyone,
              type: 0,
              allow: "0",
              deny: bits([
                "SEND_MESSAGES",
                "CREATE_PUBLIC_THREADS",
                "CREATE_PRIVATE_THREADS",
              ]).toString(),
            },
            ...staffIds.map((id) => ({
              id,
              type: 0 as const,
              allow: PERMS.SEND_MESSAGES.toString(),
              deny: "0",
            })),
          ]
        : [];
      const body = (t: number) =>
        JSON.stringify({
          name,
          type: t,
          parent_id: parent!.id,
          ...(ch.topic && t !== 2 ? { topic: ch.topic } : {}),
          ...(ow.length ? { permission_overwrites: ow } : {}),
        });
      try {
        let made: Channel;
        try {
          made = await discord<Channel>(botToken, `/guilds/${guildId}/channels`, {
            method: "POST",
            body: body(type),
          });
        } catch (e) {
          if (type !== 5 && type !== 15) throw e;
          made = await discord<Channel>(botToken, `/guilds/${guildId}/channels`, {
            method: "POST",
            body: body(0),
          });
          log.push(
            `#${name}: created as text (${type === 15 ? "forum" : "announcement"} not available)`,
          );
        }
        channels.push(made);
        created++;
      } catch (e) {
        failed++;
        log.push(`#${name}: ${(e as Error).message}`);
      }
    }
  }

  return {
    ok: failed === 0,
    created,
    skipped,
    failed,
    community,
    log,
    ...(failed ? { error: `${failed} item(s) failed — ${log[0] ?? "see log"}` } : {}),
  };
}
