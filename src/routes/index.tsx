import { createFileRoute, Link } from "@tanstack/react-router";
import { ShieldCheck, RefreshCw, KeyRound, ArrowRight, ListChecks } from "lucide-react";

import { Footer, Header } from "@/components/livenest/chrome";
import {
  PermissionMatrix,
  RolesGrid,
  StructureView,
} from "@/components/livenest/blueprint-views";
import { Button } from "@/components/ui/button";
import { LanguageProvider, useLang } from "@/lib/i18n";
import { CATEGORIES, ROLES } from "@/lib/livenest-blueprint";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LiveNest Discord Setup — one-click server configurator" },
      {
        name: "description",
        content:
          "Audit and configure your LiveNest Discord server automatically: categories, channels, roles and least-privilege permissions, without deleting anything.",
      },
      { property: "og:title", content: "LiveNest Discord Setup" },
      {
        property: "og:description",
        content:
          "Safe, idempotent, non-destructive Discord server configuration for LiveNest. Dry-run audit first, then one-click apply.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <LanguageProvider>
      <Landing />
    </LanguageProvider>
  ),
});

function Landing() {
  const { t } = useLang();
  const channelCount = CATEGORIES.reduce((n, c) => n + c.channels.length, 0);

  return (
    <div className="min-h-screen">
      <Header
        right={
          <Button asChild size="sm">
            <Link to="/setup">{t("start")}</Link>
          </Button>
        }
      />

      <main className="mx-auto max-w-6xl px-4 sm:px-6">
        <section className="py-16 sm:py-24">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/35 bg-primary/10 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-primary">
            {t("heroKicker")}
          </span>
          <h1 className="mt-6 max-w-3xl text-4xl font-semibold leading-[1.05] sm:text-6xl">
            <span className="text-metal">{t("heroTitle")}</span>
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            {t("heroBody")}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link to="/setup">
                {t("start")} <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href="#structure">{t("viewStructure")}</a>
            </Button>
          </div>

          <dl className="mt-12 grid gap-4 sm:grid-cols-3">
            {[
              { k: CATEGORIES.length, l: "Categories · Categorías" },
              { k: channelCount, l: "Channels · Canales" },
              { k: ROLES.length, l: "Roles" },
            ].map((s) => (
              <div key={s.l} className="panel px-5 py-4">
                <dt className="font-display text-3xl text-metal">{s.k}</dt>
                <dd className="mt-1 text-xs uppercase tracking-wide text-muted-foreground">
                  {s.l}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <div className="rule-gold h-px" />

        <section className="grid gap-4 py-14 md:grid-cols-3">
          {[
            { icon: ShieldCheck, title: t("safety"), body: t("safetyBody") },
            { icon: RefreshCw, title: t("idem"), body: t("idemBody") },
            { icon: KeyRound, title: t("leastPriv"), body: t("leastPrivBody") },
          ].map((c) => (
            <div key={c.title} className="panel p-5">
              <c.icon className="size-5 text-primary" />
              <h2 className="mt-3 text-base font-semibold">{c.title}</h2>
              <p className="mt-1.5 text-sm text-muted-foreground">{c.body}</p>
            </div>
          ))}
        </section>

        <section id="structure" className="scroll-mt-20 py-10">
          <SectionTitle icon={ListChecks} title={t("channels")} />
          <StructureView />
        </section>

        <section className="py-10">
          <SectionTitle title={t("roles")} />
          <RolesGrid />
        </section>

        <section className="py-10">
          <SectionTitle title={t("permissions")} />
          <PermissionMatrix />
        </section>

        <section className="panel-gold my-10 flex flex-col items-start gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold">{t("heroTitle")}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{t("tagline")}</p>
          </div>
          <Button asChild size="lg">
            <Link to="/setup">
              {t("start")} <ArrowRight className="size-4" />
            </Link>
          </Button>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function SectionTitle({
  title,
  icon: Icon,
}: {
  title: string;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <h2 className="mb-5 flex items-center gap-2 text-xl font-semibold">
      {Icon && <Icon className="size-5 text-primary" />}
      {title}
    </h2>
  );
}