import { useCallback, useEffect, useState, type ReactNode } from "react";
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  Bot,
  Check,
  CheckCircle2,
  Hash,
  LayoutDashboard,
  Loader2,
  LockKeyhole,
  LogIn,
  LogOut,
  Menu,
  Palette,
  RefreshCw,
  Server,
  Settings,
  WandSparkles,
  X,
} from "lucide-react";

import { API, INSTALLABLE, type CatalogTemplate, type Lang } from "./catalog";
import { LangToggle, LogoMark } from "./Landing";
import { DiscordRail, DiscordSidebar, Gallery, TemplateCard, TemplateDialog } from "./ui";

const SESSION_KEY = "livenest_discord_session";

type Page = "dashboard" | "templates" | "builder" | "server" | "activity" | "settings";
type Guild = { guild_id: string; guild_name: string; bot_present?: boolean };
type InstallResult = { ok?: boolean; error?: string } | null;
type NameMode = "en" | "es" | "both";

const T = {
  en: {
    nav: {
      dashboard: "Overview",
      templates: "Templates",
      builder: "Builder",
      server: "Servers",
      activity: "Activity",
      settings: "Settings",
    },
    backToSite: "Back to site",
    invite: "Invite bot",
    connect: "Connect Discord",
    connected: "Discord connected",
    notConnected: "Discord not connected",
    free: "Free, no paywalls",
    // Overview
    ovKicker: "Your workspace",
    ovTitle: "Let's get your server built.",
    ovBody: "Four steps from an empty server to a finished one. Here's where you are.",
    checklist: [
      ["Connect Discord", "Sign in so LiveNest can see the servers you manage."],
      ["Invite the bot", "Add the LiveNest bot to the server you want to set up."],
      ["Pick a template", "Open one, check the preview, press “Use this template”."],
      ["Install", "Choose the language, review, and install."],
    ],
    doIt: ["Connect", "Invite bot", "Browse templates", "Open builder"],
    done: "Done",
    statServers: "servers connected",
    statTemplates: "templates installable",
    statModes: "naming modes",
    statPrice: "price",
    freeWord: "Free",
    featured: "Ready to install",
    viewAll: "View all templates",
    // Builder
    bKicker: "Server builder",
    bTitle: "Build it before you install it.",
    steps: ["Template", "Language", "Server", "Review"],
    noTemplate: "No template selected yet.",
    noTemplateBody: "Pick one from the library and press “Use this template”.",
    browse: "Browse templates",
    change: "Change template",
    next: "Continue",
    back: "Back",
    langTitle: "How should your server speak?",
    langBody: "This sets the naming for every channel, category and role.",
    modes: [
      ["en", "English", "Everything in English.", "#welcome"],
      ["es", "Español", "Todo en español.", "#bienvenida"],
      ["both", "English + Español", "Bilingual names everywhere.", "#welcome・bienvenida"],
    ] as ReadonlyArray<readonly [NameMode, string, string, string]>,
    serverTitle: "Which server?",
    serverBody: "Only servers you manage show up. The bot has to be in the server to install.",
    botIn: "Bot installed",
    botOut: "Bot not in this server yet",
    noServers: "No servers found",
    noServersBody: "Invite the LiveNest bot to a server you manage, then refresh.",
    connectFirst: "Connect Discord first",
    connectFirstBody: "Sign in with Discord to see the servers you manage.",
    refresh: "Refresh",
    review: "Review",
    reviewTitle: "Ready to install",
    reviewBody: "Nothing changes in Discord until you press install.",
    rowTemplate: "template",
    rowCats: "categories",
    rowChannels: "channels",
    rowRoles: "roles",
    rowLang: "language",
    rowServer: "server",
    rowPrice: "price",
    install: "Install to Discord",
    installing: "Installing…",
    installed: "Installed",
    installedBody: "Your server is set up. Open Discord to see it.",
    failed: "Installation failed",
    failedBody:
      "Nothing is reported as done unless the installer finishes. Check the bot's permissions and try again.",
    viewServers: "View servers",
    notInstallable: "This template isn't installable yet. Pick one marked “Installable now”.",
    // Servers
    sKicker: "Servers",
    sTitleIn: "Your Discord servers.",
    sTitleOut: "Connect your Discord.",
    sBodyIn: "Servers you manage. Pick one with the bot in it to start building.",
    sBodyOut: "Sign in with Discord to see the servers you manage, then invite the bot.",
    loading: "Loading servers…",
    setUp: "Set up",
    // Activity
    aKicker: "Activity",
    aTitle: "Everything LiveNest changes will show up here.",
    aBody: "Install your first template and you'll see what was created, and where.",
    // Settings
    stKicker: "Settings",
    stTitle: "Preferences",
    stLang: "Interface language",
    stLangBody: "Used across the site and dashboard.",
    stSession: "Discord session",
    stSessionIn: "Signed in on this browser.",
    stSessionOut: "Not signed in.",
    signOut: "Sign out",
    stPrice: "Pricing",
    stPriceBody: "LiveNest is free. No subscriptions, no paywalls.",
  },
  es: {
    nav: {
      dashboard: "Inicio",
      templates: "Plantillas",
      builder: "Constructor",
      server: "Servidores",
      activity: "Actividad",
      settings: "Ajustes",
    },
    backToSite: "Volver a la web",
    invite: "Invitar bot",
    connect: "Conectar Discord",
    connected: "Discord conectado",
    notConnected: "Discord sin conectar",
    free: "Gratis, sin muros de pago",
    ovKicker: "Tu espacio",
    ovTitle: "Vamos a montar tu servidor.",
    ovBody: "Cuatro pasos para pasar de un servidor vacío a uno terminado. Aquí ves por dónde vas.",
    checklist: [
      ["Conecta Discord", "Inicia sesión para que LiveNest vea los servidores que administras."],
      ["Invita al bot", "Añade el bot de LiveNest al servidor que quieres configurar."],
      ["Elige una plantilla", "Ábrela, revisa la vista previa y pulsa “Usar esta plantilla”."],
      ["Instala", "Elige el idioma, revisa e instala."],
    ],
    doIt: ["Conectar", "Invitar bot", "Ver plantillas", "Abrir constructor"],
    done: "Hecho",
    statServers: "servidores conectados",
    statTemplates: "plantillas instalables",
    statModes: "modos de nombres",
    statPrice: "precio",
    freeWord: "Gratis",
    featured: "Listas para instalar",
    viewAll: "Ver todas las plantillas",
    bKicker: "Constructor",
    bTitle: "Constrúyelo antes de instalarlo.",
    steps: ["Plantilla", "Idioma", "Servidor", "Revisión"],
    noTemplate: "Todavía no has elegido plantilla.",
    noTemplateBody: "Elige una de la biblioteca y pulsa “Usar esta plantilla”.",
    browse: "Ver plantillas",
    change: "Cambiar plantilla",
    next: "Continuar",
    back: "Atrás",
    langTitle: "¿En qué idioma habla tu servidor?",
    langBody: "Define los nombres de cada canal, categoría y rol.",
    modes: [
      ["en", "English", "Everything in English.", "#welcome"],
      ["es", "Español", "Todo en español.", "#bienvenida"],
      ["both", "English + Español", "Nombres bilingües en todo.", "#welcome・bienvenida"],
    ] as ReadonlyArray<readonly [NameMode, string, string, string]>,
    serverTitle: "¿Qué servidor?",
    serverBody:
      "Solo aparecen los servidores que administras. El bot tiene que estar dentro para instalar.",
    botIn: "Bot instalado",
    botOut: "El bot aún no está en este servidor",
    noServers: "No se encontraron servidores",
    noServersBody: "Invita al bot de LiveNest a un servidor que administres y actualiza.",
    connectFirst: "Conecta Discord primero",
    connectFirstBody: "Inicia sesión con Discord para ver los servidores que administras.",
    refresh: "Actualizar",
    review: "Revisar",
    reviewTitle: "Listo para instalar",
    reviewBody: "Nada cambia en Discord hasta que pulses instalar.",
    rowTemplate: "plantilla",
    rowCats: "categorías",
    rowChannels: "canales",
    rowRoles: "roles",
    rowLang: "idioma",
    rowServer: "servidor",
    rowPrice: "precio",
    install: "Instalar en Discord",
    installing: "Instalando…",
    installed: "Instalada",
    installedBody: "Tu servidor está listo. Abre Discord para verlo.",
    failed: "La instalación falló",
    failedBody:
      "No se da nada por hecho si el instalador no termina. Revisa los permisos del bot e inténtalo de nuevo.",
    viewServers: "Ver servidores",
    notInstallable:
      "Esta plantilla aún no se puede instalar. Elige una marcada como “Instalables ya”.",
    sKicker: "Servidores",
    sTitleIn: "Tus servidores de Discord.",
    sTitleOut: "Conecta tu Discord.",
    sBodyIn: "Servidores que administras. Elige uno con el bot dentro para empezar.",
    sBodyOut:
      "Inicia sesión con Discord para ver los servidores que administras y luego invita al bot.",
    loading: "Cargando servidores…",
    setUp: "Configurar",
    aKicker: "Actividad",
    aTitle: "Aquí verás todo lo que cambie LiveNest.",
    aBody: "Instala tu primera plantilla y verás qué se creó y dónde.",
    stKicker: "Ajustes",
    stTitle: "Preferencias",
    stLang: "Idioma de la interfaz",
    stLangBody: "Se usa en la web y en el panel.",
    stSession: "Sesión de Discord",
    stSessionIn: "Sesión iniciada en este navegador.",
    stSessionOut: "Sin sesión.",
    signOut: "Cerrar sesión",
    stPrice: "Precio",
    stPriceBody: "LiveNest es gratis. Sin suscripciones ni muros de pago.",
  },
};

