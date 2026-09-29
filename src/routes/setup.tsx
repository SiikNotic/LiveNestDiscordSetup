import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { AlertTriangle, Check, Loader2, LogOut, Plus, RefreshCw, Server } from "lucide-react";

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
  const [report, setReport] = useState<AuditReport | null>(null);
  const [result, setResult] = useState<ApplyResult | null>(null);
  const [confirming, setConfirming] = useState(false);

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
    mutationFn: (id: string) => auditFn({ data: { guildId: id } }),
    onSuccess: (data) => {
      setReport(data);
      setResult(null);
    },
  });

  const apply = useMutation({
    mutationFn: (id: string) => applyFn({ data: { guildId: id } }),
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
        </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Footer />
    </div>
  );
}