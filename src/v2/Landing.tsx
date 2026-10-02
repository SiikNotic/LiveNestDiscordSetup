import { useEffect, useState } from "react";
import { ArrowRight, Check, ChevronDown, Hash, Minus, X } from "lucide-react";

import { INSTALLABLE, CATALOG, type CatalogTemplate, type Lang } from "./catalog";
import { DiscordRail, DiscordSidebar, Gallery } from "./ui";

const COPY = {
  en: {
    navTemplates: "Templates",
    navHow: "How it works",
    navFaq: "FAQ",
    openApp: "Open LiveNest",
    eyebrow: "Free Discord server builder",
    titleA: "Stop dragging channels",
    titleB: "around at 2 a.m.",
    body: "Pick a template, see exactly how your server will look, choose English, Spanish or both, and install it on a server you manage. LiveNest builds the categories, channels and roles for you.",
    cta: "Build my server",
    browse: "Browse templates",
    fine: ["Free, no paywalls", "Preview before installing", "English · Español · both"],
    botTitle: "Ready to install",
    botChannels: "channels",
    botRoles: "roles",
    botLang: "English + Español",
    botNote: "Nothing changes in Discord until you confirm.",
    stats: ["installable today", "templates designed", "channels mapped out", "price"],
    free: "Free",
    tplKicker: "Template library",
    tplTitle: "Start from a server that already works.",
    tplBody:
      "Open any template to see every category, channel and role. Six install today; the rest are designed and arrive as the installer grows.",
    tplBodyAll:
      "Open any template to see every category, channel and role, then install it in a couple of clicks.",
    howKicker: "How it works",
    howTitle: "Four steps, and you see everything first.",
    steps: [
      [
        "Pick a template",
        "Gaming, roleplay, streaming, anime, tech or study. Open the preview to see the full structure.",
      ],
      [
        "Choose the language",
        "English, Español, or bilingual names on every channel, category and role.",
      ],
      [
        "Choose your server",
        "Connect Discord and invite the LiveNest bot. Only servers you manage show up.",
      ],
      ["Review and install", "Check the summary, press install, and open your new server."],
    ],
    reviewTitle: "Review · your-server",
    review: [
      ["CREATE", "channels", "+ 12"],
      ["CREATE", "roles", "+ 6"],
      ["LANGUAGE", "names", "English + Español"],
      ["PRICE", "", "Free"],
    ],
    reviewFoot: "Nothing changes in Discord until you press install",
    langKicker: "Bilingual by design",
    langTitle: "One template, three ways to name it.",
    langBody:
      "Spanish-speaking community? Mixed server? Pick the naming mode in the builder and every channel, category and role follows it.",
    langModes: [
      ["English", "#welcome", "#announcements", "#looking-for-group"],
      ["Español", "#bienvenida", "#anuncios", "#buscar-grupo"],
      [
        "English + Español",
        "#welcome・bienvenida",
        "#announcements・anuncios",
        "#lfg・buscar-grupo",
      ],
    ],
    langNote:
      "Example names. The installer applies the mode you choose to the template's own channels.",
    cmpKicker: "Options",
    cmpTitle: "Three ways to set up a server.",
    cmpCols: ["LiveNest", "Discord templates", "Hiring someone"],
    cmpRows: [
      ["Works on a server you already have", true, false, true],
      ["Full preview before anything changes", true, "partial", "partial"],
      ["English, Spanish or bilingual names", true, false, "partial"],
      ["Price", "Free", "Free", "$15–110"],
      ["Ready in", "~2 min", "~2 min", "1–3 days"],
    ],
    cmpNote: "Hiring prices are typical setup gigs on freelance marketplaces.",
    faqTitle: "Questions people ask",
    faq: [
      [
        "Do I need to create a new server?",
        "No. Install into any server you manage once the LiveNest bot is in it. Discord's built-in templates only work when you create a brand-new server.",
      ],
      ["Is it really free?", "Yes. No subscriptions, no paywalls."],
      [
        "What does the bot need?",
        "Invite it with the Invite Bot button. It needs permission to manage channels and roles to build the structure.",
      ],
      [
        "Can I change things afterwards?",
        "Yes. Everything it creates is a normal Discord channel or role — rename, move or remove whatever you like.",
      ],
      [
        "Why are some templates “coming soon”?",
        "They're fully designed (you can open them), but the installer doesn't build them yet. The six marked “Installable now” work today.",
      ],
    ],
    finalTitle: "Your server, organised before your coffee gets cold.",
    finalBody: "Pick a template, preview it, install it. It's free.",
    footerNote: "Not affiliated with Discord Inc.",
  },
  es: {
    navTemplates: "Plantillas",
    navHow: "Cómo funciona",
    navFaq: "Preguntas",
    openApp: "Abrir LiveNest",
    eyebrow: "Creador de servidores de Discord gratis",
    titleA: "Deja de arrastrar canales",
    titleB: "a las 2 de la mañana.",
    body: "Elige una plantilla, mira exactamente cómo quedará tu servidor, elige inglés, español o los dos, e instálala en un servidor que administres. LiveNest crea las categorías, canales y roles por ti.",
    cta: "Crear mi servidor",
    browse: "Ver plantillas",
    fine: [
      "Gratis, sin muros de pago",
      "Vista previa antes de instalar",
      "English · Español · ambos",
    ],
    botTitle: "Listo para instalar",
    botChannels: "canales",
    botRoles: "roles",
    botLang: "English + Español",
    botNote: "Nada cambia en Discord hasta que confirmes.",
    stats: ["instalables hoy", "plantillas diseñadas", "canales diseñados", "precio"],
    free: "Gratis",
    tplKicker: "Biblioteca de plantillas",
    tplTitle: "Empieza con un servidor que ya funciona.",
    tplBody:
      "Abre cualquier plantilla para ver cada categoría, canal y rol. Seis se instalan hoy; el resto ya está diseñado y llegará cuando crezca el instalador.",
    tplBodyAll:
      "Abre cualquier plantilla para ver cada categoría, canal y rol, e instálala en un par de clics.",
    howKicker: "Cómo funciona",
    howTitle: "Cuatro pasos, y lo ves todo antes.",
    steps: [
      [
        "Elige una plantilla",
        "Gaming, roleplay, streaming, anime, tecnología o estudio. Abre la vista previa para ver la estructura completa.",
      ],
      ["Elige el idioma", "English, Español o nombres bilingües en cada canal, categoría y rol."],
      [
        "Elige tu servidor",
        "Conecta Discord e invita al bot de LiveNest. Solo aparecen los servidores que administras.",
      ],
      ["Revisa e instala", "Comprueba el resumen, pulsa instalar y abre tu servidor nuevo."],
    ],
    reviewTitle: "Revisión · tu-servidor",
    review: [
      ["CREAR", "canales", "+ 12"],
      ["CREAR", "roles", "+ 6"],
      ["IDIOMA", "nombres", "English + Español"],
      ["PRECIO", "", "Gratis"],
    ],
    reviewFoot: "Nada cambia en Discord hasta que pulsas instalar",
    langKicker: "Bilingüe de serie",
    langTitle: "Una plantilla, tres formas de nombrarla.",
    langBody:
      "¿Comunidad hispanohablante? ¿Servidor mixto? Elige el modo de nombres en el constructor y cada canal, categoría y rol lo sigue.",
    langModes: [
      ["English", "#welcome", "#announcements", "#looking-for-group"],
      ["Español", "#bienvenida", "#anuncios", "#buscar-grupo"],
      [
        "English + Español",
        "#welcome・bienvenida",
        "#announcements・anuncios",
        "#lfg・buscar-grupo",
      ],
    ],
    langNote:
      "Nombres de ejemplo. El instalador aplica el modo que elijas a los canales de la plantilla.",
    cmpKicker: "Opciones",
    cmpTitle: "Tres formas de montar un servidor.",
    cmpCols: ["LiveNest", "Plantillas de Discord", "Contratar a alguien"],
    cmpRows: [
      ["Funciona en un servidor que ya tienes", true, false, true],
      ["Vista previa completa antes de cambiar nada", true, "partial", "partial"],
      ["Nombres en inglés, español o bilingües", true, false, "partial"],
      ["Precio", "Gratis", "Gratis", "15–110 USD"],
      ["Listo en", "~2 min", "~2 min", "1–3 días"],
    ],
    cmpNote: "Los precios de contratar son encargos típicos en marketplaces freelance.",
    faqTitle: "Preguntas frecuentes",
    faq: [
      [
        "¿Tengo que crear un servidor nuevo?",
        "No. Instálala en cualquier servidor que administres cuando el bot de LiveNest esté dentro. Las plantillas nativas de Discord solo sirven al crear un servidor nuevo.",
      ],
      ["¿De verdad es gratis?", "Sí. Sin suscripciones ni muros de pago."],
      [
        "¿Qué necesita el bot?",
        "Invítalo con el botón Invitar bot. Necesita permiso para gestionar canales y roles para montar la estructura.",
      ],
      [
        "¿Puedo cambiar cosas después?",
        "Sí. Todo lo que crea son canales y roles normales de Discord: renombra, mueve o borra lo que quieras.",
      ],
      [
        "¿Por qué algunas plantillas dicen “Próximamente”?",
        "Están diseñadas por completo (puedes abrirlas), pero el instalador aún no las monta. Las seis marcadas como “Instalables ya” funcionan hoy.",
      ],
    ],
    finalTitle: "Tu servidor ordenado antes de que se enfríe el café.",
    finalBody: "Elige una plantilla, mírala e instálala. Es gratis.",
    footerNote: "Sin relación con Discord Inc.",
  },
} as const;

