import { Link } from "@tanstack/react-router";

import { useLang } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function LanguageToggle() {
  const { lang, setLang } = useLang();
  return (
    <div className="inline-flex items-center rounded-full border border-border p-0.5 font-mono text-[11px]">
      {(["en", "es"] as const).map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLang(l)}
          aria-pressed={lang === l}
          className={cn(
            "rounded-full px-2.5 py-1 uppercase transition-colors",
            lang === l
              ? "bg-foreground text-background"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {l}
        </button>
      ))}
    </div>
  );
}

/** Nested hexagons — a nest, drawn with the same geometry as the footer mark. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="none" aria-hidden>
      <rect width="32" height="32" rx="8" className="fill-primary" />
      <path d="M16 6.5 24.2 11.25v9.5L16 25.5l-8.2-4.75v-9.5z" stroke="#16130B" strokeWidth="2" />
      <path d="M16 12 19.5 14v4L16 20l-3.5-2v-4z" fill="#16130B" />
    </svg>
  );
}

export function Header({ right, nav }: { right?: React.ReactNode; nav?: React.ReactNode }) {
  return (
    <header className="sticky top-0 z-30 border-b border-border/70 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <div className="flex items-center gap-10">
          <Link to="/" className="flex items-center gap-2.5">
            <LogoMark className="size-8" />
            <span className="font-display text-[17px] font-semibold tracking-tight">
              LiveNest
              <span className="ml-1.5 font-sans text-sm font-normal text-muted-foreground">
                for Discord
              </span>
            </span>
          </Link>
          {nav}
        </div>
        <div className="flex items-center gap-2">
          {right}
          <LanguageToggle />
        </div>
      </div>
    </header>
  );
}

export function Footer() {
  const { t } = useLang();
  return (
    <footer className="mt-24 border-t border-border/70">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-10 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-center gap-2.5">
          <LogoMark className="size-6" />
          <span>LiveNest · {t("safetyBody")}</span>
        </div>
        <div className="flex gap-5">
          <a href="/#templates" className="hover:text-foreground">
            Templates
          </a>
          <Link to="/setup" className="hover:text-foreground">
            Setup
          </Link>
          <span className="opacity-60">Not affiliated with Discord Inc.</span>
        </div>
      </div>
    </footer>
  );
}
