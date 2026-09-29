import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader, setResponseHeader } from "@tanstack/react-start/server";

import {
  LEFTOVER_HINTS,
  PERM,
  bits,
  hexToInt,
  type ApplyLogEntry,
  type ApplyResult,
  type AuditItem,
  type AuditReport,
  type CategorySpec,
  type ChannelSpec,
} from "./livenest-blueprint";
import { getServerTemplate } from "./server-templates";

type DiscordRole = {
  id: string;
  name: string;
  color: number;
  permissions: string;
  position: number;
  managed: boolean;
};

type Overwrite = { id: string; type: number; allow: string; deny: string };

type DiscordChannel = {
  id: string;
  name: string;
  type: number;
  parent_id: string | null;
  position: number;
  permission_overwrites?: Overwrite[];
};

type DiscordGuild = { id: string; name: string; icon: string | null; permissions?: string };

const STAFF = ["Owner", "Administrator", "Moderator"] as const;

function token(): string | null {
  const cookie = getRequestHeader("cookie") ?? null;
  if (!cookie) return null;
  for (const part of cookie.split(";")) {
    const idx = part.indexOf("=");
    if (idx === -1) continue;
    if (part.slice(0, idx).trim() === "ln_discord_session") {
      return decodeURIComponent(part.slice(idx + 1).trim());
    }
  }
  return null;
}

export const getStatus = createServerFn({ method: "GET" }).handler(async () => {
  const { getCreds, userRequest } = await import("./discord.server");
  const configured = getCreds() !== null;
  const t = token();
  if (!configured || !t) return { configured, user: null };
  try {
    const user = await userRequest<{ id: string; username: string; global_name?: string; avatar: string | null }>(
      t,
      "/users/@me",
    );
    return {
      configured,
      user: {
        id: user.id,
        name: user.global_name || user.username,
        avatar: user.avatar
          ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=64`
          : null,
      },
    };
  } catch {
    return { configured, user: null };
  }
});

export const logout = createServerFn({ method: "POST" }).handler(async () => {
  const { clearedCookie } = await import("./discord.server");
  setResponseHeader("Set-Cookie", clearedCookie(true));
  return { ok: true };
});

export const listGuilds = createServerFn({ method: "GET" }).handler(async () => {
  const { userRequest } = await import("./discord.server");
  const t = token();
  if (!t) throw new Error("Not connected to Discord");
  const guilds = await userRequest<DiscordGuild[]>(t, "/users/@me/guilds");
  const manageable = guilds.filter((g) => {
    const p = BigInt(g.permissions ?? "0");
    return (p & PERM.MANAGE_GUILD) === PERM.MANAGE_GUILD || (p & PERM.ADMINISTRATOR) === PERM.ADMINISTRATOR;
  });
  return manageable.map((g) => ({
    id: g.id,
    name: g.name,
    icon: g.icon ? `https://cdn.discordapp.com/icons/${g.id}/${g.icon}.png?size=96` : null,
  }));
});

async function assertGuildAccess(guildId: string) {
  const { userRequest } = await import("./discord.server");
  const t = token();
  if (!t) throw new Error("Not connected to Discord");
  const guilds = await userRequest<DiscordGuild[]>(t, "/users/@me/guilds");
  const guild = guilds.find((g) => g.id === guildId);
  if (!guild) throw new Error("You do not have access to this server");
  const p = BigInt(guild.permissions ?? "0");
  if ((p & PERM.MANAGE_GUILD) !== PERM.MANAGE_GUILD && (p & PERM.ADMINISTRATOR) !== PERM.ADMINISTRATOR) {
    throw new Error("Manage Server permission is required");
  }
  return guild;
}

type GuildState = { roles: DiscordRole[]; channels: DiscordChannel[]; botIn: boolean };

async function loadGuild(guildId: string): Promise<GuildState> {
  const { botRequest } = await import("./discord.server");
  try {
    const [roles, channels] = await Promise.all([
      botRequest<DiscordRole[]>(`/guilds/${guildId}/roles`),
      botRequest<DiscordChannel[]>(`/guilds/${guildId}/channels`),
    ]);
    return { roles, channels, botIn: true };
  } catch {
    return { roles: [], channels: [], botIn: false };
  }
}

const norm = (s: string) => s.trim().toLowerCase();

