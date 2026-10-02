# Supabase: catálogo de plantillas e instalador

La web usa el proyecto de Supabase `zxpentlarsbdilmyfxfc` (livenest-discord-setup).
El instalador es la Edge Function `discord-server`, que:

- lista las plantillas con `?action=templates` (tabla `public.template_catalog`, filas con `enabled = true`);
- instala una plantilla con `?action=install`, a partir de su `definition`.

La web marca como instalable cualquier plantilla que devuelva `action=templates`, y
construye la vista previa de las 6 originales a partir de su `definition`.

## Archivos

| Archivo | Qué es |
| --- | --- |
| `functions/discord-server/index.ts` | Función desplegada (v14). |
| `functions/discord-server/backup/index.v13.ts` | Versión anterior, para volver atrás. |
| `template_catalog_seed.sql` / `.json` | Las 50 plantillas añadidas al catálogo. |
| `generate-templates-sql.ts` | Genera el seed desde `src/lib/server-templates.ts`. |

## Formato de `definition`

```jsonc
{
  "roles":      [{ "key": "moderator", "en": "Moderator", "es": "Moderador", "both": "…", "color": 5793266 }],
  "categories": [{ "key": "c6", "en": "🛡️︱STAFF", "es": "🛡️︱STAFF", "private": ["owner", "moderator"] }],
  "channels":   [{ "key": "c1-1-welcome", "category": "c1", "type": 0, "en": "👋︱welcome",
                   "es": "👋︱bienvenida", "both": "👋︱welcome・bienvenida",
                   "topic": "…", "readOnly": true }],
  "staff": ["owner", "administrator", "moderator", "support"]
}
```

- `type`: 0 texto, 2 voz, 5 anuncios, 15 foro. Los anuncios y los foros solo se crean
  así en servidores con Comunidad activada; en los demás se crean como texto.
- `private`: solo esos roles (y el bot) ven la categoría.
- `readOnly`: @everyone no puede escribir; los roles de `staff` sí.
- `both`: nombre bilingüe opcional. Si falta, se usa `en・es`.
- Todos estos campos son opcionales: las 6 plantillas originales no los usan y se
  instalan igual que con la v13.

## Añadir o cambiar plantillas

1. Edita `src/lib/server-templates.ts`.
2. Ejecuta `npx tsx supabase/generate-templates-sql.ts`.
3. Pega `template_catalog_seed.sql` en **SQL Editor** y ejecútalo. Puedes repetirlo
   sin duplicar nada, porque actualiza las filas que ya existen.

## Volver a la v13

Despliega `functions/discord-server/backup/index.v13.ts` como `index.ts` de la
función `discord-server`, con **Verify JWT desactivado**, igual que ahora.
Las plantillas nuevas seguirán instalándose, pero sin canales privados, sin canales
de solo lectura y sin topics.
