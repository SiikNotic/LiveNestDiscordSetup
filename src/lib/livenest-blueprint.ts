/**
 * LiveNest server blueprint — the single source of truth for the desired
 * Discord structure. Client-safe (no secrets, no server-only imports).
 */

export const PERM = {
  KICK_MEMBERS: 1n << 1n,
  ADD_REACTIONS: 1n << 6n,
  VIEW_CHANNEL: 1n << 10n,
  SEND_MESSAGES: 1n << 11n,
  MANAGE_MESSAGES: 1n << 13n,
  EMBED_LINKS: 1n << 14n,
  ATTACH_FILES: 1n << 15n,
  READ_MESSAGE_HISTORY: 1n << 16n,
  USE_EXTERNAL_EMOJIS: 1n << 18n,
  CONNECT: 1n << 20n,
  SPEAK: 1n << 21n,
  USE_VAD: 1n << 25n,
  MANAGE_THREADS: 1n << 34n,
  CREATE_PUBLIC_THREADS: 1n << 35n,
  CREATE_PRIVATE_THREADS: 1n << 36n,
  USE_EXTERNAL_STICKERS: 1n << 37n,
  SEND_MESSAGES_IN_THREADS: 1n << 38n,
  MODERATE_MEMBERS: 1n << 40n,
  MANAGE_GUILD: 1n << 5n,
  ADMINISTRATOR: 1n << 3n,
} as const;

export type PermName = keyof typeof PERM;

export const bits = (names: readonly PermName[]): bigint =>
  names.reduce((acc, n) => acc | PERM[n], 0n);

const BASE_TEXT: readonly PermName[] = [
  "VIEW_CHANNEL",
  "SEND_MESSAGES",
  "SEND_MESSAGES_IN_THREADS",
  "CREATE_PUBLIC_THREADS",
  "CREATE_PRIVATE_THREADS",
  "EMBED_LINKS",
  "ATTACH_FILES",
  "READ_MESSAGE_HISTORY",
  "ADD_REACTIONS",
  "USE_EXTERNAL_EMOJIS",
  "USE_EXTERNAL_STICKERS",
];

const VOICE_BASE: readonly PermName[] = ["CONNECT", "SPEAK", "USE_VAD"];

export const MODERATOR_PERMS: readonly PermName[] = [
  ...BASE_TEXT,
  "MANAGE_MESSAGES",
  "MANAGE_THREADS",
  "MODERATE_MEMBERS",
  "KICK_MEMBERS",
  ...VOICE_BASE,
];

export const SUPPORT_PERMS: readonly PermName[] = [
  ...BASE_TEXT,
  "MANAGE_MESSAGES",
  ...VOICE_BASE,
];

export type RoleSpec = {
  name: string;
  color: string;
  /** Global guild permissions granted to the role (least privilege). */
  permissions: readonly PermName[];
  hoist?: boolean;
  mentionable?: boolean;
  note?: string;
  noteEs?: string;
};

/** Ordered from highest to lowest; used for role position ordering. */
export const ROLES: readonly RoleSpec[] = [
  {
    name: "Owner",
    color: "#D4AF37",
    permissions: ["ADMINISTRATOR"],
    hoist: true,
    note: "Server owner role. Administrator is intentionally limited to this role only.",
    noteEs: "Rol de propietario. Administrator se limita intencionadamente solo a este rol.",
  },
  {
    name: "Administrator",
    color: "#B8860B",
    permissions: [...MODERATOR_PERMS, "MANAGE_GUILD"],
    hoist: true,
    note: "Elevated management without the Administrator flag.",
    noteEs: "Gestión avanzada sin el permiso Administrator.",
  },
  { name: "Moderator", color: "#5865F2", permissions: MODERATOR_PERMS, hoist: true },
  { name: "Support", color: "#00B8A9", permissions: SUPPORT_PERMS, hoist: true },
  { name: "New Member", color: "#A7A9AC", permissions: [] },
  { name: "Member", color: "#E5E7EB", permissions: [] },
  { name: "Partner", color: "#C084FC", permissions: [] },
  { name: "English", color: "#3B82F6", permissions: [] },
  { name: "Español", color: "#EF4444", permissions: [] },
  { name: "Beta Tester", color: "#F59E0B", permissions: [] },
  { name: "LiveNestApp Tester", color: "#22C55E", permissions: [] },
  { name: "Carta Casino Tester", color: "#C9A227", permissions: [] },
  { name: "Premium", color: "#E5B8FF", permissions: [] },
  {
    name: "Bot",
    color: "#64748B",
    permissions: [],
    note: "No global permissions; grant per-integration instead.",
    noteEs: "Sin permisos globales; se conceden por integración.",
  },
];

/**
 * forum and announcement need a Community-enabled server; elsewhere they are
 * created as plain text channels so a template always installs.
 */
export type ChannelKind = "text" | "voice" | "forum" | "announcement";

