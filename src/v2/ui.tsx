import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import {
  ArrowRight,
  ChevronDown,
  Eye,
  Hash,
  Lock,
  Megaphone,
  MessagesSquare,
  Volume2,
  X,
} from "lucide-react";

import type { ChannelKind } from "../lib/livenest-blueprint";
import { CATALOG, CATEGORIES, CATEGORY_ES, type CatalogTemplate, type Lang } from "./catalog";

const ICONS = { text: Hash, voice: Volume2, forum: MessagesSquare, announcement: Megaphone };

export function ChannelIcon({ kind, size = 18 }: { kind: ChannelKind; size?: number }) {
  const Icon = ICONS[kind];
  return <Icon className="ln-ch-icon" width={size} height={size} />;
}

export const UI = {
  en: {
    all: "All",
    installable: "Installable now",
    soon: "Coming soon",
    newBadge: "New",
    showAll: (n: number) => `Show all ${n} templates`,
    showLess: "Show fewer",
    cats: "categories",
    chans: "channels",
    roles: "Roles",
    use: "Use this template",
    close: "Keep browsing",
    soonNote:
      "This template is designed and ready. It becomes installable as soon as the LiveNest installer is updated — the six marked “Installable now” work today.",
    kindLabels: { text: "Text", announcement: "Announcement", forum: "Forum", voice: "Voice" },
    message: "Message",
    today: "today",
  },
  es: {
    all: "Todas",
    installable: "Instalables ya",
    soon: "Próximamente",
    newBadge: "Nueva",
    showAll: (n: number) => `Ver las ${n} plantillas`,
    showLess: "Ver menos",
    cats: "categorías",
    chans: "canales",
    roles: "Roles",
    use: "Usar esta plantilla",
    close: "Seguir mirando",
    soonNote:
      "Esta plantilla está diseñada y lista. Se podrá instalar en cuanto se actualice el instalador de LiveNest; las seis marcadas como “Instalables ya” funcionan hoy.",
    kindLabels: { text: "Texto", announcement: "Anuncios", forum: "Foro", voice: "Voz" },
    message: "Enviar mensaje a",
    today: "hoy",
  },
} as const;

