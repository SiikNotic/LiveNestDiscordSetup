import { Hash, Lock, Volume2, Eye } from "lucide-react";

import { useLang } from "@/lib/i18n";
import {
  CATEGORIES,
  MODERATOR_PERMS,
  ROLES,
  SUPPORT_PERMS,
  type PermName,
} from "@/lib/livenest-blueprint";

export function RoleChip({ name, color }: { name: string; color: string }) {
  return (
    <span
      className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium"
      style={{ borderColor: `${color}55`, backgroundColor: `${color}14`, color }}
    >
      <span className="size-2 rounded-full" style={{ backgroundColor: color }} />
      {name}
    </span>
  );
}

export function RolesGrid() {
  const { lang } = useLang();
  return (
    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
      {ROLES.map((r) => (
        <div
          key={r.name}
          className="flex items-center justify-between gap-3 rounded-lg border border-border bg-surface-2/60 px-3 py-2.5"
        >
          <RoleChip name={r.name} color={r.color} />
          <span className="font-mono text-[11px] text-muted-foreground">{r.color}</span>
        </div>
      ))}
      <p className="col-span-full text-xs text-muted-foreground">
        {lang === "en"
          ? "Administrator permission is reserved for Owner. All other roles receive only the permissions they need."
          : "El permiso Administrator se reserva para Owner. El resto de roles recibe solo los permisos necesarios."}
      </p>
    </div>
  );
}

export function StructureView() {
  const { t, lang } = useLang();
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {CATEGORIES.map((cat) => (
        <div key={cat.name} className="rounded-xl border border-border bg-surface-2/50 p-4">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-display text-sm font-semibold tracking-wide text-metal">
              {cat.name}
            </h3>
            {cat.privateTo ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-destructive/15 px-2 py-0.5 text-[10px] uppercase tracking-wide text-destructive">
                <Lock className="size-3" /> {t("private")}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[10px] uppercase tracking-wide text-muted-foreground">
                <Eye className="size-3" /> {t("publicCat")}
              </span>
            )}
          </div>
          {cat.privateTo && (
            <p className="mt-1.5 text-[11px] text-muted-foreground">
              {lang === "en" ? "Visible to" : "Visible para"}: {cat.privateTo.join(", ")}
            </p>
          )}
          <ul className="mt-3 space-y-1.5">
            {cat.channels.map((ch) => (
              <li key={ch.name} className="flex items-center gap-2 text-sm text-foreground/90">
                {ch.kind === "voice" ? (
                  <Volume2 className="size-3.5 shrink-0 text-blue" />
                ) : (
                  <Hash className="size-3.5 shrink-0 text-muted-foreground" />
                )}
                <span className="truncate">{ch.name}</span>
                {ch.readOnly && (
                  <span className="rounded bg-primary/15 px-1.5 py-0.5 text-[10px] text-primary">
                    {t("readOnly")}
                  </span>
                )}
                {ch.languageRole && (
                  <span className="rounded bg-blue/15 px-1.5 py-0.5 text-[10px] text-blue">
                    {ch.languageRole}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

const MATRIX_PERMS: PermName[] = [
  "VIEW_CHANNEL",
  "SEND_MESSAGES",
  "MANAGE_MESSAGES",
  "MANAGE_THREADS",
  "MODERATE_MEMBERS",
  "KICK_MEMBERS",
  "CONNECT",
  "SPEAK",
];

const LABELS: Record<string, { en: string; es: string }> = {
  VIEW_CHANNEL: { en: "View", es: "Ver" },
  SEND_MESSAGES: { en: "Send", es: "Enviar" },
  MANAGE_MESSAGES: { en: "Manage msgs", es: "Gestionar msgs" },
  MANAGE_THREADS: { en: "Threads", es: "Hilos" },
  MODERATE_MEMBERS: { en: "Timeout", es: "Silenciar" },
  KICK_MEMBERS: { en: "Kick", es: "Expulsar" },
  CONNECT: { en: "Connect", es: "Conectar" },
  SPEAK: { en: "Speak", es: "Hablar" },
};

export function PermissionMatrix() {
  const { lang } = useLang();
  const rows: { role: string; perms: readonly PermName[] }[] = [
    { role: "Moderator", perms: MODERATOR_PERMS },
    { role: "Support", perms: SUPPORT_PERMS },
    { role: "Member", perms: ["VIEW_CHANNEL", "SEND_MESSAGES", "CONNECT", "SPEAK"] },
    { role: "New Member", perms: ["VIEW_CHANNEL", "SEND_MESSAGES"] },
    { role: "Bot", perms: [] },
  ];
  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full min-w-[640px] text-sm">
        <thead className="bg-surface-2 text-xs uppercase tracking-wide text-muted-foreground">
          <tr>
            <th className="px-3 py-2.5 text-left font-medium">Rol</th>
            {MATRIX_PERMS.map((p) => (
              <th key={p} className="px-3 py-2.5 text-center font-medium">
                {LABELS[p][lang]}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const color = ROLES.find((r) => r.name === row.role)?.color ?? "#ffffff";
            return (
              <tr key={row.role} className="border-t border-border">
                <td className="px-3 py-2.5">
                  <RoleChip name={row.role} color={color} />
                </td>
                {MATRIX_PERMS.map((p) => (
                  <td key={p} className="px-3 py-2.5 text-center">
                    {row.perms.includes(p) ? (
                      <span className="text-success">●</span>
                    ) : (
                      <span className="text-muted-foreground/40">—</span>
                    )}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}