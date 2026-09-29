import { createFileRoute } from "@tanstack/react-router";

import { exchangeCode, sessionCookie } from "@/lib/discord.server";

const DISCORD_REDIRECT_URI = "https://livenestdiscordsetup.onrender.com/api/public/discord/callback";

export const Route = createFileRoute("/api/public/discord/callback")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const code = url.searchParams.get("code");
        if (!code) {
          return new Response(null, {
            status: 302,
            headers: { Location: "/setup?error=denied" },
          });
        }
        try {
          const token = await exchangeCode(code, DISCORD_REDIRECT_URI);
          const headers = new Headers({ Location: "/setup" });
          headers.append(
            "Set-Cookie",
            sessionCookie(
              token.access_token,
              Math.min(token.expires_in ?? 3600, 604800),
              url.protocol === "https:",
            ),
          );
          return new Response(null, { status: 302, headers });
        } catch (error) {
          console.error("Discord OAuth callback failed", error);
          return new Response(null, {
            status: 302,
            headers: { Location: "/setup?error=oauth" },
          });
        }
      },
    },
  },
});