function desiredCategoryOverwrites(cat: CategorySpec, roleId: (n: string) => string | undefined, everyone: string) {
  if (!cat.privateTo) return null;
  const ow: Overwrite[] = [
    { id: everyone, type: 0, allow: "0", deny: PERM.VIEW_CHANNEL.toString() },
  ];
  for (const r of cat.privateTo) {
    const id = roleId(r);
    if (id) ow.push({ id, type: 0, allow: PERM.VIEW_CHANNEL.toString(), deny: "0" });
  }
  return ow;
}

function desiredChannelOverwrites(
  ch: ChannelSpec,
  roleId: (n: string) => string | undefined,
  everyone: string,
) {
  const ow: Overwrite[] = [];
  if (ch.readOnly) {
    ow.push({
      id: everyone,
      type: 0,
      allow: "0",
      deny: bits(["SEND_MESSAGES", "CREATE_PUBLIC_THREADS", "CREATE_PRIVATE_THREADS"]).toString(),
    });
    for (const r of [...STAFF, "Support"]) {
      const id = roleId(r);
      if (id) ow.push({ id, type: 0, allow: PERM.SEND_MESSAGES.toString(), deny: "0" });
    }
  }
  if (ch.languageRole) {
    ow.push({
      id: everyone,
      type: 0,
      allow: "0",
      deny: bits(["VIEW_CHANNEL", "CONNECT"]).toString(),
    });
    const langId = roleId(ch.languageRole);
    if (langId) {
      ow.push({
        id: langId,
        type: 0,
        allow: bits(["VIEW_CHANNEL", "CONNECT", "SPEAK", "USE_VAD"]).toString(),
        deny: "0",
      });
    }
    for (const r of STAFF) {
      const id = roleId(r);
      if (id) {
        ow.push({
          id,
          type: 0,
          allow: bits(["VIEW_CHANNEL", "CONNECT", "SPEAK", "USE_VAD"]).toString(),
          deny: "0",
        });
      }
    }
  }
  return ow.length ? ow : null;
}

function sameOverwrites(current: Overwrite[] | undefined, desired: Overwrite[] | null) {
  if (!desired) return true;
  const cur = current ?? [];
  return desired.every((d) => {
    const found = cur.find((c) => c.id === d.id);
    if (!found) return false;
    return (
      (BigInt(found.allow) & BigInt(d.allow)) === BigInt(d.allow) &&
      (BigInt(found.deny) & BigInt(d.deny)) === BigInt(d.deny)
    );
  });
}

