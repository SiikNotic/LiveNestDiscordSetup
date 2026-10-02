import { SERVER_TEMPLATES, CURATED_TEMPLATE_IDS } from "../lib/server-templates";
import type { ChannelKind } from "../lib/livenest-blueprint";

export type Lang = "en" | "es";
export type Channel = { name: string; kind: ChannelKind };
export type Category = { name: string; channels: Channel[] };
export type Role = { name: string; color: string };

export type CatalogTemplate = {
  id: string;
  name: string;
  category: string;
  desc: string;
  descEs: string;
  accent: string;
  secondary: string;
  tagline: string;
  categories: Category[];
  roles: Role[];
  /** Installable today through the LiveNest installer (Supabase discord-server function). */
  installable: boolean;
  isNew: boolean;
  /** Welcome text shown in the preview chat pane. */
  chat?: string;
  // Counts kept for the Builder, which shows them in its review step.
  channels: number;
  roleCount: number;
};

type BackendTemplate = {
  id: string;
  name: string;
  category: string;
  desc: string;
  descEs: string;
  accent: string;
  secondary: string;
  tagline: string;
  roleNames: string[];
  chat: string;
  preview: Array<[string, string[]]>;
};

/**
 * The six templates the installer knows. Their structure must match what the
 * installer creates, so this mirrors the previous App.tsx data one-to-one.
 */
