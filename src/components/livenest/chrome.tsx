import { Link } from "@tanstack/react-router";
import { Hexagon } from "lucide-react";

import { useLang } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function LanguageToggle() {
  const { lang, setLang } = useLang();
  return (
    <div className="inline-flex items-center rounded-full border border-border bg-surface-2 p-0.5 text-xs font-medium">
      {(["en", "es"] as const).map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLang(l)}
          className={cn(
            "rounded-full px-3 py-1 uppercase tracking-wide transition-colors",
            lang === l
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {l}
        </button>
      ))}
    </div>
  );
}

export function Header({ right }: { right?: React.ReactNode }) {
  return (
    <header className="sticky top-0 z-30 border-b border-border/70 bg-background/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="flex size-8 items-center justify-center rounded-lg border border-primary/40 bg-surface-2">
            <Hexagon className="size-4 text-primary" strokeWidth={2.2} />
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-display text-sm font-semibold tracking-tight">
              Live<span className="text-metal">Nest</span>
            </span>
            <span className="mt-0.5 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Discord Setup
            </span>
          </span>
        </Link>
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
    <footer className="mt-20 border-t border-border/70 py-8">
      <div className="mx-auto max-w-6xl px-4 text-xs text-muted-foreground sm:px-6">
        LiveNest · {t("safetyBody")}
      </div>
    </footer>
  );
}