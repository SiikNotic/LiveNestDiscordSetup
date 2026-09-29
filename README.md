# LiveNest Discord Setup

One-click, non-destructive Discord server configurator for the LiveNest community.

## Features
- Discord OAuth2 login
- Lists servers the signed-in user can manage
- Dry-run audit before changes
- Idempotent role/category/channel configuration
- Least-privilege permissions
- Bilingual English/Spanish interface
- Does not automatically delete existing Discord resources

## Environment
Set these as server-side secrets:

DISCORD_CLIENT_ID=
DISCORD_CLIENT_SECRET=
DISCORD_BOT_TOKEN=
DISCORD_REDIRECT_URI=

Never commit real credentials.

## Development

```bash
bun install
bun run dev
```

The app is based on the LiveNest Discord Setup project built in Lovable and migrated to this repository.