const BACKEND: BackendTemplate[] = [
  {
    id: "gaming-community",
    name: "Gaming Community",
    category: "Gaming",
    desc: "A full gaming community blueprint built around LFG, game talk, clips, events and clean staff separation.",
    descEs:
      "Una comunidad gaming completa con LFG, charla de juegos, clips, eventos y un área de staff separada.",
    accent: "#d4af37",
    secondary: "#a855f7",
    tagline: "LFG • CLIPS • EVENTS",
    roleNames: ["Owner", "Admin", "Moderator", "Event Host", "VIP", "Member"],
    chat: "Welcome to the gaming floor. Pick your games, find a squad, and jump into the next event.",
    preview: [
      ["START HERE", ["welcome", "rules", "announcements"]],
      ["COMMUNITY", ["general", "introductions"]],
      ["GAMES", ["looking-for-group", "clips", "game-chat"]],
      ["EVENTS", ["events"]],
      ["VOICE", ["🔊 lobby", "🔊 gaming-room"]],
      ["STAFF", ["staff-chat"]],
    ],
  },
  {
    id: "streamer-hub",
    name: "Streamer Hub",
    category: "Streaming",
    desc: "A creator-first community with live alerts, fan interaction, clips, creator resources and private creator space.",
    descEs:
      "Una comunidad pensada para creadores: avisos de directo, interacción con fans, clips y un espacio privado.",
    accent: "#8b5cf6",
    secondary: "#22d3ee",
    tagline: "LIVE • CLIPS • FANS",
    roleNames: ["Streamer", "Creator", "Moderator", "VIP", "Follower"],
    chat: "The creator is live. Use this space for the live conversation, clips, community posts and fan requests.",
    preview: [
      ["START HERE", ["welcome", "rules", "announcements"]],
      ["CREATOR", ["creator-chat", "content-plans"]],
      ["LIVE & CONTENT", ["live-now", "clips", "stream-highlights"]],
      ["COMMUNITY", ["general"]],
      ["VOICE", ["🔊 live-lounge", "🔊 community-room"]],
    ],
  },
  {
    id: "fivem-roleplay",
    name: "FiveM Roleplay",
    category: "Roleplay",
    desc: "A serious FiveM RP structure for civilian life, departments, applications, player reports and staff operations.",
    descEs:
      "Una estructura FiveM RP seria: vida civil, departamentos, solicitudes, reportes de jugadores y staff.",
    accent: "#22c55e",
    secondary: "#38bdf8",
    tagline: "CITY • DEPARTMENTS • WHITELIST",
    roleNames: ["Owner", "Director", "Staff", "Police", "EMS", "Civilian"],
    chat: "Welcome to the city. Read the rules, choose your department path and keep roleplay organized.",
    preview: [
      ["START HERE", ["welcome", "server-rules", "announcements"]],
      ["CITY LIFE", ["general", "character-chat"]],
      ["DEPARTMENTS", ["police", "ems"]],
      ["APPLICATIONS", ["whitelist"]],
      ["SUPPORT", ["player-reports", "tickets"]],
      ["STAFF", ["staff-chat", "🔊 staff-room"]],
    ],
  },
  {
    id: "anime-community",
    name: "Anime Community",
    category: "Anime",
    desc: "An otaku-focused community for seasonal anime, manga, recommendations, fan art, memes and watch parties.",
    descEs:
      "Una comunidad otaku para anime de temporada, manga, recomendaciones, fanart, memes y watch parties.",
    accent: "#ec4899",
    secondary: "#a78bfa",
    tagline: "SEASONAL • MANGA • WATCH PARTY",
    roleNames: ["Owner", "Moderator", "Otaku", "Manga Reader", "VIP"],
    chat: "Welcome, otaku. Talk about the current season, trade recommendations, share fan art and join the next watch party.",
    preview: [
      ["WELCOME", ["welcome", "rules", "announcements"]],
      ["ANIME", ["seasonal-anime", "anime-chat", "recommendations"]],
      ["MANGA & MEDIA", ["manga", "fan-art"]],
      ["COMMUNITY", ["general"]],
      ["WATCH PARTY", ["🔊 watch-party", "🔊 chill-room"]],
    ],
  },
  {
    id: "tech-ai",
    name: "Tech & AI Hub",
    category: "Tech",
    desc: "A developer workspace for coding help, AI experiments, project showcases, GitHub collaboration and builder support.",
    descEs:
      "Un espacio para desarrolladores: ayuda con código, experimentos de IA, proyectos y colaboración en GitHub.",
    accent: "#38bdf8",
    secondary: "#6366f1",
    tagline: "CODE • AI LAB • PROJECTS",
    roleNames: ["Owner", "Admin", "Developer", "AI Builder", "Member"],
    chat: "Build, ship and share. Use the development channels for code, the AI lab for experiments and projects for showcases.",
    preview: [
      ["START HERE", ["welcome", "rules", "announcements"]],
      ["DEVELOPMENT", ["coding-help", "github", "showcase"]],
      ["AI LAB", ["ai-chat", "prompts"]],
      ["PROJECTS", ["project-talk"]],
      ["VOICE", ["🔊 dev-lounge", "🔊 build-room"]],
    ],
  },
  {
    id: "study-campus",
    name: "Study Campus",
    category: "Study",
    desc: "A focused campus layout for subjects, study rooms, resources, accountability and quiet voice sessions.",
    descEs:
      "Un campus para concentrarse: asignaturas, salas de estudio, recursos, metas y salas de voz tranquilas.",
    accent: "#f59e0b",
    secondary: "#fb7185",
    tagline: "SUBJECTS • FOCUS • RESOURCES",
    roleNames: ["Owner", "Moderator", "Study Lead", "Student"],
    chat: "Welcome to campus. Pick your subjects, find a study partner and use the focus rooms when it is time to work.",
    preview: [
      ["WELCOME", ["welcome", "rules", "announcements"]],
      ["CAMPUS", ["general", "introductions"]],
      ["SUBJECTS", ["math-science", "languages"]],
      ["RESOURCES", ["resources"]],
      ["STUDY ROOMS", ["🔊 focus-room", "🔊 study-lounge"]],
    ],
  },
];

// The installer decides role colours; show them neutral rather than invent colours.
const ROLE_NEUTRAL = "#949ba4";