export const auditGuild = createServerFn({ method: "POST" })
  .inputValidator((data: { guildId: string; templateId?: string }) => {
    if (!data?.guildId || !/^\d{5,25}$/.test(data.guildId)) throw new Error("Invalid server id");
    return data;
  })
  .handler(async ({ data }): Promise<AuditReport> => {
    const guild = await assertGuildAccess(data.guildId);
    const template = getServerTemplate(data.templateId ?? "gaming-community");
    const state = await loadGuild(data.guildId);
    const items: AuditItem[] = [];

    if (!state.botIn) {
      return {
        guildId: guild.id,
        guildName: guild.name,
        botInGuild: false,
        items: [],
        counts: { create: 0, update: 0, skip: 0, review: 0 },
      };
    }

    const roleByName = new Map(state.roles.map((r) => [norm(r.name), r]));
    const roleId = (n: string) => roleByName.get(norm(n))?.id;
    const everyone = state.roles.find((r) => r.name === "@everyone")?.id ?? data.guildId;

    for (const spec of template.roles) {
      const existing = roleByName.get(norm(spec.name));
      const wanted = bits(spec.permissions);
      if (!existing) {
        items.push({
          id: `role:${spec.name}`,
          type: "role",
          name: spec.name,
          action: "create",
          detail: `Create role with color ${spec.color}`,
          detailEs: `Crear rol con color ${spec.color}`,
        });
      } else {
        const colorOff = existing.color !== hexToInt(spec.color);
        const permsOff = (BigInt(existing.permissions) & wanted) !== wanted;
        items.push({
          id: `role:${spec.name}`,
          type: "role",
          name: spec.name,
          action: colorOff || permsOff ? "update" : "skip",
          detail: colorOff || permsOff ? "Align color and permissions" : "Already correct",
          detailEs: colorOff || permsOff ? "Ajustar color y permisos" : "Ya es correcto",
        });
      }
    }

    const catByName = new Map(
      state.channels.filter((c) => c.type === 4).map((c) => [norm(c.name), c]),
    );

    for (const cat of template.categories) {
      const existingCat = catByName.get(norm(cat.name));
      items.push({
        id: `cat:${cat.name}`,
        type: "category",
        name: cat.name,
        action: existingCat ? "skip" : "create",
        detail: existingCat ? "Category exists" : "Create category",
        detailEs: existingCat ? "La categoría existe" : "Crear categoría",
      });

      const desiredCatOw = desiredCategoryOverwrites(cat, roleId, everyone);
      if (desiredCatOw) {
        const ok = existingCat && sameOverwrites(existingCat.permission_overwrites, desiredCatOw);
        items.push({
          id: `perm:${cat.name}`,
          type: "permission",
          name: `${cat.name} — private`,
          parent: cat.name,
          action: ok ? "skip" : "update",
          detail: ok ? "Privacy overwrites correct" : "Apply private visibility overwrites",
          detailEs: ok ? "Permisos de privacidad correctos" : "Aplicar permisos de visibilidad privada",
        });
      }

      for (const ch of cat.channels) {
        const existing = state.channels.find(
          (c) => norm(c.name) === norm(ch.name) && c.type === (ch.kind === "voice" ? 2 : 0),
        );
        const desiredOw = desiredChannelOverwrites(ch, roleId, everyone);
        let action: AuditItem["action"] = "create";
        let detail = `Create ${ch.kind} channel`;
        let detailEs = `Crear canal de ${ch.kind === "voice" ? "voz" : "texto"}`;
        if (existing) {
          const parentOff = existingCat ? existing.parent_id !== existingCat.id : false;
          const owOff = !sameOverwrites(existing.permission_overwrites, desiredOw);
          action = parentOff || owOff ? "update" : "skip";
          detail = parentOff
            ? "Move under the correct category"
            : owOff
              ? "Update channel permissions"
              : "Already correct";
          detailEs = parentOff
            ? "Mover a la categoría correcta"
            : owOff
              ? "Actualizar permisos del canal"
              : "Ya es correcto";
        }
        items.push({
          id: `ch:${cat.name}:${ch.name}`,
          type: "channel",
          name: ch.name,
          parent: cat.name,
          action,
          detail,
          detailEs,
        });
      }
    }

    const plannedNames = new Set(
      template.categories.flatMap((c) => [norm(c.name), ...c.channels.map((ch) => norm(ch.name))]),
    );
    for (const c of state.channels) {
      if (plannedNames.has(norm(c.name))) continue;
      if (!LEFTOVER_HINTS.some((h) => norm(c.name).includes(h))) continue;
      items.push({
        id: `left:${c.id}`,
        type: "leftover",
        name: `#${c.name}`,
        action: "review",
        detail: "Not part of the LiveNest plan — nothing will be changed or deleted",
        detailEs: "No forma parte del plan LiveNest — no se cambiará ni borrará nada",
      });
    }

    const counts = { create: 0, update: 0, skip: 0, review: 0 };
    for (const i of items) counts[i.action] += 1;

    return { guildId: guild.id, guildName: guild.name, botInGuild: true, items, counts };
  });

