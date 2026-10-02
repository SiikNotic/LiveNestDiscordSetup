# Activar las 50 plantillas en el instalador de Supabase

La web ya está preparada: en cuanto la función `discord-server` responda a
`?action=templates` con la lista de plantillas, las tarjetas «Próximamente» pasan
solas a «Instalables ya». No hace falta volver a desplegar la web.

Hay que hacer tres cosas en el proyecto de Supabase que usa la web
(`zxpentlarsbdilmyfxfc`).

## 1. Ejecutar el SQL

Abre **Supabase → SQL Editor → New query**, pega el contenido de
[`livenest_templates.sql`](./livenest_templates.sql) y pulsa **Run**.

- Crea la tabla `public.livenest_templates`, con lectura pública y escritura solo
  desde el service role.
- Carga las 50 plantillas. La última consulta debería devolver `50`.
- Puedes ejecutarlo varias veces sin duplicar nada, porque actualiza las filas
  que ya existen.

Para regenerarlo después de cambiar plantillas en el código:

```bash
npx tsx supabase/generate-templates-sql.ts
```

## 2. Añadir el instalador a la función

En **Edge Functions → discord-server**, crea un archivo nuevo llamado
`livenest-templates.ts` y copia dentro
[`functions/discord-server/livenest-templates.ts`](./functions/discord-server/livenest-templates.ts).

## 3. Conectar dos acciones en `index.ts`

Arriba del archivo:

```ts
import {
  getLivenestTemplate,
  installLivenestTemplate,
  listLivenestTemplates,
} from "./livenest-templates.ts";
```

**a) `action=templates`.** Ponla *antes* de la comprobación de sesión, para que
la web pueda consultarla sin estar conectada:

```ts
if (action === "templates") {
  const templates = await listLivenestTemplates(supabaseAdmin);
  return json({ templates });
}
```

**b) Dentro de `action=install`.** Ponlo *después* de comprobar la sesión y el
acceso al servidor, y *antes* de buscar las 6 plantillas que ya existen:

```ts
const row = await getLivenestTemplate(supabaseAdmin, template_id);
if (row) {
  const result = await installLivenestTemplate({
    guildId: guild_id,
    spec: row.spec,
    language, // "en" | "es" | "both", lo envía la web
    botToken: Deno.env.get("DISCORD_BOT_TOKEN")!,
  });
  return json(result, result.ok ? 200 : 207);
}
// …si no hay fila, sigue el código actual de las 6 plantillas.
```

Cambia los nombres a los que use tu función:

- `supabaseAdmin`: el cliente creado con `SUPABASE_SERVICE_ROLE_KEY`.
- `json(...)`: tu función de respuesta.
- `action`, `guild_id`, `template_id`, `language`: los valores que ya lees de la
  petición.
- `DISCORD_BOT_TOKEN`: el secreto donde guardes el token del bot.

Despliega la función: **Deploy** en el panel, o `supabase functions deploy discord-server`.

## Qué hace el instalador

- Crea los roles, las categorías y los canales que falten. **No borra nada**, y
  lo que ya existe con el mismo nombre se deja tal cual, así que ejecutarlo dos
  veces no duplica nada.
- Los canales de solo lectura deniegan escribir a @everyone y lo permiten a los
  roles de staff (Owner, Administrator, Moderator, Support).
- Los canales de foro y de anuncios se crean como tales si el servidor tiene
  **Comunidad** activado. Si no, se crean como canales de texto normales.
- Pone la descripción (topic) en los canales nuevos.
- El idioma `es` / `both` traduce los nombres más comunes (welcome → bienvenida,
  rules → reglas…). El resto conserva su nombre.
- Si el bot no puede dar un permiso (por ejemplo, Administrator al rol Owner),
  crea el rol sin ese permiso y lo indica en `log`.
- Si algo falla, la respuesta incluye `error` y la web lo muestra como fallo.

El bot necesita **Gestionar roles** y **Gestionar canales**. Su rol tiene que
estar por encima de los roles que vaya a crear.