function fromBackend(t: BackendTemplate): CatalogTemplate {
  const categories = t.preview.map(([name, chans]) => ({
    name,
    channels: chans.map((c) =>
      c.startsWith("🔊 ")
        ? { name: c.slice(3), kind: "voice" as const }
        : { name: c, kind: "text" as const },
    ),
  }));
  return {
    id: t.id,
    name: t.name,
    category: t.category,
    desc: t.desc,
    descEs: t.descEs,
    accent: t.accent,
    secondary: t.secondary,
    tagline: t.tagline,
    categories,
    roles: t.roleNames.map((name) => ({ name, color: ROLE_NEUTRAL })),
    installable: true,
    isNew: false,
    chat: t.chat,
    channels: categories.reduce((n, c) => n + c.channels.length, 0),
    roleCount: t.roleNames.length,
  };
}

const installableIds = new Set(BACKEND.map((t) => t.id));

const upcoming: CatalogTemplate[] = SERVER_TEMPLATES.filter((t) => !installableIds.has(t.id)).map(
  (t) => {
    const categories = t.categories.map((c) => ({
      name: c.name,
      channels: c.channels.map((ch) => ({ name: ch.name, kind: ch.kind })),
    }));
    return {
      id: t.id,
      name: t.name,
      category: t.category,
      desc: t.description,
      descEs: t.descriptionEs,
      accent: t.theme.accent,
      secondary: t.theme.secondary,
      tagline: t.theme.tagline,
      categories,
      roles: t.roles.map((r) => ({ name: r.name, color: r.color })),
      installable: false,
      isNew: CURATED_TEMPLATE_IDS.has(t.id),
      channels: categories.reduce((n, c) => n + c.channels.length, 0),
      roleCount: t.roles.length,
    };
  },
);

/** Installable first, then the hand-picked new ones, then the rest of the catalog. */
export const CATALOG: CatalogTemplate[] = [
  ...BACKEND.map(fromBackend),
  ...upcoming.filter((t) => t.isNew),
  ...upcoming.filter((t) => !t.isNew),
];

export const INSTALLABLE = CATALOG.filter((t) => t.installable);

/** LiveNest installer (Supabase edge functions). */
export const API = "https://zxpentlarsbdilmyfxfc.supabase.co/functions/v1";

/**
 * Marks templates as installable once the installer reports them (action=templates).
 * Mutates the shared catalog in place and returns true when anything changed, so the
 * caller can re-render. Unknown ids are ignored.
 */
export function activateTemplates(ids: Iterable<string>): boolean {
  const wanted = new Set(ids);
  let changed = false;
  for (const t of CATALOG) {
    if (!t.installable && wanted.has(t.id)) {
      t.installable = true;
      INSTALLABLE.push(t);
      changed = true;
    }
  }
  return changed;
}

/** Asks the installer which templates it can build; silently keeps the defaults on any failure. */
export async function fetchInstallableIds(session?: string): Promise<string[]> {
  try {
    const r = await fetch(`${API}/discord-server?action=templates`, {
      headers: session ? { Authorization: `Bearer ${session}` } : {},
    });
    if (!r.ok) return [];
    const d = (await r.json()) as { templates?: Array<{ id: string } | string>; ids?: string[] };
    const list = d.templates ?? d.ids ?? [];
    return list.map((x) => (typeof x === "string" ? x : x.id)).filter(Boolean);
  } catch {
    return [];
  }
}

export const CATEGORY_ES: Record<string, string> = {
  Gaming: "Gaming",
  Roleplay: "Roleplay",
  Community: "Comunidad",
  Streaming: "Streaming",
  Friends: "Amigos",
  Creator: "Creadores",
  Anime: "Anime",
  Tech: "Tecnología",
  Study: "Estudio",
  Music: "Música",
  Sports: "Deportes",
  Business: "Negocios",
  Art: "Arte",
  Lifestyle: "Estilo de vida",
};

export const CATEGORIES = Array.from(new Set(CATALOG.map((t) => t.category)));

export function readLang(): Lang {
  try {
    const v = localStorage.getItem("livenest-lang");
    if (v === "es" || v === "en") return v;
  } catch {
    /* storage blocked */
  }
  return navigator.language?.toLowerCase().startsWith("es") ? "es" : "en";
}

export function writeLang(l: Lang) {
  try {
    localStorage.setItem("livenest-lang", l);
  } catch {
    /* storage blocked */
  }
}
