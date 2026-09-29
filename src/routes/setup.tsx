import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { AlertTriangle, Check, LayoutTemplate, Loader2, LogOut, Plus, RefreshCw, Server } from "lucide-react";

import { Footer, Header } from "@/components/livenest/chrome";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { LanguageProvider, useLang } from "@/lib/i18n";
import { applyConfig, auditGuild, getStatus, listGuilds, logout } from "@/lib/discord.functions";
import type { ApplyResult, AuditItem, AuditReport } from "@/lib/livenest-blueprint";
import { cn } from "@/lib/utils";
import { SERVER_TEMPLATES, TEMPLATE_CATEGORIES } from "@/lib/server-templates";

export const Route = createFileRoute("/setup")({
  head: () => ({
    meta: [
      { title: "Configure your server — LiveNest Discord Setup" },
      {
        name: "description",
        content:
          "Connect Discord, pick your LiveNest server, run a dry-run audit and apply the configuration idempotently.",
      },
      { property: "og:title", content: "Configure your server — LiveNest Discord Setup" },
      {
        property: "og:description",
        content: "Dry-run audit and one-click, non-destructive LiveNest Discord configuration.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <LanguageProvider>
      <SetupPage />
    </LanguageProvider>
  ),
});

const ACTION_STYLES: Record<AuditItem["action"], string> = {
  create: "bg-success/15 text-success border-success/30",
  update: "bg-blue/15 text-blue border-blue/30",
  skip: "bg-muted text-muted-foreground border-border",
  review: "bg-warning/15 text-warning border-warning/30",
};

function SetupPage() {
  const { t, lang } = useLang();
  const [guildId, setGuildId] = useState<string | null>(null);
  const [templateId, setTemplateId] = useState("gaming-community");
  const [report, setReport] = useState<AuditReport | null>(null);
  const [result, setResult] = useState<ApplyResult | null>(null);
  const [confirming, setConfirming] = useState(false);
  const selectedTemplate = SERVER_TEMPLATES.find((x) => x.id === templateId) ?? SERVER_TEMPLATES[0];

  const statusFn = useServerFn(getStatus);
  const guildsFn = useServerFn(listGuilds);
  const auditFn = useServerFn(auditGuild);
  const applyFn = useServerFn(applyConfig);
  const logoutFn = useServerFn(logout);

  const status = useQuery({ queryKey: ["discord-status"], queryFn: () => statusFn({}) });
  const connected = Boolean(status.data?.user);

  const guilds = useQuery({
    queryKey: ["discord-guilds"],
    queryFn: () => guildsFn({}),
    enabled: connected,
  });

  const audit = useMutation({
    mutationFn: (id: string) => auditFn({ data: { guildId: id, templateId } }),
    onSuccess: (data) => {
      setReport(data);
      setResult(null);
    },
  });

  const apply = useMutation({
    mutationFn: (id: string) => applyFn({ data: { guildId: id, templateId } }),
    onSuccess: (data) => setResult(data),
  });

  const step = !connected ? 1 : !report ? (guildId ? 2 : 2) : result ? 4 : 3;

  return (
    <div className="min-h-screen">
      <Header
        right={
          connected ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={async () => {
                await logoutFn({});
                setGuildId(null);
                setReport(null);
                setResult(null);
                status.refetch();
              }}
            >
              <LogOut className="size-4" /> {t("disconnect")}
            </Button>
          ) : undefined
        }
      />

      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <ol className="mb-8 flex flex-wrap gap-2 text-xs">
          {[t("step1"), t("step2"), t("step3"), t("step4")].map((label, i) => (
            <li
              key={label}
              className={cn(
                "rounded-full border px-3 py-1.5",
                step > i
                  ? "border-primary/40 bg-primary/10 text-primary"
                  : "border-border text-muted-foreground",
              )}
            >
              {i + 1}. {label}
            </li>
          ))}
        </ol>

        {status.isLoading && (
          <div className="panel flex items-center gap-2 p-6 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" /> …
          </div>
        )}

        {status.data && !status.data.configured && (
          <div className="panel-gold p-6">
            <h2 className="flex items-center gap-2 text-lg font-semibold">
              <AlertTriangle className="size-5 text-primary" /> {t("notConfigured")}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">{t("notConfiguredBody")}</p>
          </div>
        )}

        {status.data?.configured && !connected && (
          <div className="panel p-8 text-center">
            <h2 className="text-2xl font-semibold text-metal">{t("step1")}</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">{t("tagline")}</p>
            <Button asChild size="lg" className="mt-6">
              <a href="/api/public/discord/login">{t("connect")}</a>
            </Button>
          </div>
        )}

        {connected && (
          <div className="space-y-8">
            <section className="panel p-6">
              <h2 className="flex items-center gap-2 text-lg font-semibold"><LayoutTemplate className="size-5 text-primary" /> {t("chooseTemplate")}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{t("chooseTemplateBody")}</p>
              <div className="mt-4 space-y-4">
                {TEMPLATE_CATEGORIES.map((category) => {
                  const items = SERVER_TEMPLATES.filter((x) => x.category === category);
                  return items.length ? (
                    <div key={category}>
                      <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{category}</div>
                      <div className="grid gap-2 sm:grid-cols-2">
                        {items.map((tpl) => (
                          <button key={tpl.id} type="button" onClick={() => { setTemplateId(tpl.id); setReport(null); setResult(null); }}
                            className={cn("group relative overflow-hidden rounded-xl border p-0 text-left transition-all", templateId === tpl.id ? "border-white/30 ring-1 ring-white/20" : "border-border bg-surface-2/50 hover:border-white/20")}>
                            <div className="relative p-4" style={{background: tpl.theme.surface}}>
                              <div className="absolute inset-x-0 top-0 h-1" style={{background: "linear-gradient(90deg, " + tpl.theme.accent + ", " + tpl.theme.secondary + ")"}} />
                              <div className="mb-4 flex items-center justify-between gap-2">
                                <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[9px] font-bold tracking-widest text-white/60">{tpl.category.toUpperCase()}</span>
                                {templateId === tpl.id && <Check className="size-4 text-white" />}
                              </div>
                              <div className="text-base font-bold text-white">{tpl.name}</div>
                              <div className="mt-1 text-[9px] font-semibold tracking-[0.16em]" style={{color: tpl.theme.accent}}>{tpl.theme.tagline}</div>
                              <div className="mt-2 text-xs leading-5 text-white/55">{lang === "en" ? tpl.description : tpl.descriptionEs}</div>
                              <div className="mt-4 flex flex-wrap gap-1.5">
                                {tpl.roles.slice(0,4).map(role => <span key={role.name} className="rounded-full border border-white/10 bg-black/20 px-2 py-1 text-[9px]" style={{color: role.color}}>{role.name}</span>)}
                              </div>
                              <div className="mt-4 text-[9px] uppercase tracking-wider text-white/35">{tpl.categories.length} categories · {tpl.roles.length} roles · {tpl.categories.reduce((n, cat) => n + cat.channels.length, 0)} channels</div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : null;
                })}
              </div>
            </section>

            <section className="panel overflow-hidden p-0">
              <div className="flex flex-col border-b border-border px-6 py-5 sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h2 className="flex items-center gap-2 text-lg font-semibold"><Server className="size-5 text-primary" /> Discord Preview</h2>
                  <p className="mt-1 text-sm text-muted-foreground">Vista simulada del servidor antes de instalar la plantilla. No modifica Discord.</p>
                </div>
                <div className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">{selectedTemplate.name}</div>
              </div>
              <div className="grid min-h-[560px] text-white md:grid-cols-[250px_1fr]" style={{background:selectedTemplate.theme.surface}}>
                <aside className="border-b border-white/10 bg-black/20 p-3 md:border-b-0 md:border-r">
                  <div className="mb-4 flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2">
                    <span className="flex size-8 items-center justify-center rounded-full bg-gradient-to-br from-[#D4AF37] to-[#8b6b19] text-xs font-black text-black">LN</span>
                    <div className="min-w-0"><div className="truncate text-sm font-semibold">Your Server</div><div className="text-[10px] text-white/45">LiveNest template</div></div>
                  </div>
                  <div className="space-y-3">
                    {selectedTemplate.categories.slice(0, 9).map((category) => (
                      <div key={category.name}>
                        <div className="mb-1 px-2 text-[9px] font-bold tracking-widest text-white/40">{category.name}</div>
                        <div className="space-y-0.5">
                          {category.channels.slice(0, 5).map((channel) => (
                            <div key={channel.name} className="flex items-center gap-2 rounded px-2 py-1 text-xs text-white/65 hover:bg-white/5">
                              <span className="text-white/35">{channel.kind === "voice" ? "🔊" : "#"}</span>{channel.name}
                            </div>
                          ))}
                          {category.channels.length > 5 && <div className="px-2 text-[10px] text-white/30">+{category.channels.length - 5} more</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                </aside>
                <div className="flex min-w-0 flex-col">
                  <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
                    <span className="text-lg text-white/40">#</span>
                    <div><div className="font-semibold">welcome・bienvenida</div><div className="text-[10px] text-white/40">Welcome channel preview</div></div>
                  </div>
                  <div className="flex-1 p-5 sm:p-7">
                    <div className="mb-7 max-w-xl">
                      <div className="mb-2 text-2xl font-bold">Welcome to your community 👋</div>
                      <p className="text-sm leading-6 text-white/55">This is a visual preview generated from the selected template. The real Discord server will use the exact categories, channels and roles shown here.</p>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {selectedTemplate.categories.slice(0, 6).map((category) => (
                        <div key={category.name} className="rounded-xl border border-white/10 bg-white/[0.035] p-4">
                          <div className="mb-3 text-[10px] font-bold tracking-widest text-[#D4AF37]">{category.name}</div>
                          <div className="space-y-1.5">
                            {category.channels.slice(0, 4).map((channel) => (
                              <div key={channel.name} className="flex items-center gap-2 text-xs text-white/65"><span className="text-white/30">{channel.kind === "voice" ? "🔊" : "#"}</span>{channel.name}</div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="border-t border-white/10 bg-black/20 px-5 py-4">
                    <div className="mb-2 text-[10px] font-bold uppercase tracking-widest text-white/35">Roles preview</div>
                    <div className="flex flex-wrap gap-2">
                      {selectedTemplate.roles.slice(0, 10).map((role) => (
                        <span key={role.name} className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px]" style={{ color: role.color }}>{role.name}</span>
                      ))}
                      {selectedTemplate.roles.length > 10 && <span className="rounded-full bg-white/5 px-2.5 py-1 text-[10px] text-white/40">+{selectedTemplate.roles.length - 10}</span>}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="panel p-6">
              <h2 className="text-lg font-semibold">{t("selectGuild")}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{t("selectGuildBody")}</p>
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {guilds.isLoading && (
                  <span className="text-sm text-muted-foreground">
                    <Loader2 className="inline size-4 animate-spin" />
                  </span>
                )}
                {guilds.data?.length === 0 && (
                  <p className="text-sm text-muted-foreground">{t("noGuilds")}</p>
                )}
                {guilds.data?.map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => {
                      setGuildId(g.id);
                      setReport(null);
                      setResult(null);
                    }}
                    className={cn(
                      "flex items-center gap-3 rounded-lg border p-3 text-left transition-colors",
                      guildId === g.id
                        ? "border-primary/60 bg-primary/10"
                        : "border-border bg-surface-2/50 hover:border-primary/40",
                    )}
                  >
                    {g.icon ? (
                      <img src={g.icon} alt="" className="size-9 rounded-lg" />
                    ) : (
                      <span className="flex size-9 items-center justify-center rounded-lg bg-muted">
                        <Server className="size-4 text-muted-foreground" />
                      </span>
                    )}
                    <span className="truncate text-sm font-medium">{g.name}</span>
                    {guildId === g.id && <Check className="ml-auto size-4 text-primary" />}
                  </button>
                ))}
              </div>
              {guilds.error && (
                <p className="mt-3 text-sm text-destructive">{(guilds.error as Error).message}</p>
              )}
              <Button
                className="mt-5"
                disabled={!guildId || audit.isPending}
                onClick={() => guildId && audit.mutate(guildId)}
              >
                {audit.isPending ? (
                  <>
                    <Loader2 className="size-4 animate-spin" /> {t("auditing")}
                  </>
                ) : (
                  <>
                    <RefreshCw className="size-4" /> {report ? t("again") : t("runAudit")}
                  </>
                )}
              </Button>
              {audit.error && (
                <p className="mt-3 text-sm text-destructive">{(audit.error as Error).message}</p>
              )}
            </section>

            {report && !report.botInGuild && (
              <div className="panel-gold p-6 text-sm">{t("botMissing")}</div>
            )}

            {report && report.botInGuild && (
              <section className="panel p-6">
                <h2 className="text-lg font-semibold">{t("auditTitle")}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{t("auditBody")}</p>
                <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {(["create", "update", "skip", "review"] as const).map((k) => (
                    <div
                      key={k}
                      className={cn("rounded-lg border px-3 py-2.5", ACTION_STYLES[k])}
                    >
                      <div className="font-display text-2xl">{report.counts[k]}</div>
                      <div className="text-[11px] uppercase tracking-wide">{t(k)}</div>
                    </div>
                  ))}
                </div>

                <div className="mt-5 max-h-96 divide-y divide-border overflow-y-auto rounded-lg border border-border">
                  {report.items.map((item) => (
                    <div key={item.id} className="flex items-start gap-3 px-3 py-2.5 text-sm">
                      <span
                        className={cn(
                          "mt-0.5 shrink-0 rounded border px-2 py-0.5 text-[10px] uppercase tracking-wide",
                          ACTION_STYLES[item.action],
                        )}
                      >
                        {t(item.action)}
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate font-medium">
                          {item.parent ? `${item.parent} / ` : ""}
                          {item.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {lang === "en" ? item.detail : item.detailEs}
                        </span>
                      </span>
                    </div>
                  ))}
                </div>

                <Button
                  size="lg"
                  className="mt-5"
                  disabled={apply.isPending}
                  onClick={() => setConfirming(true)}
                >
                  {apply.isPending ? (
                    <>
                      <Loader2 className="size-4 animate-spin" /> {t("applying")}
                    </>
                  ) : (
                    <>
                      <Plus className="size-4" /> {t("apply")}
                    </>
                  )}
                </Button>
                {apply.error && (
                  <p className="mt-3 text-sm text-destructive">{(apply.error as Error).message}</p>
                )}
              </section>
            )}

            {result && (
              <section className="panel p-6">
                <h2 className="text-lg font-semibold">{t("summary")}</h2>
                <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {[
                    { l: t("created"), v: result.created },
                    { l: t("updated"), v: result.updated },
                    { l: t("skipped"), v: result.skipped },
                    { l: t("failed"), v: result.failed },
                  ].map((s) => (
                    <div key={s.l} className="rounded-lg border border-border bg-surface-2/60 px-3 py-2.5">
                      <div className="font-display text-2xl text-metal">{s.v}</div>
                      <div className="text-[11px] uppercase tracking-wide text-muted-foreground">
                        {s.l}
                      </div>
                    </div>
                  ))}
                </div>
                <h3 className="mt-6 text-sm font-semibold">{t("console")}</h3>
                <div className="mt-2 max-h-80 overflow-y-auto rounded-lg border border-border bg-background p-3 font-mono text-xs leading-relaxed">
                  {result.log.map((line, i) => (
                    <div
                      key={i}
                      className={cn(
                        line.level === "success" && "text-success",
                        line.level === "error" && "text-destructive",
                        line.level === "warn" && "text-warning",
                        line.level === "info" && "text-muted-foreground",
                      )}
                    >
                      <span className="text-muted-foreground/60">
                        {new Date(line.ts).toLocaleTimeString()}{" "}
                      </span>
                      {lang === "en" ? line.message : line.messageEs}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </main>

      <AlertDialog open={confirming} onOpenChange={setConfirming}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("confirmTitle")}</AlertDialogTitle>
            <AlertDialogDescription>{t("confirmBody")}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setConfirming(false);
                if (guildId) apply.mutate(guildId);
              }}
            >
              {t("confirm")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Footer />
    </div>
  );
}