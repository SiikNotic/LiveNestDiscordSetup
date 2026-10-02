import { ChevronDown, Hash, Volume2 } from "lucide-react";

import type { ServerTemplate } from "@/lib/server-templates";
import { cn } from "@/lib/utils";

/**
 * A static recreation of Discord's server sidebar, fed by real template data.
 * Colours follow Discord's own dark theme so the preview reads as "Discord", not as a mockup.
 */
export function DiscordSidebar({
  template,
  serverName,
  maxCategories = 6,
  maxChannels = 4,
  animate = false,
  className,
}: {
  template: ServerTemplate;
  serverName: string;
  maxCategories?: number;
  maxChannels?: number;
  animate?: boolean;
  className?: string;
}) {
  let row = 0;
  const delay = () => (animate ? { animationDelay: `${row++ * 45}ms` } : undefined);

  return (
    <div className={cn("flex min-h-0 flex-col bg-[#2B2D31] text-[#949BA4]", className)}>
      <div
        className="relative h-[72px] shrink-0"
        style={{
          background: `linear-gradient(135deg, ${template.theme.accent}, ${template.theme.secondary})`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#2B2D31]/70" />
        <div className="absolute inset-x-0 top-0 flex items-center justify-between px-4 py-3 text-[15px] font-semibold text-white drop-shadow">
          <span className="truncate">{serverName}</span>
          <ChevronDown className="size-4" />
        </div>
      </div>

      <div className="mask-fade-b min-h-0 flex-1 overflow-hidden px-2 pb-6 pt-2">
        {template.categories.slice(0, maxCategories).map((cat) => (
          <div key={cat.name} className="mt-3 first:mt-1">
            <div
              key={`${template.id}-${cat.name}`}
              style={delay()}
              className={cn(
                "flex items-center gap-0.5 px-1 text-[11px] font-semibold uppercase tracking-wide text-[#949BA4]",
                animate && "animate-row-in",
              )}
            >
              <ChevronDown className="size-3" />
              <span className="truncate">{cat.name}</span>
            </div>
            {cat.channels.slice(0, maxChannels).map((ch, i) => (
              <div
                key={`${template.id}-${cat.name}-${ch.name}`}
                style={delay()}
                className={cn(
                  "mt-px flex items-center gap-1.5 rounded px-2 py-[5px] text-[14px]",
                  i === 0 && cat === template.categories[0]
                    ? "bg-[#404249] text-white"
                    : "hover:bg-[#35373C] hover:text-[#DBDEE1]",
                  animate && "animate-row-in",
                )}
              >
                {ch.kind === "voice" ? (
                  <Volume2 className="size-[18px] shrink-0 opacity-70" />
                ) : (
                  <Hash className="size-[18px] shrink-0 opacity-70" />
                )}
                <span className="truncate">{ch.name}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/** Narrow server rail on the far left of the Discord client. */
export function DiscordRail({ accent }: { accent: string }) {
  return (
    <div className="flex w-[64px] shrink-0 flex-col items-center gap-2 bg-[#1E1F22] py-3">
      <div className="flex size-12 items-center justify-center rounded-2xl bg-[#5865F2] text-white">
        <svg viewBox="0 0 24 24" className="size-6" fill="currentColor" aria-hidden>
          <path d="M19.27 5.33C17.94 4.71 16.5 4.26 15 4a.09.09 0 0 0-.07.03c-.18.33-.39.76-.53 1.09a16.09 16.09 0 0 0-4.8 0c-.14-.34-.35-.76-.54-1.09-.01-.02-.04-.03-.07-.03-1.5.26-2.93.71-4.27 1.33-.01 0-.02.01-.03.02-2.72 4.07-3.47 8.03-3.1 11.95 0 .02.01.04.03.05 1.8 1.32 3.53 2.12 5.24 2.65.03.01.06 0 .07-.02.4-.55.76-1.13 1.07-1.74.02-.04 0-.08-.04-.09-.57-.22-1.11-.48-1.64-.78-.04-.02-.04-.08-.01-.11.11-.08.22-.17.33-.25.02-.02.05-.02.07-.01 3.44 1.57 7.15 1.57 10.55 0 .02-.01.05-.01.07.01.11.09.22.17.33.26.04.03.04.09-.01.11-.52.31-1.07.56-1.64.78-.04.01-.05.06-.04.09.32.61.68 1.19 1.07 1.74.03.01.06.02.09.01 1.72-.53 3.45-1.33 5.25-2.65.02-.01.03-.03.03-.05.44-4.53-.73-8.46-3.1-11.95-.01-.01-.02-.02-.04-.02zM8.52 14.91c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12 0 1.17-.84 2.12-1.89 2.12zm6.97 0c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12 0 1.17-.83 2.12-1.89 2.12z" />
        </svg>
      </div>
      <div className="h-0.5 w-8 rounded-full bg-[#35363C]" />
      <div className="relative">
        <span className="absolute -left-3 top-1/2 h-10 w-1 -translate-y-1/2 rounded-r-full bg-white" />
        <div
          className="flex size-12 items-center justify-center rounded-2xl font-display text-sm font-bold text-black"
          style={{ background: accent }}
        >
          LN
        </div>
      </div>
      {["#3BA55C", "#ED4245", "#FAA61A"].map((c) => (
        <div
          key={c}
          className="size-12 rounded-full bg-[#313338]"
          style={{ boxShadow: `inset 0 0 0 2px ${c}22` }}
        />
      ))}
    </div>
  );
}