const HERO_NAMES: Record<string, string> = {
  "gaming-community": "Night Shift Gaming",
  "streamer-hub": "Lumi's Den",
  "fivem-roleplay": "Vice Harbor RP",
  "tech-ai": "Fieldnote HQ",
};
const HERO_IDS = Object.keys(HERO_NAMES);

export function Landing({
  lang,
  setLang,
  openApp,
  useTemplate,
}: {
  lang: Lang;
  setLang: (l: Lang) => void;
  openApp: () => void;
  useTemplate: (t: CatalogTemplate) => void;
}) {
  const c = COPY[lang];
  const allLive = INSTALLABLE.length === CATALOG.length;
  return (
    <div className="ln">
      <header className="ln-header">
        <div className="ln-wrap ln-header-row">
          <div className="ln-header-left">
            <a href="/" className="ln-logo">
              <LogoMark />
              <span>
                LiveNest <small>for Discord</small>
              </span>
            </a>
            <nav className="ln-nav">
              <a href="#templates">{c.navTemplates}</a>
              <a href="#how">{c.navHow}</a>
              <a href="#faq">{c.navFaq}</a>
            </nav>
          </div>
          <div className="ln-header-right">
            <button
              type="button"
              className="ln-btn ln-btn-gold ln-btn-sm ln-hide-sm"
              onClick={openApp}
            >
              {c.openApp}
            </button>
            <LangToggle lang={lang} setLang={setLang} />
          </div>
        </div>
      </header>

      <main>
        <Hero lang={lang} openApp={openApp} />
        <Stats lang={lang} />

        <section id="templates" className="ln-wrap ln-section">
          <div className="ln-split-head">
            <div>
              <p className="ln-kicker">{c.tplKicker}</p>
              <h2>{c.tplTitle}</h2>
            </div>
            <p className="ln-muted">{allLive ? c.tplBodyAll : c.tplBody}</p>
          </div>
          <Gallery lang={lang} onUse={useTemplate} />
        </section>

        <How lang={lang} />
        <Languages lang={lang} />
        <Compare lang={lang} />
        <Faq lang={lang} />

        <section className="ln-wrap">
          <div className="ln-final">
            <h2>{c.finalTitle}</h2>
            <p>{c.finalBody}</p>
            <button type="button" className="ln-btn ln-btn-dark" onClick={openApp}>
              {c.cta} <ArrowRight width={16} height={16} />
            </button>
            <svg
              viewBox="0 0 200 200"
              aria-hidden
              className="ln-final-mark"
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
      </main>

      <footer className="ln-footer">
        <div className="ln-wrap ln-footer-row">
          <span className="ln-footer-brand">
            <LogoMark size={22} /> LiveNest
          </span>
          <span className="ln-muted">{c.footerNote}</span>
        </div>
      </footer>
    </div>
  );
}