export type ChannelSpec = {
  name: string;
  kind: ChannelKind;
  /** Channel topic, set only when the channel is created so later edits are kept. */
  topic?: string;
  /** Read-only for regular members (@everyone denied Send Messages). */
  readOnly?: boolean;
  /** Restrict viewing to holders of these roles (plus the category staff). */
  languageRole?: "English" | "Español";
};

export type CategorySpec = {
  name: string;
  /** @everyone denied View Channel; only these roles may view. */
  privateTo?: readonly string[];
  channels: readonly ChannelSpec[];
};

export const CATEGORIES: readonly CategorySpec[] = [
  {
    name: "WELCOME・BIENVENIDA",
    channels: [
      { name: "welcome・bienvenida", kind: "text", readOnly: true },
      { name: "rules・reglas", kind: "text", readOnly: true },
      { name: "choose-language・idioma", kind: "text", readOnly: true },
      { name: "announcements・anuncios", kind: "text", readOnly: true },
    ],
  },
  {
    name: "COMPANY・EMPRESA",
    channels: [
      { name: "company-news・noticias", kind: "text", readOnly: true },
      { name: "roadmap・hoja-de-ruta", kind: "text", readOnly: true },
      { name: "community・comunidad", kind: "text" },
    ],
  },
  {
    name: "LIVEST APP",
    channels: [
      { name: "livenest-updates・actualizaciones", kind: "text", readOnly: true },
      { name: "livenest-community・comunidad", kind: "text" },
      { name: "livenest-bugs・errores", kind: "text" },
      { name: "livenest-feedback・opiniones", kind: "text" },
    ],
  },
  {
    name: "CARTA CASINO",
    channels: [
      { name: "carta-updates・actualizaciones", kind: "text", readOnly: true },
      { name: "carta-community・comunidad", kind: "text" },
      { name: "carta-bugs・errores", kind: "text" },
      { name: "carta-feedback・opiniones", kind: "text" },
      { name: "carta-giveaways・sorteos", kind: "text", readOnly: true },
    ],
  },
  {
    name: "BETA TESTING・PRUEBAS",
    privateTo: ["Owner", "Administrator", "Moderator", "Beta Tester"],
    channels: [
      { name: "beta-program・programa-beta", kind: "text" },
      { name: "beta-announcements・anuncios-beta", kind: "text", readOnly: true },
    ],
  },
  {
    name: "SUPPORT・SOPORTE",
    privateTo: ["Owner", "Administrator", "Moderator", "Support"],
    channels: [
      { name: "ai-support・soporte-ia", kind: "text" },
      { name: "open-ticket・abrir-ticket", kind: "text" },
      { name: "faq・preguntas-frecuentes", kind: "text", readOnly: true },
    ],
  },
  {
    name: "VOICE・VOZ",
    channels: [
      { name: "english-lobby", kind: "voice", languageRole: "English" },
      { name: "english-gaming", kind: "voice", languageRole: "English" },
      { name: "english-music", kind: "voice", languageRole: "English" },
      { name: "sala-español", kind: "voice", languageRole: "Español" },
      { name: "juegos-español", kind: "voice", languageRole: "Español" },
      { name: "música-español", kind: "voice", languageRole: "Español" },
    ],
  },
  {
    name: "OFFICE・OFICINA",
    privateTo: ["Owner", "Administrator", "Moderator", "Support"],
    channels: [
      { name: "management・administración", kind: "text" },
      { name: "beta-management・gestión-beta", kind: "text" },
      { name: "beta-inbox・entrada-beta", kind: "text" },
      { name: "beta-decisions・decisiones-beta", kind: "text" },
      { name: "support-management・gestión-soporte", kind: "text" },
      { name: "moderation-logs・logs-moderación", kind: "text" },
      { name: "bot-logs・logs-bots", kind: "text" },
      { name: "bot-control・control-bots", kind: "text" },
    ],
  },
];

/** Channels Discord ships by default that are commonly leftovers. */
export const LEFTOVER_HINTS = ["general", "moderator-only", "off-topic"];

export const hexToInt = (hex: string) => parseInt(hex.replace("#", ""), 16);

export type AuditAction = "create" | "update" | "skip" | "review";

export type AuditItem = {
  id: string;
  type: "role" | "category" | "channel" | "permission" | "leftover";
  name: string;
  action: AuditAction;
  detail: string;
  detailEs: string;
  parent?: string;
};

export type AuditReport = {
  guildId: string;
  guildName: string;
  botInGuild: boolean;
  /** False when forum/announcement channels in the template will be created as text. */
  community?: boolean;
  items: AuditItem[];
  counts: Record<AuditAction, number>;
};

export type ApplyLogEntry = {
  ts: number;
  level: "info" | "success" | "warn" | "error";
  message: string;
  messageEs: string;
};

export type ApplyResult = {
  log: ApplyLogEntry[];
  created: number;
  updated: number;
  skipped: number;
  failed: number;
};