import { createFileRoute } from "@tanstack/react-router";

import { getCreds } from "@/lib/discord.server";

const DISCORD_REDIRECT_URI = "https://livenestdiscordsetup.onrender.com/api/public/discord/callback";

export const Route = createFileRoute("/api/public/discord/login")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const creds = getCreds();
        if (!creds) {
          return new Response("Discord app is not configured", { status: 503 });
        }
        const params = new URLSearchParams({
          client_id: creds.clientId,
          response_type: "code",
          scope: "identify guilds",
          prompt: "consent",
          redirect_uri: DISCORD_REDIRECT_URI,
        });
        return new Response(null, {
          status: 302,
          headers: { Location: `https://discord.com/oauth2/authorize?${params}` },
        });
      },
    },
  },
});