/** Discord's channel sidebar, rendered from template data. */
export function DiscordSidebar({
  t,
  serverName,
  maxCategories = 8,
  maxChannels = 6,
  animate,
  scroll,
}: {
  t: CatalogTemplate;
  serverName?: string;
  maxCategories?: number;
  maxChannels?: number;
  animate?: boolean;
  scroll?: boolean;
}) {
  let row = 0;
  const delay = (): CSSProperties | undefined =>
    animate ? { animationDelay: `${row++ * 45}ms` } : undefined;
  return (
    <div className="ln-dc-sidebar">
      <div
        className="ln-dc-banner"
        style={{ background: `linear-gradient(135deg, ${t.accent}, ${t.secondary})` }}
      >
        <span>{serverName ?? t.name}</span>
        <ChevronDown width={16} height={16} />
      </div>
      <div className={scroll ? "ln-dc-list ln-scroll" : "ln-dc-list"}>
        {t.categories.slice(0, maxCategories).map((cat, ci) => (
          <div key={cat.name} className="ln-dc-cat">
            <div
              className={animate ? "ln-dc-cat-name ln-row-in" : "ln-dc-cat-name"}
              style={delay()}
            >
              <ChevronDown width={12} height={12} />
              <span>{cat.name}</span>
            </div>
            {cat.channels.slice(0, maxChannels).map((ch, i) => (
              <div
                key={`${t.id}-${cat.name}-${ch.name}`}
                className={[
                  "ln-dc-ch",
                  ci === 0 && i === 0 ? "is-active" : "",
                  animate ? "ln-row-in" : "",
                ].join(" ")}
                style={delay()}
              >
                <ChannelIcon kind={ch.kind} />
                <span>{ch.name}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function DiscordRail({ accent }: { accent: string }) {
  return (
    <div className="ln-dc-rail">
      <div className="ln-dc-home">
        <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" aria-hidden>
          <path d="M19.27 5.33A16.5 16.5 0 0 0 15 4a11 11 0 0 0-.6 1.12 15.3 15.3 0 0 0-4.8 0A11 11 0 0 0 9 4a16.4 16.4 0 0 0-4.27 1.33C2 9.4 1.27 13.36 1.64 17.28A16.6 16.6 0 0 0 6.88 20a12.6 12.6 0 0 0 1.07-1.74 10.7 10.7 0 0 1-1.69-.8l.4-.32a11.8 11.8 0 0 0 10.68 0l.41.32c-.54.32-1.1.59-1.7.81.31.61.67 1.19 1.07 1.73a16.5 16.5 0 0 0 5.24-2.72c.44-4.53-.73-8.46-3.09-11.95zM8.52 14.91c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12 1.9.96 1.89 2.12c0 1.17-.84 2.12-1.89 2.12zm6.97 0c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12 1.9.96 1.89 2.12c0 1.17-.83 2.12-1.89 2.12z" />
        </svg>
      </div>
      <i className="ln-dc-sep" />
      <div className="ln-dc-server" style={{ background: accent }}>
        LN
      </div>
      <i className="ln-dc-blank" />
      <i className="ln-dc-blank" />
      <i className="ln-dc-blank" />
    </div>
  );
}

export function TemplateCard({
  t,
  lang,
  onOpen,
}: {
  t: CatalogTemplate;
  lang: Lang;
  onOpen: (t: CatalogTemplate) => void;
}) {
  const c = UI[lang];
  const preview = t.categories.slice(1, 3);
  return (
    <button type="button" className="ln-card" onClick={() => onOpen(t)}>
      <div className="ln-card-art">
        <i
          className="ln-card-bar"
          style={{ background: `linear-gradient(90deg, ${t.accent}, ${t.secondary})` }}
        />
        <span
          className={t.installable ? "ln-badge is-live" : t.isNew ? "ln-badge is-new" : "ln-badge"}
        >
          {t.installable ? c.installable : t.isNew ? c.newBadge : c.soon}
        </span>
        <div className="ln-card-list">
          {preview.map((cat) => (
            <div key={cat.name}>
              <b>{cat.name}</b>
              {cat.channels.slice(0, 3).map((ch) => (
                <div key={ch.name} className="ln-card-ch">
                  <ChannelIcon kind={ch.kind} size={14} />
                  <span>{ch.name}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="ln-card-body">
        <div className="ln-card-head">
          <h3>{t.name}</h3>
          <Eye width={16} height={16} />
        </div>
        <p>{lang === "es" ? t.descEs : t.desc}</p>
        <footer>
          <span>
            {t.categories.length} {c.cats}
          </span>
          <span>
            {t.channels} {c.chans}
          </span>
          <span>
            {t.roleCount} {c.roles.toLowerCase()}
          </span>
        </footer>
      </div>
    </button>
  );
}

export function TemplateDialog({
  t,
  lang,
  onClose,
  onUse,
}: {
  t: CatalogTemplate | null;
  lang: Lang;
  onClose: () => void;
  onUse: (t: CatalogTemplate) => void;
}) {
  const c = UI[lang];
  const closeRef = useRef<HTMLButtonElement>(null);
  const kinds = useMemo(() => {
    const k = { text: 0, voice: 0, forum: 0, announcement: 0 };
    for (const cat of t?.categories ?? []) for (const ch of cat.channels) k[ch.kind] += 1;
    return k;
  }, [t]);

  // Keep the latest onClose without re-running the effect (which would steal focus on every render).
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!t) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onCloseRef.current();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [t]);

  if (!t) return null;
  return (
    <div
      className="ln-modal"
      role="presentation"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="ln-dialog" role="dialog" aria-modal="true" aria-labelledby="ln-dialog-title">
        <div className="ln-dialog-side">
          <DiscordSidebar t={t} maxCategories={30} maxChannels={30} scroll />
        </div>
        <div className="ln-dialog-main">
          <button
            ref={closeRef}
            type="button"
            className="ln-dialog-x"
            onClick={onClose}
            aria-label={c.close}
          >
            <X width={18} height={18} />
          </button>
          <p className="ln-kicker" style={{ color: t.accent }}>
            {t.tagline}
          </p>
          <h2 id="ln-dialog-title">{t.name}</h2>
          <p className="ln-dialog-desc">{lang === "es" ? t.descEs : t.desc}</p>

          <dl className="ln-kinds">
            {(["text", "announcement", "forum", "voice"] as const).map((k) => (
              <div key={k}>
                <dt>
                  <ChannelIcon kind={k} size={14} /> {c.kindLabels[k]}
                </dt>
                <dd>{kinds[k]}</dd>
              </div>
            ))}
          </dl>

          <h4>{c.roles}</h4>
          <div className="ln-roles">
            {t.roles.map((r) => (
              <span key={r.name}>
                <i style={{ background: r.color }} />
                {r.name}
              </span>
            ))}
          </div>

          <div className="ln-dialog-mobile-cats">
            <h4>{c.cats}</h4>
            <ul>
              {t.categories.map((cat) => (
                <li key={cat.name}>
                  <b>{cat.name}</b> · {cat.channels.length} {c.chans}
                </li>
              ))}
            </ul>
          </div>

          {!t.installable && (
            <p className="ln-soon-note">
              <Lock width={14} height={14} /> {c.soonNote}
            </p>
          )}

          <div className="ln-dialog-actions">
            <button
              type="button"
              className="ln-btn ln-btn-gold"
              disabled={!t.installable}
              onClick={() => onUse(t)}
            >
              {t.installable ? c.use : c.soon}{" "}
              {t.installable && <ArrowRight width={16} height={16} />}
            </button>
            <button type="button" className="ln-btn ln-btn-ghost" onClick={onClose}>
              {c.close}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const INITIAL_VISIBLE = 9;

/** Filterable template grid with a preview dialog; used by the landing page and the Templates page. */
export function Gallery({ lang, onUse }: { lang: Lang; onUse: (t: CatalogTemplate) => void }) {
  const c = UI[lang];
  const [filter, setFilter] = useState<string>("all");
  const [expanded, setExpanded] = useState(false);
  const [open, setOpen] = useState<CatalogTemplate | null>(null);

  const counts = useMemo(() => {
    const m = new Map<string, number>();
    for (const t of CATALOG) m.set(t.category, (m.get(t.category) ?? 0) + 1);
    return m;
  }, []);
  const list = CATALOG.filter((t) =>
    filter === "all" ? true : filter === "installable" ? t.installable : t.category === filter,
  );
  const visible = expanded ? list : list.slice(0, INITIAL_VISIBLE);
  const chips = ["all", "installable", ...CATEGORIES];

  return (
    <>
      <div className="ln-chips">
        {chips.map((k) => (
          <button
            key={k}
            type="button"
            className={filter === k ? "is-on" : ""}
            onClick={() => {
              setFilter(k);
              setExpanded(false);
            }}
          >
            {k === "all"
              ? c.all
              : k === "installable"
                ? c.installable
                : lang === "es"
                  ? (CATEGORY_ES[k] ?? k)
                  : k}
            <small>
              {k === "all"
                ? CATALOG.length
                : k === "installable"
                  ? CATALOG.filter((t) => t.installable).length
                  : counts.get(k)}
            </small>
          </button>
        ))}
      </div>
      <div className="ln-grid">
        {visible.map((t) => (
          <TemplateCard key={t.id} t={t} lang={lang} onOpen={setOpen} />
        ))}
      </div>
      {list.length > INITIAL_VISIBLE && (
        <div className="ln-center">
          <button
            type="button"
            className="ln-btn ln-btn-outline"
            onClick={() => setExpanded((v) => !v)}
          >
            {expanded ? c.showLess : c.showAll(list.length)}
          </button>
        </div>
      )}
      <TemplateDialog
        t={open}
        lang={lang}
        onClose={() => setOpen(null)}
        onUse={(t) => {
          setOpen(null);
          onUse(t);
        }}
      />
    </>
  );
}