type Copy = (typeof T)["en"];

const NAV: Array<[Page, typeof LayoutDashboard]> = [
  ["dashboard", LayoutDashboard],
  ["templates", Palette],
  ["builder", WandSparkles],
  ["server", Server],
  ["activity", Activity],
  ["settings", Settings],
];

export function Dashboard({
  lang,
  setLang,
  initialTemplate,
  goHome,
}: {
  lang: Lang;
  setLang: (l: Lang) => void;
  initialTemplate: CatalogTemplate | null;
  goHome: () => void;
}) {
  const c = T[lang];
  const [page, setPage] = useState<Page>(initialTemplate ? "builder" : "dashboard");
  const [menu, setMenu] = useState(false);
  const [selected, setSelected] = useState<CatalogTemplate | null>(initialTemplate);
  const [targetGuild, setTargetGuild] = useState<Guild | null>(null);
  const [session, setSession] = useState(() => localStorage.getItem(SESSION_KEY) || "");
  const [guilds, setGuilds] = useState<Guild[]>([]);
  const [loading, setLoading] = useState(false);

  // OAuth returns with ?discord_session=…; keep it and clean the URL.
  useEffect(() => {
    const s = new URLSearchParams(location.search).get("discord_session");
    if (s) {
      localStorage.setItem(SESSION_KEY, s);
      setSession(s);
      history.replaceState({}, "", location.pathname);
    }
  }, []);

  const call = useCallback(
    async (action: string, opts: RequestInit = {}) => {
      const r = await fetch(`${API}/discord-server?action=${action}`, {
        ...opts,
        headers: {
          ...(opts.headers || {}),
          Authorization: `Bearer ${session}`,
          "content-type": "application/json",
        },
      });
      const d = await r.json().catch(() => ({ error: "Invalid server response" }));
      if (!r.ok) throw new Error(d.error || "Request failed");
      return d;
    },
    [session],
  );

  const loadGuilds = useCallback(async () => {
    if (!session) {
      setGuilds([]);
      return;
    }
    setLoading(true);
    try {
      const d = await call("guilds");
      setGuilds(d.guilds || []);
    } catch (e) {
      console.error(e);
      setGuilds([]);
    } finally {
      setLoading(false);
    }
  }, [session, call]);

  useEffect(() => {
    loadGuilds();
  }, [loadGuilds]);

  // Coming back from the bot invite tab should show the bot as installed without a manual refresh.
  useEffect(() => {
    if ((page !== "server" && page !== "builder") || !session) return;
    const refresh = () => {
      if (document.visibilityState === "visible") loadGuilds();
    };
    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", refresh);
    return () => {
      window.removeEventListener("focus", refresh);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, [page, session, loadGuilds]);

  const invite = () => (location.href = `${API}/discord-invite`);
  const connect = () => (location.href = `${API}/discord-oauth?action=authorize`);
  const signOut = () => {
    localStorage.removeItem(SESSION_KEY);
    setSession("");
  };
  const go = (p: Page) => {
    setPage(p);
    setMenu(false);
    window.scrollTo(0, 0);
  };
  const useTemplate = (t: CatalogTemplate) => {
    setSelected(t);
    go("builder");
  };

  return (
    <div className="ln ln-app">
      <aside className={menu ? "ln-side is-open" : "ln-side"}>
        <div className="ln-side-top">
          <button type="button" className="ln-logo ln-logo-btn" onClick={goHome}>
            <LogoMark size={30} />
            <span>LiveNest</span>
          </button>
          <button
            type="button"
            className="ln-icon-btn ln-only-sm"
            onClick={() => setMenu(false)}
            aria-label="Close menu"
          >
            <X width={18} height={18} />
          </button>
        </div>
        <nav className="ln-side-nav">
          {NAV.map(([id, Icon]) => (
            <button
              key={id}
              type="button"
              className={page === id ? "is-on" : ""}
              onClick={() => go(id)}
            >
              <Icon width={18} height={18} />
              <span>{c.nav[id]}</span>
            </button>
          ))}
        </nav>
        <div className="ln-side-bottom">
          <div className={session ? "ln-conn is-on" : "ln-conn"}>
            <i />
            <span>{session ? c.connected : c.notConnected}</span>
          </div>
          {!session && (
            <button
              type="button"
              className="ln-btn ln-btn-gold ln-btn-sm ln-full"
              onClick={connect}
            >
              <LogIn width={16} height={16} /> {c.connect}
            </button>
          )}
          <button type="button" className="ln-side-link" onClick={goHome}>
            <ArrowLeft width={14} height={14} /> {c.backToSite}
          </button>
        </div>
      </aside>
      {menu && <div className="ln-scrim" onClick={() => setMenu(false)} />}

      <div className="ln-app-main">
        <div className="ln-topbar">
          <div className="ln-topbar-left">
            <button
              type="button"
              className="ln-icon-btn ln-only-sm"
              onClick={() => setMenu(true)}
              aria-label="Menu"
            >
              <Menu width={20} height={20} />
            </button>
            <span className="ln-crumb">{c.nav[page]}</span>
          </div>
          <div className="ln-topbar-right">
            <LangToggle lang={lang} setLang={setLang} />
            <button type="button" className="ln-btn ln-btn-outline ln-btn-sm" onClick={invite}>
              <Bot width={16} height={16} /> <span className="ln-hide-sm">{c.invite}</span>
            </button>
          </div>
        </div>

        <div className="ln-app-content">
          {page === "dashboard" && (
            <Overview
              c={c}
              lang={lang}
              session={session}
              guilds={guilds}
              selected={selected}
              connect={connect}
              invite={invite}
              go={go}
              useTemplate={useTemplate}
            />
          )}
          {page === "templates" && (
            <>
              <PageHead
                kicker={c.nav.templates}
                title={
                  lang === "es"
                    ? "Empieza con un servidor que ya funciona."
                    : "Start from a server that already works."
                }
              />
              <Gallery lang={lang} onUse={useTemplate} />
            </>
          )}
          {page === "builder" && (
            <Builder
              c={c}
              selected={selected}
              guilds={guilds}
              session={session}
              loading={loading}
              call={call}
              go={go}
              preferredGuild={targetGuild}
              connect={connect}
              invite={invite}
              reload={loadGuilds}
            />
          )}
          {page === "server" && (
            <Servers
              c={c}
              session={session}
              guilds={guilds}
              loading={loading}
              connect={connect}
              invite={invite}
              reload={loadGuilds}
              onSelect={(g) => {
                setTargetGuild(g);
                go("builder");
              }}
            />
          )}
          {page === "activity" && (
            <>
              <PageHead kicker={c.aKicker} title={c.aTitle} />
              <EmptyState
                icon={<Activity width={22} height={22} />}
                title={c.aTitle}
                body={c.aBody}
              />
            </>
          )}
          {page === "settings" && (
            <SettingsPage
              c={c}
              lang={lang}
              setLang={setLang}
              session={session}
              signOut={signOut}
              connect={connect}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function PageHead({
  kicker,
  title,
  body,
  action,
}: {
  kicker: string;
  title: string;
  body?: string;
  action?: ReactNode;
}) {
  return (
    <div className="ln-page-head">
      <div>
        <p className="ln-kicker">{kicker}</p>
        <h1>{title}</h1>
        {body && <p className="ln-muted">{body}</p>}
      </div>
      {action}
    </div>
  );
}

function EmptyState({
  icon,
  title,
  body,
  action,
}: {
  icon: ReactNode;
  title: string;
  body: string;
  action?: ReactNode;
}) {
  return (
    <div className="ln-empty">
      <div className="ln-empty-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{body}</p>
      {action}
    </div>
  );
}

function Overview({
  c,
  lang,
  session,
  guilds,
  selected,
  connect,
  invite,
  go,
  useTemplate,
}: {
  c: Copy;
  lang: Lang;
  session: string;
  guilds: Guild[];
  selected: CatalogTemplate | null;
  connect: () => void;
  invite: () => void;
  go: (p: Page) => void;
  useTemplate: (t: CatalogTemplate) => void;
}) {
  const [open, setOpen] = useState<CatalogTemplate | null>(null);
  const done = [Boolean(session), guilds.some((g) => g.bot_present), Boolean(selected), false];
  const actions = [connect, invite, () => go("templates"), () => go("builder")];
  const current = done.findIndex((d) => !d);

  return (
    <>
      <PageHead kicker={c.ovKicker} title={c.ovTitle} body={c.ovBody} />
      <ol className="ln-checklist">
        {c.checklist.map(([title, body], i) => (
          <li key={title} className={done[i] ? "is-done" : i === current ? "is-current" : ""}>
            <span className="ln-check-num">
              {done[i] ? <Check width={16} height={16} /> : i + 1}
            </span>
            <div>
              <h3>{title}</h3>
              <p>{body}</p>
            </div>
            {done[i] ? (
              <span className="ln-chip-done">{c.done}</span>
            ) : (
              <button
                type="button"
                className={
                  i === current ? "ln-btn ln-btn-gold ln-btn-sm" : "ln-btn ln-btn-outline ln-btn-sm"
                }
                onClick={actions[i]}
              >
                {c.doIt[i]} <ArrowRight width={14} height={14} />
              </button>
            )}
          </li>
        ))}
      </ol>

      <dl className="ln-app-stats">
        {[
          [guilds.length, c.statServers],
          [INSTALLABLE.length, c.statTemplates],
          [3, c.statModes],
          [c.freeWord, c.statPrice],
        ].map(([v, l]) => (
          <div key={String(l)}>
            <dt>{v}</dt>
            <dd>{l}</dd>
          </div>
        ))}
      </dl>

      <div className="ln-row-head">
        <h2>{c.featured}</h2>
        <button
          type="button"
          className="ln-btn ln-btn-ghost ln-btn-sm"
          onClick={() => go("templates")}
        >
          {c.viewAll} <ArrowRight width={14} height={14} />
        </button>
      </div>
      <div className="ln-grid">
        {INSTALLABLE.slice(0, 3).map((t) => (
          <TemplateCard key={t.id} t={t} lang={lang} onOpen={setOpen} />
        ))}
      </div>
      <TemplateDialog
        t={open}
        lang={lang}
        onClose={() => setOpen(null)}
        onUse={(t) => {
          setOpen(null);
          useTemplate(t);
        }}
      />
    </>
  );
}

export function DiscordWindow({
  t,
  tall,
  compact,
}: {
  t: CatalogTemplate;
  tall?: boolean;
  compact?: boolean;
}) {
  const first = t.categories[0]?.channels[0]?.name ?? "welcome";
  return (
    <div className={["ln-dc-window", tall ? "is-tall" : "", compact ? "is-compact" : ""].join(" ")}>
      <DiscordRail accent={t.accent} />
      <DiscordSidebar t={t} maxCategories={30} maxChannels={30} scroll />
      <div className="ln-dc-chat">
        <div className="ln-dc-chat-head">
          <Hash width={20} height={20} />
          <span>{first}</span>
        </div>
        <div className="ln-dc-chat-body">
          <div className="ln-dc-msg">
            <div className="ln-dc-avatar" style={{ background: t.accent }}>
              LN
            </div>
            <div className="ln-dc-msg-main">
              <div className="ln-dc-msg-meta">
                <b>LiveNest</b>
                <span className="ln-dc-app">APP</span>
              </div>
              <div className="ln-dc-embed" style={{ borderColor: t.accent }}>
                <b>{t.name}</b>
                <p style={{ marginTop: 6 }}>{t.chat ?? t.desc}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Builder({
  c,
  selected,
  guilds,
  session,
  loading,
  call,
  go,
  preferredGuild,
  connect,
  invite,
  reload,
}: {
  c: Copy;
  selected: CatalogTemplate | null;
  guilds: Guild[];
  session: string;
  loading: boolean;
  call: (action: string, opts?: RequestInit) => Promise<InstallResult>;
  go: (p: Page) => void;
  preferredGuild: Guild | null;
  connect: () => void;
  invite: () => void;
  reload: () => void;
}) {
  const [step, setStep] = useState(1);
  const [mode, setMode] = useState<NameMode>("both");
  const [guild, setGuild] = useState(preferredGuild?.guild_id || guilds[0]?.guild_id || "");
  const [installing, setInstalling] = useState(false);
  const [result, setResult] = useState<InstallResult>(null);

  useEffect(() => {
    if (preferredGuild?.guild_id) setGuild(preferredGuild.guild_id);
    else if (!guild && guilds[0]) setGuild(guilds[0].guild_id);
  }, [guilds, preferredGuild]); // eslint-disable-line react-hooks/exhaustive-deps

  const guildObj = guilds.find((g) => g.guild_id === guild);
  const modeLabel = c.modes.find((m) => m[0] === mode)?.[1] ?? mode;

  const install = async () => {
    if (!session) {
      go("server");
      return;
    }
    if (!selected || !guild || !selected.installable) return;
    setInstalling(true);
    try {
      setResult(
        await call("install", {
          method: "POST",
          body: JSON.stringify({ guild_id: guild, template_id: selected.id, language: mode }),
        }),
      );
    } catch (e) {
      setResult({ error: (e as Error).message });
    } finally {
      setInstalling(false);
    }
  };

  const canReach = (n: number) =>
    n === 1 || (Boolean(selected?.installable) && (n < 4 || Boolean(guild)));

  return (
    <>
      <PageHead kicker={c.bKicker} title={c.bTitle} />
      <ol className="ln-stepper">
        {c.steps.map((s, i) => {
          const n = i + 1;
          return (
            <li key={s}>
              <button
                type="button"
                className={step === n ? "is-on" : step > n ? "is-done" : ""}
                disabled={!canReach(n)}
                onClick={() => setStep(n)}
              >
                <span>{step > n ? <Check width={14} height={14} /> : n}</span>
                {s}
              </button>
            </li>
          );
        })}
      </ol>

      {step === 1 &&
        (selected ? (
          <div className="ln-builder-grid">
            <DiscordWindow t={selected} tall />
            <div className="ln-panel">
              <p className="ln-kicker" style={{ color: selected.accent }}>
                {selected.tagline}
              </p>
              <h2>{selected.name}</h2>
              <p className="ln-muted">{selected.desc}</p>
              <ul className="ln-facts">
                <li>
                  <b>{selected.categories.length}</b> {c.rowCats}
                </li>
                <li>
                  <b>{selected.channels}</b> {c.rowChannels}
                </li>
                <li>
                  <b>{selected.roleCount}</b> {c.rowRoles}
                </li>
              </ul>
              {!selected.installable && <p className="ln-soon-note">{c.notInstallable}</p>}
              <div className="ln-panel-actions">
                <button
                  type="button"
                  className="ln-btn ln-btn-gold"
                  disabled={!selected.installable}
                  onClick={() => setStep(2)}
                >
                  {c.next} <ArrowRight width={16} height={16} />
                </button>
                <button
                  type="button"
                  className="ln-btn ln-btn-ghost"
                  onClick={() => go("templates")}
                >
                  {c.change}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <EmptyState
            icon={<Palette width={22} height={22} />}
            title={c.noTemplate}
            body={c.noTemplateBody}
            action={
              <button type="button" className="ln-btn ln-btn-gold" onClick={() => go("templates")}>
                {c.browse} <ArrowRight width={16} height={16} />
              </button>
            }
          />
        ))}

      {step === 2 && (
        <div className="ln-panel">
          <h2>{c.langTitle}</h2>
          <p className="ln-muted">{c.langBody}</p>
          <div className="ln-choice-grid">
            {c.modes.map(([id, title, body, example]) => (
              <button
                key={id}
                type="button"
                className={mode === id ? "ln-choice is-on" : "ln-choice"}
                onClick={() => setMode(id)}
              >
                <div className="ln-choice-head">
                  <b>{title}</b>
                  <CheckCircle2 width={18} height={18} />
                </div>
                <span>{body}</span>
                <code>{example}</code>
              </button>
            ))}
          </div>
          <div className="ln-panel-actions">
            <button type="button" className="ln-btn ln-btn-gold" onClick={() => setStep(3)}>
              {c.next} <ArrowRight width={16} height={16} />
            </button>
            <button type="button" className="ln-btn ln-btn-ghost" onClick={() => setStep(1)}>
              {c.back}
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="ln-panel">
          <h2>{c.serverTitle}</h2>
          <p className="ln-muted">{c.serverBody}</p>
          {!session ? (
            <EmptyState
              icon={<LogIn width={22} height={22} />}
              title={c.connectFirst}
              body={c.connectFirstBody}
              action={
                <button type="button" className="ln-btn ln-btn-gold" onClick={connect}>
                  {c.connect}
                </button>
              }
            />
          ) : loading && !guilds.length ? (
            <div className="ln-loading">
              <Loader2 className="ln-spin" width={18} height={18} /> {c.loading}
            </div>
          ) : guilds.length ? (
            <div className="ln-server-list">
              {guilds.map((g) => (
                <label
                  key={g.guild_id}
                  className={guild === g.guild_id ? "ln-server is-on" : "ln-server"}
                >
                  <input
                    type="radio"
                    name="guild"
                    checked={guild === g.guild_id}
                    onChange={() => setGuild(g.guild_id)}
                  />
                  <span className="ln-server-icon">{(g.guild_name || "?").slice(0, 1)}</span>
                  <span className="ln-server-name">
                    <b>{g.guild_name}</b>
                    <small className={g.bot_present ? "ln-green" : "ln-muted"}>
                      {g.bot_present ? c.botIn : c.botOut}
                    </small>
                  </span>
                  {!g.bot_present && (
                    <button
                      type="button"
                      className="ln-btn ln-btn-outline ln-btn-sm"
                      onClick={invite}
                    >
                      <Bot width={14} height={14} /> {c.invite}
                    </button>
                  )}
                </label>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<Server width={22} height={22} />}
              title={c.noServers}
              body={c.noServersBody}
              action={
                <div className="ln-panel-actions">
                  <button type="button" className="ln-btn ln-btn-gold" onClick={invite}>
                    <Bot width={16} height={16} /> {c.invite}
                  </button>
                  <button type="button" className="ln-btn ln-btn-outline" onClick={reload}>
                    <RefreshCw width={16} height={16} /> {c.refresh}
                  </button>
                </div>
              }
            />
          )}
          <div className="ln-panel-actions">
            <button
              type="button"
              className="ln-btn ln-btn-gold"
              disabled={!guild}
              onClick={() => setStep(4)}
            >
              {c.review} <ArrowRight width={16} height={16} />
            </button>
            <button type="button" className="ln-btn ln-btn-ghost" onClick={() => setStep(2)}>
              {c.back}
            </button>
          </div>
        </div>
      )}

      {step === 4 && selected && (
        <div className="ln-builder-grid">
          <div className="ln-panel">
            {result?.ok ? (
              <div className="ln-result is-ok">
                <CheckCircle2 width={22} height={22} />
                <div>
                  <h2>{c.installed}</h2>
                  <p>{c.installedBody}</p>
                </div>
              </div>
            ) : result?.error ? (
              <div className="ln-result is-err">
                <X width={22} height={22} />
                <div>
                  <h2>{c.failed}</h2>
                  <p>
                    <b>{result.error}</b> — {c.failedBody}
                  </p>
                </div>
              </div>
            ) : (
              <>
                <h2>{c.reviewTitle}</h2>
                <p className="ln-muted">{c.reviewBody}</p>
              </>
            )}

            <ul className="ln-review">
              <li>
                <span>{c.rowTemplate}</span>
                <b>{selected.name}</b>
              </li>
              <li>
                <span>{c.rowChannels}</span>
                <b className="ln-green">+ {selected.channels}</b>
              </li>
              <li>
                <span>{c.rowRoles}</span>
                <b className="ln-green">+ {selected.roleCount}</b>
              </li>
              <li>
                <span>{c.rowLang}</span>
                <b>{modeLabel}</b>
              </li>
              <li>
                <span>{c.rowServer}</span>
                <b>{guildObj?.guild_name ?? "—"}</b>
              </li>
              <li>
                <span>{c.rowPrice}</span>
                <b className="ln-gold">{c.freeWord}</b>
              </li>
            </ul>

            <div className="ln-panel-actions">
              {result?.ok ? (
                <button type="button" className="ln-btn ln-btn-gold" onClick={() => go("server")}>
                  {c.viewServers} <ArrowRight width={16} height={16} />
                </button>
              ) : (
                <button
                  type="button"
                  className="ln-btn ln-btn-gold ln-btn-lg"
                  disabled={installing || !guild || !selected.installable}
                  onClick={install}
                >
                  {installing ? (
                    <>
                      <Loader2 className="ln-spin" width={16} height={16} /> {c.installing}
                    </>
                  ) : (
                    <>
                      <WandSparkles width={16} height={16} /> {c.install}
                    </>
                  )}
                </button>
              )}
              {!result?.ok && (
                <button type="button" className="ln-btn ln-btn-ghost" onClick={() => setStep(3)}>
                  {c.back}
                </button>
              )}
            </div>
          </div>
          <DiscordWindow t={selected} compact />
        </div>
      )}
    </>
  );
}

function Servers({
  c,
  session,
  guilds,
  loading,
  connect,
  invite,
  reload,
  onSelect,
}: {
  c: Copy;
  session: string;
  guilds: Guild[];
  loading: boolean;
  connect: () => void;
  invite: () => void;
  reload: () => void;
  onSelect: (g: Guild) => void;
}) {
  return (
    <>
      <PageHead
        kicker={c.sKicker}
        title={session ? c.sTitleIn : c.sTitleOut}
        body={session ? c.sBodyIn : c.sBodyOut}
        action={
          <div className="ln-panel-actions">
            {session ? (
              <button
                type="button"
                className="ln-btn ln-btn-outline"
                onClick={reload}
                disabled={loading}
              >
                <RefreshCw className={loading ? "ln-spin" : ""} width={16} height={16} />{" "}
                {c.refresh}
              </button>
            ) : (
              <button type="button" className="ln-btn ln-btn-gold" onClick={connect}>
                <LogIn width={16} height={16} /> {c.connect}
              </button>
            )}
            <button type="button" className="ln-btn ln-btn-outline" onClick={invite}>
              <Bot width={16} height={16} /> {c.invite}
            </button>
          </div>
        }
      />
      {!session ? (
        <EmptyState
          icon={<Server width={22} height={22} />}
          title={c.connectFirst}
          body={c.connectFirstBody}
        />
      ) : loading && !guilds.length ? (
        <div className="ln-loading">
          <Loader2 className="ln-spin" width={18} height={18} /> {c.loading}
        </div>
      ) : guilds.length ? (
        <div className="ln-server-list">
          {guilds.map((g) => (
            <div key={g.guild_id} className="ln-server">
              <span className="ln-server-icon">{(g.guild_name || "?").slice(0, 1)}</span>
              <span className="ln-server-name">
                <b>{g.guild_name}</b>
                <small className={g.bot_present ? "ln-green" : "ln-muted"}>
                  {g.bot_present ? c.botIn : c.botOut}
                </small>
              </span>
              {g.bot_present ? (
                <button
                  type="button"
                  className="ln-btn ln-btn-gold ln-btn-sm"
                  onClick={() => onSelect(g)}
                >
                  {c.setUp} <ArrowRight width={14} height={14} />
                </button>
              ) : (
                <button type="button" className="ln-btn ln-btn-outline ln-btn-sm" onClick={invite}>
                  <LockKeyhole width={14} height={14} /> {c.invite}
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<Server width={22} height={22} />}
          title={c.noServers}
          body={c.noServersBody}
          action={
            <button type="button" className="ln-btn ln-btn-gold" onClick={invite}>
              <Bot width={16} height={16} /> {c.invite}
            </button>
          }
        />
      )}
    </>
  );
}

function SettingsPage({
  c,
  lang,
  setLang,
  session,
  signOut,
  connect,
}: {
  c: Copy;
  lang: Lang;
  setLang: (l: Lang) => void;
  session: string;
  signOut: () => void;
  connect: () => void;
}) {
  return (
    <>
      <PageHead kicker={c.stKicker} title={c.stTitle} />
      <div className="ln-settings">
        <div>
          <div>
            <h3>{c.stLang}</h3>
            <p>{c.stLangBody}</p>
          </div>
          <LangToggle lang={lang} setLang={setLang} />
        </div>
        <div>
          <div>
            <h3>{c.stSession}</h3>
            <p>{session ? c.stSessionIn : c.stSessionOut}</p>
          </div>
          {session ? (
            <button type="button" className="ln-btn ln-btn-outline ln-btn-sm" onClick={signOut}>
              <LogOut width={14} height={14} /> {c.signOut}
            </button>
          ) : (
            <button type="button" className="ln-btn ln-btn-gold ln-btn-sm" onClick={connect}>
              <LogIn width={14} height={14} /> {c.connect}
            </button>
          )}
        </div>
        <div>
          <div>
            <h3>{c.stPrice}</h3>
            <p>{c.stPriceBody}</p>
          </div>
        </div>
      </div>
    </>
  );
}
