import { createFileRoute } from "@tanstack/react-router";

import { getCreds } from "@/lib/discord.server";

export const Route = createFileRoute("/api/public/discord/login")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const creds = getCreds();
        if (!creds) {
          return new Response("Discord app is not configured", { status: 503 });
        }
        const origin = new URL(request.url).origin;
        const params = new URLSearchParams({
          client_id: creds.clientId,
          response_type: "code",
          scope: "identify guilds",
          prompt: "consent",
          redirect_uri: `${origin}/api/public/discord/callback`,
        });
        return new Response(null, {
          status: 302,
          headers: { Location: `https://discord.com/oauth2/authorize?${params}` },
        });
      },
    },
  },
});