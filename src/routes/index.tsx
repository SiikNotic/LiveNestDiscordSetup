import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Check, Eye, Hash, Minus, X } from "lucide-react";

import { ChannelIcon, DiscordRail, DiscordSidebar } from "@/components/livenest/discord-mock";
import { Footer, Header } from "@/components/livenest/chrome";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { LanguageProvider, useLang, type Lang } from "@/lib/i18n";
import {
  CURATED_TEMPLATE_IDS,
  SERVER_TEMPLATES,
  TEMPLATE_CATEGORIES,
  type ServerTemplate,
  type TemplateCategory,
} from "@/lib/server-templates";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title: "LiveNest — Discord server templates you can install on the server you already have",
      },
      {
        name: "description",
        content:
          "Pick a Discord server template, review exactly what will change, and apply it to your existing server. Channels, roles and permissions in two minutes. Nothing is ever deleted.",
      },
      { property: "og:title", content: "LiveNest Discord Setup" },
      {
        property: "og:description",
        content:
          "Discord server templates installed on your existing server: categories, channels, roles and permissions. Audit first, nothing deleted.",
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

const COPY = {
  en: {
    navTemplates: "Templates",
    navHow: "How it works",
    navFaq: "FAQ",
    cta: "Set up my server",
    heroEyebrow: "For Discord server owners",
    heroTitleA: "Stop dragging channels",
    heroTitleB: "around at 2 a.m.",
    heroBody:
      "Pick a template, connect the server you already run, read the plan, press apply. LiveNest builds the categories, channels, roles and permissions for you — and it never deletes anything that's already there.",
    browse: "Browse templates",
    heroFine: ["Works on existing servers", "Shows every change first", "Nothing is deleted"],
    botTitle: "Plan ready",
    botCreate: "to create",
    botUpdate: "to update",
    botDeleted: "deleted",
    botNote: "Nothing has changed yet. Review it, then apply.",
    statTemplates: "templates",
    statNiches: "niches",
    statChannels: "channels mapped out",
    statDeleted: "things deleted, ever",
    tplKicker: "Template library",
    tplTitle: "Start from a server that already works.",
    tplBody:
      "Each template is a full structure, not a list of channel names: a read-only start section, roles with colours, a private staff area with logs, and voice rooms that make sense for the niche.",
    all: "All",
    showAll: (n: number) => `Show all ${n} templates`,
    showLess: "Show fewer",
    use: "Use this template",
    close: "Keep browsing",
    newBadge: "New",
    kindLabels: { text: "Text", announcement: "Announcement", forum: "Forum", voice: "Voice" },
    communityNote:
      "Forum and announcement channels need Community enabled on your server. Without it they're created as text channels.",
    cats: "categories",
    chans: "channels",
    roles: "roles",
    howKicker: "How it works",
    howTitle: "You see the plan before anything happens.",
    steps: [
      [
        "Pick a template",
        "Gaming, roleplay, streaming, study, business — or the minimal one if you want ten channels and nothing else.",
      ],
      [
        "Connect Discord",
        "Log in and choose a server where you have Manage Server. The LiveNest bot needs Manage Roles and Manage Channels.",
      ],
      [
        "Read the audit",
        "A dry run lists every role, category and channel: what will be created, what gets fixed, what's already fine.",
      ],
      [
        "Apply",
        "One click. Run it again whenever you want — existing items are updated, never duplicated.",
      ],
    ],
    planTitle: "Dry run · your-server",
    planFoot: "0 deleted · leftovers are listed, never touched",
    cmpKicker: "Options",
    cmpTitle: "Three ways to set up a server.",
    cmpCols: ["LiveNest", "Discord templates", "Hiring someone"],
    cmpRows: [
      ["Works on the server you already have", true, false, true],
      ["Shows every change before applying", true, false, "partial"],
      ["Roles with colours and safe permissions", true, "partial", true],
      ["Run again later without duplicates", true, false, false],
      ["Ready in", "~2 min", "~2 min", "1–3 days"],
    ],
    cmpNote: "Setup gigs on freelance marketplaces typically run $15–110 per server.",
    neverKicker: "Guardrails",
    neverTitle: "What LiveNest will never do",
    never: [
      "Delete a channel, role or message",
      "Give Administrator to anyone except the Owner role",
      "Touch channels that aren't part of the template",
      "Send your bot token to the browser",
    ],
    neverNote:
      "Channels the template doesn't know about show up as “possible leftovers” in the audit. You decide what to do with them.",
    faqTitle: "Questions people ask",
    faq: [
      [
        "Do I need to create a new server?",
        "No. That's the point — LiveNest works on the server you already have, members and history included. Discord's built-in templates only work on brand-new servers.",
      ],
      [
        "Will it break my current setup?",
        "It only adds what's missing and fixes permissions on channels with matching names. Nothing is deleted, and anything it doesn't recognise is left alone.",
      ],
      [
        "What permissions does the bot need?",
        "Manage Roles and Manage Channels. It doesn't need Administrator, and it can't read your DMs.",
      ],
      [
        "Can I change things after applying?",
        "Yes. Rename, reorder or delete whatever you like in Discord. If you run the tool again it will recreate only what the template still expects.",
      ],
      [
        "What if I run it twice?",
        "Nothing gets duplicated. Items that already match are skipped; items that drifted are put back in place.",
      ],
    ],
    finalTitle: "Your server, organised before your coffee gets cold.",
    finalBody: "Two minutes, one click, and you can read every change before it happens.",
  },
  es: {
    navTemplates: "Plantillas",
    navHow: "Cómo funciona",
    navFaq: "Preguntas",
    cta: "Configurar mi servidor",
    heroEyebrow: "Para dueños de servidores de Discord",
    heroTitleA: "Deja de arrastrar canales",
    heroTitleB: "a las 2 de la mañana.",
    heroBody:
      "Elige una plantilla, conecta el servidor que ya tienes, revisa el plan y aplica. LiveNest crea las categorías, canales, roles y permisos por ti — y nunca borra nada de lo que ya existe.",
    browse: "Ver plantillas",
    heroFine: [
      "Funciona en servidores existentes",
      "Te enseña cada cambio antes",
      "No se borra nada",
    ],
    botTitle: "Plan listo",
    botCreate: "por crear",
    botUpdate: "por actualizar",
    botDeleted: "borrados",
    botNote: "Todavía no ha cambiado nada. Revísalo y luego aplica.",
    statTemplates: "plantillas",
    statNiches: "nichos",
    statChannels: "canales diseñados",
    statDeleted: "cosas borradas, nunca",
    tplKicker: "Biblioteca de plantillas",
    tplTitle: "Empieza con un servidor que ya funciona.",
    tplBody:
      "Cada plantilla es una estructura completa, no una lista de nombres: sección de inicio de solo lectura, roles con colores, área privada de staff con logs y salas de voz que tienen sentido para el nicho.",
    all: "Todas",
    showAll: (n: number) => `Ver las ${n} plantillas`,
    showLess: "Ver menos",
    use: "Usar esta plantilla",
    close: "Seguir mirando",
    newBadge: "Nueva",
    kindLabels: { text: "Texto", announcement: "Anuncios", forum: "Foro", voice: "Voz" },
    communityNote:
      "Los canales de foro y de anuncios necesitan tener Comunidad activado en tu servidor. Sin eso se crean como canales de texto.",
    cats: "categorías",
    chans: "canales",
    roles: "roles",
    howKicker: "Cómo funciona",
    howTitle: "Ves el plan antes de que pase nada.",
    steps: [
      [
        "Elige una plantilla",
        "Gaming, roleplay, streaming, estudio, negocios — o la minimalista si solo quieres diez canales.",
      ],
      [
        "Conecta Discord",
        "Inicia sesión y elige un servidor donde tengas Gestionar servidor. El bot necesita Gestionar roles y Gestionar canales.",
      ],
      [
        "Lee la auditoría",
        "Una prueba en seco lista cada rol, categoría y canal: qué se crea, qué se corrige y qué ya está bien.",
      ],
      [
        "Aplica",
        "Un clic. Ejecútalo las veces que quieras: lo existente se actualiza, nunca se duplica.",
      ],
    ],
    planTitle: "Prueba en seco · tu-servidor",
    planFoot: "0 borrados · los restos se listan, nunca se tocan",
    cmpKicker: "Opciones",
    cmpTitle: "Tres formas de montar un servidor.",
    cmpCols: ["LiveNest", "Plantillas de Discord", "Contratar a alguien"],
    cmpRows: [
      ["Funciona en el servidor que ya tienes", true, false, true],
      ["Te enseña cada cambio antes de aplicarlo", true, false, "partial"],
      ["Roles con colores y permisos seguros", true, "partial", true],
      ["Repetirlo más tarde sin duplicados", true, false, false],
      ["Listo en", "~2 min", "~2 min", "1–3 días"],
    ],
    cmpNote:
      "Los encargos de configuración en marketplaces freelance suelen costar entre 15 y 110 USD por servidor.",
    neverKicker: "Garantías",
    neverTitle: "Lo que LiveNest nunca hará",
    never: [
      "Borrar un canal, un rol o un mensaje",
      "Dar Administrator a nadie salvo al rol Owner",
      "Tocar canales que no forman parte de la plantilla",
      "Enviar el token del bot al navegador",
    ],
    neverNote:
      "Los canales que la plantilla no conoce aparecen como “posibles restos” en la auditoría. Tú decides qué hacer con ellos.",
    faqTitle: "Preguntas frecuentes",
    faq: [
      [
        "¿Tengo que crear un servidor nuevo?",
        "No. Esa es la gracia: LiveNest trabaja sobre el servidor que ya tienes, con miembros e historial. Las plantillas nativas de Discord solo sirven para servidores nuevos.",
      ],
      [
        "¿Va a romper lo que ya tengo?",
        "Solo añade lo que falta y corrige permisos en canales con el mismo nombre. No borra nada y deja en paz lo que no reconoce.",
      ],
      [
        "¿Qué permisos necesita el bot?",
        "Gestionar roles y Gestionar canales. No necesita Administrator y no puede leer tus mensajes privados.",
      ],
      [
        "¿Puedo cambiar cosas después?",
        "Sí. Renombra, reordena o borra lo que quieras en Discord. Si vuelves a ejecutarlo, solo recrea lo que la plantilla sigue esperando.",
      ],
      [
        "¿Y si lo ejecuto dos veces?",
        "No se duplica nada. Lo que ya coincide se omite y lo que se desvió vuelve a su sitio.",
      ],
    ],
    finalTitle: "Tu servidor ordenado antes de que se enfríe el café.",
    finalBody: "Dos minutos, un clic, y puedes leer cada cambio antes de que ocurra.",
  },
} satisfies Record<Lang, unknown>;

const HERO_IDS = ["gaming-community", "kawaii-pastel", "streamer-community", "product-community"];
const HERO_NAMES: Record<string, string> = {
  "gaming-community": "Night Shift Gaming",
  "kawaii-pastel": "strawberry milk ♡",
  "streamer-community": "Lumi's Den",
  "product-community": "Fieldnote HQ",
};

const CATEGORY_ES: Record<TemplateCategory, string> = {
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

const channelCount = (tpl: ServerTemplate) =>
  tpl.categories.reduce((n, c) => n + c.channels.length, 0);

function Landing() {
  const { lang } = useLang();
  const c = COPY[lang];

  return (
    <div className="min-h-screen overflow-x-clip">
      <Header
        nav={
          <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
            <a href="#templates" className="transition-colors hover:text-foreground">
              {c.navTemplates}
            </a>
            <a href="#how" className="transition-colors hover:text-foreground">
              {c.navHow}
            </a>
            <a href="#faq" className="transition-colors hover:text-foreground">
              {c.navFaq}
            </a>
          </nav>
        }
        right={
          <Button asChild size="sm" className="hidden sm:inline-flex">
            <Link to="/setup">{c.cta}</Link>
          </Button>
        }
      />
      <main>
        <Hero />
        <Stats />
        <Templates />
        <HowItWorks />
        <Compare />
        <Guardrails />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
}

function Hero() {
  const { lang } = useLang();
  const c = COPY[lang];
  const heroTemplates = useMemo(
    () =>
      HERO_IDS.map((id) => SERVER_TEMPLATES.find((t) => t.id === id)).filter(
        (t): t is ServerTemplate => Boolean(t),
      ),
    [],
  );
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || heroTemplates.length < 2) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % heroTemplates.length), 5200);
    return () => window.clearInterval(id);
  }, [paused, heroTemplates.length]);

  const tpl = heroTemplates[index] ?? SERVER_TEMPLATES[0]!;
  const create = tpl.roles.length + tpl.categories.length + channelCount(tpl) - 3;

  return (
    <section className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 pb-20 pt-14 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:pt-20">
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary">
          {c.heroEyebrow}
        </p>
        <h1 className="mt-5 text-[2.5rem] font-bold leading-[1.02] sm:text-[3.4rem] xl:text-[3.75rem]">
          {c.heroTitleA}
          <br />
          <span className="text-muted-foreground">{c.heroTitleB}</span>
        </h1>
        <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-muted-foreground">
          {c.heroBody}
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg" className="h-12 px-6 text-[15px]">
            <Link to="/setup">
              {c.cta} <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="ghost" className="h-12 px-5 text-[15px]">
            <a href="#templates">{c.browse}</a>
          </Button>
        </div>
        <ul className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
          {c.heroFine.map((f) => (
            <li key={f} className="flex items-center gap-1.5">
              <Check className="size-4 text-success" /> {f}
            </li>
          ))}
        </ul>
      </div>

      <div
        className="relative"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div className="bg-dots absolute -inset-8 -z-10 rounded-[2rem] [mask-image:radial-gradient(closest-side,black,transparent)]" />

        <div className="mb-3 flex flex-wrap gap-1.5">
          {heroTemplates.map((t, i) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setIndex(i)}
              className={cn(
                "rounded-full border px-3 py-1 text-xs transition-colors",
                i === index
                  ? "border-foreground/30 bg-foreground text-background"
                  : "border-border text-muted-foreground hover:text-foreground",
              )}
            >
              {t.name}
            </button>
          ))}
        </div>

        <div className="flex h-[440px] overflow-hidden rounded-xl border border-white/10 shadow-[0_40px_80px_-40px_rgba(0,0,0,0.9)]">
          <DiscordRail accent={tpl.theme.accent} />
          <DiscordSidebar
            key={tpl.id}
            template={tpl}
            serverName={HERO_NAMES[tpl.id] ?? tpl.name}
            animate
            className="w-[230px] shrink-0"
          />
          <div className="hidden min-w-0 flex-1 flex-col bg-[#313338] sm:flex">
            <div className="flex h-12 items-center gap-1.5 border-b border-black/30 px-4 text-[15px] font-semibold text-white">
              <Hash className="size-5 text-[#80848E]" />
              <span className="truncate">{tpl.categories[0]?.channels[0]?.name ?? "welcome"}</span>
            </div>
            <div className="flex flex-1 flex-col justify-end p-4">
              <div className="flex gap-3">
                <div
                  className="flex size-10 shrink-0 items-center justify-center rounded-full font-display text-xs font-bold text-black"
                  style={{ background: tpl.theme.accent }}
                >
                  LN
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[15px] font-medium text-white">LiveNest</span>
                    <span className="rounded bg-[#5865F2] px-1 py-px text-[10px] font-semibold text-white">
                      APP
                    </span>
                    <span className="text-xs text-[#949BA4]">
                      {lang === "es" ? "hoy" : "today"}
                    </span>
                  </div>
                  <div
                    className="mt-1.5 rounded border-l-4 bg-[#2B2D31] p-3"
                    style={{ borderColor: tpl.theme.accent }}
                  >
                    <div className="text-sm font-semibold text-white">
                      {c.botTitle} · {tpl.name}
                    </div>
                    <ul className="mt-2 space-y-1 font-mono text-[13px]">
                      {[
                        [create, c.botCreate, "text-[#3BA55C]"],
                        [3, c.botUpdate, "text-[#5865F2]"],
                        [0, c.botDeleted, "text-[#DBDEE1]"],
                      ].map(([n, label, color]) => (
                        <li key={String(label)} className="flex items-baseline gap-2">
                          <span className={cn("w-7 text-right font-medium", color as string)}>
                            {n}
                          </span>
                          <span className="text-[#B5BAC1]">{label}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="mt-2 text-xs text-[#B5BAC1]">{c.botNote}</p>
                  </div>
                </div>
              </div>
              <div className="mt-4 rounded-lg bg-[#383A40] px-4 py-2.5 text-sm text-[#6D6F78]">
                {lang === "es" ? "Enviar mensaje a" : "Message"} #
                {tpl.categories[0]?.channels[0]?.name ?? "welcome"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stats() {
  const { lang } = useLang();
  const c = COPY[lang];
  const niches = new Set(SERVER_TEMPLATES.map((t) => t.category)).size;
  const channels = SERVER_TEMPLATES.reduce((n, t) => n + channelCount(t), 0);
  const items: Array<[string | number, string]> = [
    [SERVER_TEMPLATES.length, c.statTemplates],
    [niches, c.statNiches],
    [channels.toLocaleString(lang), c.statChannels],
    [0, c.statDeleted],
  ];
  return (
    <section className="border-y border-border/70 bg-surface/40">
      <dl className="mx-auto grid max-w-6xl grid-cols-2 px-4 sm:px-6 md:grid-cols-4">
        {items.map(([n, label], i) => (
          <div
            key={label}
            className={cn(
              "py-7 md:px-6",
              i % 2 === 1 && "pl-6 border-l border-border/70",
              i >= 2 && "border-t border-border/70 md:border-t-0",
              i === 2 && "md:border-l md:border-border/70 md:pl-6",
              i === 0 && "md:pl-0",
            )}
          >
            <dt className="font-display text-4xl font-semibold tabular-nums">{n}</dt>
            <dd className="mt-1 text-sm text-muted-foreground">{label}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

const INITIAL_VISIBLE = 9;

function Templates() {
  const { lang } = useLang();
  const c = COPY[lang];
  const [filter, setFilter] = useState<TemplateCategory | "all">("all");
  const [expanded, setExpanded] = useState(false);
  const [preview, setPreview] = useState<ServerTemplate | null>(null);

  const counts = useMemo(() => {
    const m = new Map<TemplateCategory, number>();
    for (const t of SERVER_TEMPLATES) m.set(t.category, (m.get(t.category) ?? 0) + 1);
    return m;
  }, []);
  const list = useMemo(() => {
    const items =
      filter === "all" ? SERVER_TEMPLATES : SERVER_TEMPLATES.filter((t) => t.category === filter);
    // Newest hand-picked templates first; sort is stable, so the rest keep their order.
    return [...items].sort(
      (a, b) => Number(CURATED_TEMPLATE_IDS.has(b.id)) - Number(CURATED_TEMPLATE_IDS.has(a.id)),
    );
  }, [filter]);
  const visible = expanded ? list : list.slice(0, INITIAL_VISIBLE);

  return (
    <section id="templates" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-24 sm:px-6">
      <div className="grid gap-6 md:grid-cols-[1fr_1fr] md:items-end">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary">
            {c.tplKicker}
          </p>
          <h2 className="mt-4 text-3xl font-bold leading-tight sm:text-[2.75rem]">{c.tplTitle}</h2>
        </div>
        <p className="text-muted-foreground md:pb-1.5">{c.tplBody}</p>
      </div>

      <div className="-mx-4 mt-10 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
        <div className="flex w-max gap-1.5 sm:w-auto sm:flex-wrap">
          {(["all", ...TEMPLATE_CATEGORIES.filter((k) => counts.has(k))] as const).map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => {
                setFilter(k);
                setExpanded(false);
              }}
              className={cn(
                "whitespace-nowrap rounded-full border px-3.5 py-1.5 text-sm transition-colors",
                filter === k
                  ? "border-foreground bg-foreground text-background"
                  : "border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground",
              )}
            >
              {k === "all" ? c.all : lang === "es" ? CATEGORY_ES[k] : k}
              <span className="ml-1.5 font-mono text-xs opacity-60">
                {k === "all" ? SERVER_TEMPLATES.length : counts.get(k)}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((tpl) => (
          <TemplateCard key={tpl.id} tpl={tpl} lang={lang} onOpen={setPreview} />
        ))}
      </div>

      {list.length > INITIAL_VISIBLE && (
        <div className="mt-8 flex justify-center">
          <Button variant="outline" onClick={() => setExpanded((v) => !v)}>
            {expanded ? c.showLess : c.showAll(list.length)}
          </Button>
        </div>
      )}
      <TemplatePreview tpl={preview} lang={lang} onClose={() => setPreview(null)} />
    </section>
  );
}

function rememberTemplate(id: string) {
  try {
    window.localStorage.setItem("livenest-template", id);
  } catch {
    /* storage can be blocked; the query string still carries the choice */
  }
}

function TemplateCard({
  tpl,
  lang,
  onOpen,
}: {
  tpl: ServerTemplate;
  lang: Lang;
  onOpen: (tpl: ServerTemplate) => void;
}) {
  const c = COPY[lang];
  // Show the first channels of the two most characteristic categories (skip the generic welcome block).
  const preview = tpl.categories.slice(1, 3);

  return (
    <button
      type="button"
      onClick={() => onOpen(tpl)}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-surface text-left transition-[border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-foreground/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="relative h-40 w-full overflow-hidden bg-[#2B2D31] px-3 pt-3">
        <div
          className="absolute inset-x-0 top-0 h-1"
          style={{
            background: `linear-gradient(90deg, ${tpl.theme.accent}, ${tpl.theme.secondary})`,
          }}
        />
        {CURATED_TEMPLATE_IDS.has(tpl.id) && (
          <span className="absolute right-3 top-3 rounded bg-primary px-1.5 py-0.5 font-mono text-[10px] font-medium uppercase text-primary-foreground">
            {c.newBadge}
          </span>
        )}
        <div className="mask-fade-b h-full">
          {preview.map((cat) => (
            <div key={cat.name} className="mb-2">
              <div className="truncate px-1 text-[10px] font-semibold uppercase tracking-wide text-[#949BA4]">
                {cat.name}
              </div>
              {cat.channels.slice(0, 3).map((ch) => (
                <div
                  key={ch.name}
                  className="flex items-center gap-1.5 px-1.5 py-[3px] text-[13px] text-[#949BA4]"
                >
                  <ChannelIcon kind={ch.kind} className="size-3.5 shrink-0 opacity-70" />
                  <span className="truncate">{ch.name}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="absolute bottom-3 right-3 flex -space-x-1.5">
          {tpl.roles.slice(5, 9).map((r) => (
            <span
              key={r.name}
              title={r.name}
              className="size-5 rounded-full ring-2 ring-[#2B2D31]"
              style={{ background: r.color }}
            />
          ))}
        </div>
      </div>
      <div className="flex w-full flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-[17px] font-semibold leading-tight">{tpl.name}</h3>
          <Eye className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground" />
        </div>
        <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">
          {lang === "es" ? tpl.descriptionEs : tpl.description}
        </p>
        <div className="mt-auto flex gap-3 pt-4 font-mono text-[11px] text-muted-foreground">
          <span>
            {tpl.categories.length} {c.cats}
          </span>
          <span>
            {channelCount(tpl)} {c.chans}
          </span>
          <span>
            {tpl.roles.length} {c.roles}
          </span>
        </div>
      </div>
    </button>
  );
}

function TemplatePreview({
  tpl,
  lang,
  onClose,
}: {
  tpl: ServerTemplate | null;
  lang: Lang;
  onClose: () => void;
}) {
  const c = COPY[lang];
  const kinds = useMemo(() => {
    const k = { text: 0, voice: 0, forum: 0, announcement: 0 };
    for (const cat of tpl?.categories ?? []) for (const ch of cat.channels) k[ch.kind] += 1;
    return k;
  }, [tpl]);

  return (
    <Dialog open={Boolean(tpl)} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[92vh] max-w-4xl gap-0 overflow-hidden border-border bg-background p-0 sm:rounded-2xl">
        {tpl && (
          <div className="grid max-h-[92vh] md:grid-cols-[300px_1fr]">
            <DiscordSidebar
              template={tpl}
              serverName={tpl.name}
              maxCategories={20}
              maxChannels={20}
              className="hidden h-[min(640px,92vh)] md:flex [&>div:last-child]:overflow-y-auto [&>div:last-child]:[mask-image:none]"
            />
            <div className="flex max-h-[92vh] min-h-0 flex-col overflow-y-auto p-6 sm:p-8 [&>*]:shrink-0">
              <p
                className="font-mono text-xs uppercase tracking-[0.18em]"
                style={{ color: tpl.theme.accent }}
              >
                {tpl.theme.tagline}
              </p>
              <DialogTitle className="mt-3 font-display text-3xl font-bold">{tpl.name}</DialogTitle>
              <DialogDescription className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
                {lang === "es" ? tpl.descriptionEs : tpl.description}
              </DialogDescription>

              <dl className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-4">
                {(
                  [
                    ["text", kinds.text],
                    ["announcement", kinds.announcement],
                    ["forum", kinds.forum],
                    ["voice", kinds.voice],
                  ] as const
                ).map(([kind, n]) => (
                  <div key={kind} className="bg-background px-3 py-3">
                    <dt className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <ChannelIcon kind={kind} className="size-3.5" /> {c.kindLabels[kind]}
                    </dt>
                    <dd className="mt-1 font-mono text-xl">{n}</dd>
                  </div>
                ))}
              </dl>
              {kinds.forum + kinds.announcement > 0 && (
                <p className="mt-2 text-xs text-muted-foreground">{c.communityNote}</p>
              )}

              <h4 className="mt-6 text-sm font-semibold capitalize">{c.roles}</h4>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {tpl.roles.map((r) => (
                  <span
                    key={r.name}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border px-2.5 py-1 text-xs"
                  >
                    <span className="size-2 rounded-full" style={{ background: r.color }} />
                    {r.name}
                  </span>
                ))}
              </div>

              <div className="md:hidden">
                <h4 className="mt-6 text-sm font-semibold capitalize">{c.cats}</h4>
                <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                  {tpl.categories.map((cat) => (
                    <li key={cat.name}>
                      <span className="text-foreground">{cat.name}</span> · {cat.channels.length}{" "}
                      {c.chans}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-auto flex flex-col gap-2 pt-8 sm:flex-row">
                <Button asChild size="lg" className="h-11">
                  <a
                    href={`/setup?template=${encodeURIComponent(tpl.id)}`}
                    onClick={() => rememberTemplate(tpl.id)}
                  >
                    {c.use} <ArrowRight className="size-4" />
                  </a>
                </Button>
                <Button size="lg" variant="ghost" className="h-11" onClick={onClose}>
                  {c.close}
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

const PLAN_ROWS: Array<{
  action: "create" | "update" | "skip" | "review";
  kind: string;
  name: string;
}> = [
  { action: "create", kind: "role", name: "🛡️・Administrator" },
  { action: "create", kind: "role", name: "🎮・Gamer" },
  { action: "create", kind: "category", name: "👋・WELCOME" },
  { action: "update", kind: "channel", name: "#rules · read-only" },
  { action: "skip", kind: "channel", name: "#general" },
  { action: "create", kind: "channel", name: "#looking-for-group" },
  { action: "create", kind: "voice", name: "🔊 Gaming 1" },
  { action: "update", kind: "category", name: "🛡️・STAFF · private" },
  { action: "review", kind: "leftover", name: "#old-memes" },
];

const ACTION_COLOR = {
  create: "text-success",
  update: "text-blue",
  skip: "text-muted-foreground",
  review: "text-warning",
} as const;

function HowItWorks() {
  const { lang } = useLang();
  const c = COPY[lang];
  return (
    <section id="how" className="scroll-mt-20 border-t border-border/70 bg-surface/30">
      <div className="mx-auto grid max-w-6xl gap-14 px-4 py-24 sm:px-6 lg:grid-cols-2">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary">
            {c.howKicker}
          </p>
          <h2 className="mt-4 text-3xl font-bold leading-tight sm:text-[2.75rem]">{c.howTitle}</h2>
          <ol className="mt-10 space-y-8">
            {c.steps.map(([title, body], i) => (
              <li key={title} className="grid grid-cols-[2.5rem_1fr] gap-4">
                <span className="font-mono text-sm text-primary">0{i + 1}</span>
                <div>
                  <h3 className="text-lg font-semibold">{title}</h3>
                  <p className="mt-1 text-[15px] leading-relaxed text-muted-foreground">{body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="self-center overflow-hidden rounded-xl border border-border bg-[#0F1012] font-mono text-[13px] shadow-elevate">
          <div className="flex items-center gap-2 border-b border-border px-4 py-3 text-xs text-muted-foreground">
            <span className="size-2.5 rounded-full bg-[#3A3B3F]" />
            <span className="size-2.5 rounded-full bg-[#3A3B3F]" />
            <span className="size-2.5 rounded-full bg-[#3A3B3F]" />
            <span className="ml-2">{c.planTitle}</span>
          </div>
          <ul className="divide-y divide-border/50">
            {PLAN_ROWS.map((r) => (
              <li
                key={r.name}
                className="grid grid-cols-[4.5rem_5.5rem_1fr] items-center gap-2 px-4 py-2.5"
              >
                <span className={cn("uppercase", ACTION_COLOR[r.action])}>{r.action}</span>
                <span className="text-muted-foreground">{r.kind}</span>
                <span className="truncate text-foreground/90">{r.name}</span>
              </li>
            ))}
          </ul>
          <div className="border-t border-border px-4 py-3 text-xs text-muted-foreground">
            {c.planFoot}
          </div>
        </div>
      </div>
    </section>
  );
}

function CompareCell({ value, strong }: { value: boolean | string; strong?: boolean }) {
  if (value === true)
    return (
      <Check className={cn("mx-auto size-5", strong ? "text-primary" : "text-foreground/70")} />
    );
  if (value === false) return <X className="mx-auto size-5 text-muted-foreground/50" />;
  if (value === "partial") return <Minus className="mx-auto size-5 text-muted-foreground" />;
  return <span className={cn("font-mono text-sm", strong && "text-primary")}>{value}</span>;
}

function Compare() {
  const { lang } = useLang();
  const c = COPY[lang];
  return (
    <section className="mx-auto max-w-6xl px-4 pt-24 sm:px-6">
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary">{c.cmpKicker}</p>
      <h2 className="mt-4 text-3xl font-bold leading-tight sm:text-[2.75rem]">{c.cmpTitle}</h2>
      <div className="-mx-4 mt-10 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        <table className="w-full min-w-[620px] border-collapse text-left">
          <thead>
            <tr className="border-b border-border">
              <th className="w-[40%] py-4" />
              {c.cmpCols.map((col, i) => (
                <th
                  key={col}
                  className={cn(
                    "px-3 py-4 text-center text-sm font-semibold",
                    i === 0 ? "rounded-t-lg bg-primary/10 text-primary" : "text-muted-foreground",
                  )}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {c.cmpRows.map(([label, ...cells]) => (
              <tr key={String(label)} className="border-b border-border/70">
                <td className="py-4 pr-4 text-[15px]">{label}</td>
                {cells.map((v, i) => (
                  <td key={i} className={cn("px-3 py-4 text-center", i === 0 && "bg-primary/10")}>
                    <CompareCell value={v} strong={i === 0} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-xs text-muted-foreground">{c.cmpNote}</p>
    </section>
  );
}

function Guardrails() {
  const { lang } = useLang();
  const c = COPY[lang];
  return (
    <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
      <div className="grid gap-10 rounded-2xl border border-border p-8 sm:p-12 lg:grid-cols-[1fr_1.2fr]">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary">
            {c.neverKicker}
          </p>
          <h2 className="mt-4 text-3xl font-bold leading-tight">{c.neverTitle}</h2>
          <p className="mt-4 text-muted-foreground">{c.neverNote}</p>
        </div>
        <ul className="grid content-center gap-3">
          {c.never.map((item) => (
            <li
              key={item}
              className="flex items-start gap-3 border-b border-border/70 pb-3 last:border-0 last:pb-0"
            >
              <X className="mt-0.5 size-5 shrink-0 text-destructive" />
              <span className="text-[17px]">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Faq() {
  const { lang } = useLang();
  const c = COPY[lang];
  return (
    <section
      id="faq"
      className="mx-auto grid max-w-6xl scroll-mt-20 gap-10 px-4 pb-24 sm:px-6 lg:grid-cols-[1fr_1.6fr]"
    >
      <h2 className="text-3xl font-bold leading-tight">{c.faqTitle}</h2>
      <Accordion type="single" collapsible className="border-t border-border">
        {c.faq.map(([q = "", a]) => (
          <AccordionItem key={q} value={q}>
            <AccordionTrigger className="py-5 text-left text-[17px] hover:no-underline">
              {q}
            </AccordionTrigger>
            <AccordionContent className="pb-5 text-[15px] leading-relaxed text-muted-foreground">
              {a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}

function FinalCta() {
  const { lang } = useLang();
  const c = COPY[lang];
  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6">
      <div className="relative overflow-hidden rounded-2xl bg-primary px-8 py-14 text-primary-foreground sm:px-14">
        <div className="relative max-w-2xl">
          <h2 className="text-3xl font-bold leading-tight sm:text-[2.6rem]">{c.finalTitle}</h2>
          <p className="mt-4 text-[17px] opacity-80">{c.finalBody}</p>
          <Button
            asChild
            size="lg"
            variant="secondary"
            className="mt-8 h-12 bg-[#111214] px-6 text-[15px] text-white hover:bg-[#1c1d20]"
          >
            <Link to="/setup">
              {c.cta} <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
        <svg
          aria-hidden
          viewBox="0 0 200 200"
          className="absolute -bottom-16 -right-10 size-72 opacity-15 sm:size-96"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
        >
          <path d="M100 10 178 55v90l-78 45-78-45V55z" />
          <path d="M100 40 152 70v60l-52 30-52-30V70z" />
          <path d="M100 70 126 85v30l-26 15-26-15V85z" />
        </svg>
      </div>
    </section>
  );
}