export const applyConfig = createServerFn({ method: "POST" })
  .inputValidator((data: { guildId: string; templateId?: string }) => {
    if (!data?.guildId || !/^\d{5,25}$/.test(data.guildId)) throw new Error("Invalid server id");
    return data;
  })
  .handler(async ({ data }): Promise<ApplyResult> => {
    await assertGuildAccess(data.guildId);
    const template = getServerTemplate(data.templateId ?? "gaming-community");
    const { botRequest } = await import("./discord.server");
    const guildId = data.guildId;

    const log: ApplyLogEntry[] = [];
    let created = 0;
    let updated = 0;
    let skipped = 0;
    let failed = 0;
    const push = (level: ApplyLogEntry["level"], message: string, messageEs: string) =>
      log.push({ ts: Date.now(), level, message, messageEs });

    let state = await loadGuild(guildId);
    if (!state.botIn) {
      push("error", "Bot is not in this server.", "El bot no está en este servidor.");
      return { log, created, updated, skipped, failed: 1 };
    }

    // --- Roles -------------------------------------------------------------
    for (const spec of template.roles) {
      const existing = state.roles.find((r) => norm(r.name) === norm(spec.name));
      const wanted = bits(spec.permissions);
      try {
        if (!existing) {
          const role = await botRequest<DiscordRole>(`/guilds/${guildId}/roles`, {
            method: "POST",
            body: JSON.stringify({
              name: spec.name,
              color: hexToInt(spec.color),
              hoist: Boolean(spec.hoist),
              mentionable: Boolean(spec.mentionable),
              permissions: wanted.toString(),
            }),
          });
          state.roles.push(role);
          created += 1;
          push("success", `Created role ${spec.name}`, `Rol ${spec.name} creado`);
        } else if (
          existing.color !== hexToInt(spec.color) ||
          (BigInt(existing.permissions) & wanted) !== wanted
        ) {
          await botRequest(`/guilds/${guildId}/roles/${existing.id}`, {
            method: "PATCH",
            body: JSON.stringify({
              color: hexToInt(spec.color),
              permissions: (BigInt(existing.permissions) | wanted).toString(),
            }),
          });
          updated += 1;
          push("info", `Updated role ${spec.name}`, `Rol ${spec.name} actualizado`);
        } else {
          skipped += 1;
          push("info", `Role ${spec.name} already correct`, `El rol ${spec.name} ya es correcto`);
        }
      } catch (error) {
        failed += 1;
        push("error", `Role ${spec.name}: ${(error as Error).message}`, `Rol ${spec.name}: ${(error as Error).message}`);
      }
    }

    state = await loadGuild(guildId);
    const roleId = (n: string) => state.roles.find((r) => norm(r.name) === norm(n))?.id;
    const everyone = state.roles.find((r) => r.name === "@everyone")?.id ?? guildId;

    // --- Categories & channels --------------------------------------------
    for (const cat of template.categories) {
      let catChannel = state.channels.find((c) => c.type === 4 && norm(c.name) === norm(cat.name));
      const catOw = desiredCategoryOverwrites(cat, roleId, everyone);
      try {
        if (!catChannel) {
          catChannel = await botRequest<DiscordChannel>(`/guilds/${guildId}/channels`, {
            method: "POST",
            body: JSON.stringify({
              name: cat.name,
              type: 4,
              ...(catOw ? { permission_overwrites: catOw } : {}),
            }),
          });
          state.channels.push(catChannel);
          created += 1;
          push("success", `Created category ${cat.name}`, `Categoría ${cat.name} creada`);
        } else if (catOw && !sameOverwrites(catChannel.permission_overwrites, catOw)) {
          await botRequest(`/channels/${catChannel.id}`, {
            method: "PATCH",
            body: JSON.stringify({ permission_overwrites: catOw }),
          });
          updated += 1;
          push("info", `Updated permissions on ${cat.name}`, `Permisos actualizados en ${cat.name}`);
        } else {
          skipped += 1;
          push("info", `Category ${cat.name} already correct`, `La categoría ${cat.name} ya es correcta`);
        }
      } catch (error) {
        failed += 1;
        push("error", `${cat.name}: ${(error as Error).message}`, `${cat.name}: ${(error as Error).message}`);
        continue;
      }

      for (const ch of cat.channels) {
        const type = ch.kind === "voice" ? 2 : 0;
        const desiredOw = desiredChannelOverwrites(ch, roleId, everyone);
        const existing = state.channels.find((c) => c.type === type && norm(c.name) === norm(ch.name));
        try {
          if (!existing) {
            const createdCh = await botRequest<DiscordChannel>(`/guilds/${guildId}/channels`, {
              method: "POST",
              body: JSON.stringify({
                name: ch.name,
                type,
                parent_id: catChannel.id,
                ...(desiredOw ? { permission_overwrites: desiredOw } : {}),
              }),
            });
            state.channels.push(createdCh);
            created += 1;
            push("success", `Created #${ch.name}`, `#${ch.name} creado`);
          } else {
            const parentOff = existing.parent_id !== catChannel.id;
            const owOff = !sameOverwrites(existing.permission_overwrites, desiredOw);
            if (parentOff || owOff) {
              await botRequest(`/channels/${existing.id}`, {
                method: "PATCH",
                body: JSON.stringify({
                  parent_id: catChannel.id,
                  ...(desiredOw ? { permission_overwrites: desiredOw } : {}),
                }),
              });
              updated += 1;
              push("info", `Updated #${ch.name}`, `#${ch.name} actualizado`);
            } else {
              skipped += 1;
              push("info", `#${ch.name} already correct`, `#${ch.name} ya es correcto`);
            }
          }
        } catch (error) {
          failed += 1;
          push("error", `#${ch.name}: ${(error as Error).message}`, `#${ch.name}: ${(error as Error).message}`);
        }
      }
    }

    push(
      failed ? "warn" : "success",
      `Finished: ${created} created, ${updated} updated, ${skipped} unchanged, ${failed} failed. Nothing was deleted.`,
      `Terminado: ${created} creados, ${updated} actualizados, ${skipped} sin cambios, ${failed} fallidos. No se borró nada.`,
    );

    return { log, created, updated, skipped, failed };
  });