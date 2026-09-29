/**
 * Server-only Discord REST layer. Secrets are read here and never returned
 * to the client. Includes rate-limit aware retries.
 */
const API = "https://discord.com/api/v10";

export type Creds = {
  clientId: string;
  clientSecret: string;
  botToken: string;
};

export function getCreds(): Creds | null {
  const clientId = process.env["DISCORD_CLIENT_ID"];
  const clientSecret = process.env["DISCORD_CLIENT_SECRET"];
  const botToken = process.env["DISCORD_BOT_TOKEN"];
  if (!clientId || !clientSecret || !botToken) return null;
  return { clientId, clientSecret, botToken };
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function discordFetch(
  path: string,
  init: RequestInit & { auth: string },
  attempt = 0,
): Promise<Response> {
  const { auth, ...rest } = init;
  const headers = new Headers(rest.headers);
  headers.set("Authorization", auth);
  if (rest.body && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");

  const res = await fetch(`${API}${path}`, { ...rest, headers });

  if (res.status === 429 && attempt < 5) {
    let waitMs = 1000;
    try {
      const body = (await res.clone().json()) as { retry_after?: number };
      if (typeof body.retry_after === "number") waitMs = Math.ceil(body.retry_after * 1000);
    } catch {
      /* fall back to default wait */
    }
    await sleep(Math.min(waitMs + 250, 15000));
    return discordFetch(path, init, attempt + 1);
  }

  if (res.status >= 500 && attempt < 3) {
    await sleep(500 * 2 ** attempt);
    return discordFetch(path, init, attempt + 1);
  }

  return res;
}

export async function botRequest<T>(
  path: string,
  init: Omit<RequestInit, "headers"> & { headers?: HeadersInit } = {},
): Promise<T> {
  const creds = getCreds();
  if (!creds) throw new Error("Discord app is not configured");
  const res = await discordFetch(path, { ...init, auth: `Bot ${creds.botToken}` });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Discord ${init.method ?? "GET"} ${path} failed [${res.status}]: ${text}`);
  }
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export async function userRequest<T>(token: string, path: string): Promise<T> {
  const res = await discordFetch(path, { auth: `Bearer ${token}` });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Discord GET ${path} failed [${res.status}]: ${text}`);
  }
  return (await res.json()) as T;
}

export async function exchangeCode(code: string, redirectUri: string) {
  const creds = getCreds();
  if (!creds) throw new Error("Discord app is not configured");
  const body = new URLSearchParams({
    client_id: creds.clientId,
    client_secret: creds.clientSecret,
    grant_type: "authorization_code",
    code,
    redirect_uri: redirectUri,
  });
  const res = await fetch(`${API}/oauth2/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  if (!res.ok) throw new Error(`Token exchange failed [${res.status}]: ${await res.text()}`);
  return (await res.json()) as { access_token: string; expires_in: number };
}

export const SESSION_COOKIE = "ln_discord_session";

export function parseCookies(header: string | null): Record<string, string> {
  const out: Record<string, string> = {};
  if (!header) return out;
  for (const part of header.split(";")) {
    const idx = part.indexOf("=");
    if (idx === -1) continue;
    out[part.slice(0, idx).trim()] = decodeURIComponent(part.slice(idx + 1).trim());
  }
  return out;
}

export function sessionCookie(token: string, maxAge: number, secure: boolean) {
  return `${SESSION_COOKIE}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${
    secure ? "; Secure" : ""
  }`;
}

export function clearedCookie(secure: boolean) {
  return `${SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${secure ? "; Secure" : ""}`;
}