export function LogoMark({ size = 32 }: { size?: number }) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} aria-hidden>
      <rect width="32" height="32" rx="8" fill="#d9b545" />
      <path
        d="M16 6.5 24.2 11.25v9.5L16 25.5l-8.2-4.75v-9.5z"
        stroke="#16130B"
        strokeWidth="2"
        fill="none"
      />
      <path d="M16 12 19.5 14v4L16 20l-3.5-2v-4z" fill="#16130B" />
    </svg>
  );
}

export function LangToggle({ lang, setLang }: { lang: Lang; setLang: (l: Lang) => void }) {
  return (
    <div className="ln-lang">
      {(["en", "es"] as const).map((l) => (
        <button
          key={l}
          type="button"
          aria-pressed={lang === l}
          className={lang === l ? "is-on" : ""}
          onClick={() => setLang(l)}
        >
          {l}
        </button>
      ))}
    </div>
  );
}

function Hero({ lang, openApp }: { lang: Lang; openApp: () => void }) {
  const c = COPY[lang];
  const list = HERO_IDS.map((id) => INSTALLABLE.find((t) => t.id === id)).filter(
    (t): t is CatalogTemplate => Boolean(t),
  );
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused || list.length < 2) return;
    const id = window.setInterval(() => setI((n) => (n + 1) % list.length), 5200);
    return () => window.clearInterval(id);
  }, [paused, list.length]);
  const t = list[i] ?? INSTALLABLE[0]!;
  const first = t.categories[0]?.channels[0]?.name ?? "welcome";

  return (
    <section className="ln-wrap ln-hero">
      <div>
        <p className="ln-kicker">{c.eyebrow}</p>
        <h1>
          {c.titleA}
          <br />
          <span>{c.titleB}</span>
        </h1>
        <p className="ln-hero-body">{c.body}</p>
        <div className="ln-hero-cta">
          <button type="button" className="ln-btn ln-btn-gold ln-btn-lg" onClick={openApp}>
            {c.cta} <ArrowRight width={16} height={16} />
          </button>
          <a href="#templates" className="ln-btn ln-btn-ghost ln-btn-lg">
            {c.browse}
          </a>
        </div>
        <ul className="ln-fine">
          {c.fine.map((f) => (
            <li key={f}>
              <Check width={16} height={16} /> {f}
            </li>
          ))}
        </ul>
      </div>

      <div
        className="ln-hero-visual"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div className="ln-tabs">
          {list.map((x, n) => (
            <button
              key={x.id}
              type="button"
              className={n === i ? "is-on" : ""}
              onClick={() => setI(n)}
            >
              {x.name}
            </button>
          ))}
        </div>
        <div className="ln-dc-window">
          <DiscordRail accent={t.accent} />
          <DiscordSidebar key={t.id} t={t} serverName={HERO_NAMES[t.id]} animate />
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
                    <span>{lang === "es" ? "hoy" : "today"}</span>
                  </div>
                  <div className="ln-dc-embed" style={{ borderColor: t.accent }}>
                    <b>
                      {c.botTitle} · {t.name}
                    </b>
                    <ul>
                      <li>
                        <span className="ln-green">+{t.channels}</span> {c.botChannels}
                      </li>
                      <li>
                        <span className="ln-blurple">+{t.roleCount}</span> {c.botRoles}
                      </li>
                      <li>
                        <span>🌎</span> {c.botLang}
                      </li>
                    </ul>
                    <p>{c.botNote}</p>
                  </div>
                </div>
              </div>
              <div className="ln-dc-input">
                {lang === "es" ? "Enviar mensaje a" : "Message"} #{first}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stats({ lang }: { lang: Lang }) {
  const c = COPY[lang];
  const channels = CATALOG.reduce((n, t) => n + t.channels, 0);
  const values = [INSTALLABLE.length, CATALOG.length, channels.toLocaleString(lang), c.free];
  return (
    <section className="ln-stats">
      <dl className="ln-wrap">
        {values.map((v, n) => (
          <div key={c.stats[n]}>
            <dt>{v}</dt>
            <dd>{c.stats[n]}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function How({ lang }: { lang: Lang }) {
  const c = COPY[lang];
  return (
    <section id="how" className="ln-band">
      <div className="ln-wrap ln-section ln-two">
        <div>
          <p className="ln-kicker">{c.howKicker}</p>
          <h2>{c.howTitle}</h2>
          <ol className="ln-steps">
            {c.steps.map(([title, body], n) => (
              <li key={title}>
                <span>0{n + 1}</span>
                <div>
                  <h3>{title}</h3>
                  <p>{body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <div className="ln-terminal">
          <div className="ln-terminal-head">
            <i />
            <i />
            <i />
            <span>{c.reviewTitle}</span>
          </div>
          <ul>
            {c.review.map(([a, k, v]) => (
              <li key={a + k}>
                <span className="ln-gold">{a}</span>
                <span className="ln-muted">{k}</span>
                <span>{v}</span>
              </li>
            ))}
          </ul>
          <div className="ln-terminal-foot">{c.reviewFoot}</div>
        </div>
      </div>
    </section>
  );
}

function Languages({ lang }: { lang: Lang }) {
  const c = COPY[lang];
  return (
    <section className="ln-wrap ln-section">
      <div className="ln-split-head">
        <div>
          <p className="ln-kicker">{c.langKicker}</p>
          <h2>{c.langTitle}</h2>
        </div>
        <p className="ln-muted">{c.langBody}</p>
      </div>
      <div className="ln-lang-modes">
        {c.langModes.map(([title, ...names]) => (
          <div key={title}>
            <h3>{title}</h3>
            {names.map((n) => (
              <div key={n} className="ln-card-ch">
                <Hash width={14} height={14} className="ln-ch-icon" />
                <span>{n.replace(/^#/, "")}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
      <p className="ln-note">{c.langNote}</p>
    </section>
  );
}

function Cell({ v, strong }: { v: boolean | string; strong?: boolean }) {
  if (v === true) return <Check width={20} height={20} className={strong ? "ln-gold" : ""} />;
  if (v === false) return <X width={20} height={20} className="ln-dim" />;
  if (v === "partial") return <Minus width={20} height={20} className="ln-muted" />;
  return <span className={strong ? "ln-mono ln-gold" : "ln-mono"}>{v}</span>;
}

function Compare({ lang }: { lang: Lang }) {
  const c = COPY[lang];
  return (
    <section className="ln-wrap ln-section">
      <p className="ln-kicker">{c.cmpKicker}</p>
      <h2>{c.cmpTitle}</h2>
      <div className="ln-table-wrap">
        <table className="ln-table">
          <thead>
            <tr>
              <th />
              {c.cmpCols.map((col, n) => (
                <th key={col} className={n === 0 ? "is-us" : ""}>
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {c.cmpRows.map(([label, ...cells]) => (
              <tr key={String(label)}>
                <td>{label}</td>
                {cells.map((v, n) => (
                  <td key={n} className={n === 0 ? "is-us" : ""}>
                    <Cell v={v} strong={n === 0} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="ln-note">{c.cmpNote}</p>
    </section>
  );
}

function Faq({ lang }: { lang: Lang }) {
  const c = COPY[lang];
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="ln-wrap ln-section ln-faq">
      <h2>{c.faqTitle}</h2>
      <div>
        {(INSTALLABLE.length === CATALOG.length ? c.faq.slice(0, -1) : c.faq).map(([q, a], n) => (
          <div key={q} className={open === n ? "ln-faq-item is-open" : "ln-faq-item"}>
            <button
              type="button"
              aria-expanded={open === n}
              onClick={() => setOpen(open === n ? null : n)}
            >
              <span>{q}</span>
              <ChevronDown width={18} height={18} />
            </button>
            {open === n && <p>{a}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}
