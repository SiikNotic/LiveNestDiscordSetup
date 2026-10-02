import type { ChannelKind, ChannelSpec } from "./livenest-blueprint";
import type { ServerTemplate } from "./server-templates";

/** Hand-written copy for the catalog templates, keyed by template id: [English, Spanish]. */
export const CATALOG_COPY: Record<string, readonly [string, string]> = {
  "minecraft-community": [
    "Survival-first server with base building, redstone, trading and a shared coordinates channel so nobody loses their base.",
    "Servidor centrado en survival con construcción, redstone, comercio y un canal de coordenadas para que nadie pierda su base.",
  ],
  "roblox-community": [
    "For players and creators: experience reviews, trading, LFG and a creator corner for showcasing games and avatars.",
    "Para jugadores y creadores: reseñas de experiencias, trading, LFG y un rincón para mostrar juegos y avatares.",
  ],
  "valorant-hub": [
    "Agent talk, ranked LFG, scrims and a leaderboard — set up the way competitive Valorant groups actually run.",
    "Agentes, LFG de ranked, scrims y leaderboard — montado como funcionan los grupos competitivos de Valorant.",
  ],
  "fortnite-squad": [
    "Separate duo, trio and squad LFG, item-shop talk, creative maps and custom-game nights.",
    "LFG separado para dúos, tríos y escuadras, charla de la tienda, mapas creativos y partidas personalizadas.",
  ],
  "cod-warzone": [
    "Loadouts and meta talk, ranked LFG, scrims and tournament results for a CoD or Warzone crew.",
    "Clases y meta, LFG de ranked, scrims y resultados de torneos para un grupo de CoD o Warzone.",
  ],
  "sim-racing": [
    "Race calendar, qualifying, results and standings, plus setup help and livery showcases for a sim racing league.",
    "Calendario, clasificación, resultados y tabla, más ayuda con setups y liveries para una liga de sim racing.",
  ],
  "mmorpg-guild": [
    "Raid planning and sign-ups, loot tracking, builds and a recruitment funnel with applications.",
    "Planificación e inscripción de raids, control de botín, builds y reclutamiento con solicitudes.",
  ],
  "esports-team": [
    "Internal team server: scrim and match schedule, VOD review, stats and opponent scouting.",
    "Servidor interno de equipo: scrims y calendario de partidos, revisión de VODs, estadísticas y scouting de rivales.",
  ],
  "anime-community": [
    "Seasonal anime, manga chapter talk, fan art and cosplay, and a spoiler zone so episode chat stays safe.",
    "Anime de temporada, capítulos de manga, fanart y cosplay, y una zona de spoilers para comentar sin arruinar nada.",
  ],
  "kpop-fandom": [
    "Bias chat, comeback hype, streaming parties and fan projects for a K-pop fandom.",
    "Bias chat, comebacks, streaming parties y proyectos de fans para un fandom de K-pop.",
  ],
  "cyberpunk-rp": [
    "Night City roleplay with character profiles, factions, netrunner heists and logged story arcs.",
    "Roleplay en Night City con perfiles de personaje, facciones, golpes de netrunners y arcos narrativos.",
  ],
  "medieval-rp": [
    "Fantasy kingdom RP: lore, maps and religions, a tavern and royal court, guild quests and tournaments.",
    "RP de reino de fantasía: lore, mapas y religiones, taberna y corte real, misiones de gremio y torneos.",
  ],
  "horror-rp": [
    "Investigation-style horror RP with case files, clues and evidence boards, plus creepypasta and horror nights.",
    "RP de terror tipo investigación con expedientes, pistas y tablero de pruebas, más creepypastas y noches de terror.",
  ],
  "study-campus": [
    "Study hall with subject channels, focus sprints, accountability goals and study groups.",
    "Sala de estudio con canales por asignatura, sprints de concentración, metas y grupos de estudio.",
  ],
  "programming-community": [
    "Help, code review and debugging, channels per stack, project showcase and a job board.",
    "Ayuda, code review y debugging, canales por stack, escaparate de proyectos y bolsa de trabajo.",
  ],
  "ai-tech-hub": [
    "AI news and prompting, builders sharing projects, paper discussion and AI art and automation workflows.",
    "Noticias de IA y prompting, proyectos de builders, discusión de papers y flujos de arte y automatización con IA.",
  ],
  "open-source": [
    "Contributor server for an open-source project: issues, PRs, architecture, docs and testing.",
    "Servidor para colaboradores de un proyecto open source: issues, PRs, arquitectura, documentación y testing.",
  ],
  "startup-hub": [
    "Founder community for validating ideas, building product, finding co-founders and pitch nights.",
    "Comunidad de fundadores para validar ideas, construir producto, encontrar socios y noches de pitch.",
  ],
  "freelancer-network": [
    "Job board, pricing talk, referrals and contract templates for freelancers across design, dev and writing.",
    "Bolsa de trabajo, precios, referidos y plantillas de contrato para freelancers de diseño, desarrollo y redacción.",
  ],
  "music-producer": [
    "Mixing and mastering help, collab board for vocalists and producers, and a releases showcase.",
    "Ayuda con mezcla y mastering, tablón de colaboraciones para vocalistas y productores, y escaparate de lanzamientos.",
  ],
  "dj-nightlife": [
    "Track sharing and mixes, event calendar, venue chat and a guest list channel for a DJ collective.",
    "Tracks y mixes, calendario de eventos, charla de locales y canal de lista de invitados para un colectivo de DJs.",
  ],
  "sports-fans": [
    "Match-day chat, hot takes, predictions and standings for fans of any sport.",
    "Chat de partido, opiniones, predicciones y clasificación para aficionados de cualquier deporte.",
  ],
  "soccer-community": [
    "Fixtures, results and tactics talk, plus pickup games and team recruitment for players.",
    "Calendario, resultados y táctica, más partidos y reclutamiento de equipos para quienes juegan.",
  ],
  "fitness-community": [
    "Workouts and form checks, nutrition and meal prep, daily check-ins and monthly challenges.",
    "Rutinas y revisión de técnica, nutrición y meal prep, check-ins diarios y retos mensuales.",
  ],
  "book-club": [
    "Monthly pick, chapter-by-chapter discussion, a spoiler channel and a writing corner.",
    "Libro del mes, discusión por capítulos, canal de spoilers y rincón de escritura.",
  ],
  "movie-club": [
    "Movie and series talk, ratings and reviews, film analysis and scheduled watch parties.",
    "Películas y series, puntuaciones y reseñas, análisis de cine y watch parties programadas.",
  ],
  photography: [
    "Showcase by genre, critique and editing help, gear talk and weekly photo challenges.",
    "Escaparate por género, críticas y ayuda de edición, equipo y retos fotográficos semanales.",
  ],
  "digital-art": [
    "WIPs and finished work, critique and portfolio reviews, commissions and a collab board.",
    "WIPs y obras terminadas, críticas y revisión de portfolio, comisiones y tablón de colaboraciones.",
  ],
  "fashion-style": [
    "Outfit checks, streetwear and rare finds, trades, and a showcase for designers and customs.",
    "Outfit checks, streetwear y hallazgos raros, intercambios y escaparate para diseñadores y customs.",
  ],
  "travel-community": [
    "Destinations, itineraries and budget tips, hidden gems and travel-buddy meetups.",
    "Destinos, itinerarios y consejos de presupuesto, rincones escondidos y quedadas con compañeros de viaje.",
  ],
  "food-community": [
    "Recipes and meal prep, a baking corner, restaurant reviews and cook-off challenges.",
    "Recetas y meal prep, rincón de repostería, reseñas de restaurantes y concursos de cocina.",
  ],
  "podcast-community": [
    "Listener chat per episode, guest requests, plus a production side for planning, recording and show notes.",
    "Chat de oyentes por episodio, peticiones de invitados y una parte de producción para planificar, grabar y notas.",
  ],
  "streamer-team": [
    "Internal server for a streamer team: content plan, thumbnails, collabs, sponsors and analytics.",
    "Servidor interno para un equipo de streamers: plan de contenido, miniaturas, collabs, sponsors y analíticas.",
  ],
  "creator-agency": [
    "Agency workspace: client intake, approvals and deliverables, campaign deadlines and creator availability.",
    "Espacio de agencia: alta de clientes, aprobaciones y entregables, plazos de campañas y disponibilidad de creadores.",
  ],
  "chill-aesthetic": [
    "Soft, low-pressure hangout with art, edits and outfits, game nights and movie nights.",
    "Lugar tranquilo para pasar el rato con arte, edits y outfits, noches de juegos y de películas.",
  ],
  "gothic-community": [
    "Late-night lounge for goth and alt folks: outfits, music recommendations and watch parties.",
    "Lounge nocturno para gente goth y alternativa: outfits, recomendaciones de música y watch parties.",
  ],
  "coquette-community": [
    "Coquette aesthetic: outfits, beauty, selfies and edits, with cozy movie nights.",
    "Estética coquette: outfits, belleza, selfies y edits, con noches de películas.",
  ],
  "language-learning": [
    "Practice channels per language, grammar and vocabulary help, voice practice rooms and daily challenges.",
    "Canales de práctica por idioma, ayuda con gramática y vocabulario, salas de voz y retos diarios.",
  ],
};

type Topic = readonly [string, string];

/** Topics for common channel names. Set only on creation, so owners can rewrite them freely. */
const TOPICS: Record<string, Topic> = {
  welcome: [
    "Start here. Read the rules, grab your roles, say hi.",
    "Empieza aquí. Lee las normas, elige tus roles y saluda.",
  ],
  rules: [
    "Read before posting. Breaking these gets you a warning, then a timeout.",
    "Léelas antes de escribir. Saltártelas supone un aviso y luego un timeout.",
  ],
  announcements: [
    "Official news from the team. Turn on notifications so you don't miss anything.",
    "Noticias oficiales del equipo. Activa las notificaciones para no perderte nada.",
  ],
  news: ["Official news from the team.", "Noticias oficiales del equipo."],
  changelog: ["Every release, what changed and why.", "Cada versión: qué cambió y por qué."],
  devlog: ["Behind-the-scenes updates from development.", "Novedades del desarrollo desde dentro."],
  "going-live": [
    "Stream alerts. Grab the Live Ping role to get notified.",
    "Avisos de directo. Coge el rol Live Ping para enterarte.",
  ],
  "choose-roles": [
    "Pick your roles to unlock channels and notifications.",
    "Elige tus roles para desbloquear canales y avisos.",
  ],
  roles: [
    "Pick your roles to unlock channels and notifications.",
    "Elige tus roles para desbloquear canales y avisos.",
  ],
  general: ["Main chat. Keep it friendly.", "Chat principal. Buen rollo."],
  chat: ["Main chat. Keep it friendly.", "Chat principal. Buen rollo."],
  introductions: [
    "New here? Tell us who you are and what brought you.",
    "¿Eres nuevo? Cuéntanos quién eres y qué te trae por aquí.",
  ],
  memes: ["Memes only. Keep them on topic-ish and SFW.", "Solo memes. Más o menos del tema y SFW."],
  media: ["Images, videos and clips.", "Imágenes, vídeos y clips."],
  clips: ["Your best plays and funniest moments.", "Tus mejores jugadas y momentos más graciosos."],
  suggestions: [
    "One idea per post. React to vote.",
    "Una idea por publicación. Reacciona para votar.",
  ],
  "feature-requests": [
    "One request per post. Search before posting; upvote instead of duplicating.",
    "Una petición por publicación. Busca antes de publicar y vota en vez de duplicar.",
  ],
  "bug-reports": [
    "One bug per post: what you did, what happened, what you expected.",
    "Un bug por publicación: qué hiciste, qué pasó y qué esperabas.",
  ],
  feedback: ["Honest feedback welcome. Be specific.", "Se agradece feedback sincero. Sé concreto."],
  help: [
    "Ask anything. Include details and screenshots.",
    "Pregunta lo que sea. Incluye detalles y capturas.",
  ],
  questions: [
    "Ask anything. Mark your post solved when you get an answer.",
    "Pregunta lo que quieras. Marca tu publicación como resuelta cuando te respondan.",
  ],
  faq: ["Answers to the questions we get the most.", "Respuestas a las preguntas más frecuentes."],
  "open-ticket": [
    "Need staff? Open a private ticket here.",
    "¿Necesitas al staff? Abre un ticket privado aquí.",
  ],
  "looking-for-group": [
    "Post your game, rank, region and when you can play.",
    "Publica tu juego, rango, región y cuándo puedes jugar.",
  ],
  lfg: [
    "Post your game, rank, region and when you can play.",
    "Publica tu juego, rango, región y cuándo puedes jugar.",
  ],
  "team-recruitment": [
    "Teams looking for players and players looking for teams.",
    "Equipos que buscan jugadores y jugadores que buscan equipo.",
  ],
  events: [
    "Upcoming events. Check the Events tab for times.",
    "Próximos eventos. Mira la pestaña de Eventos para los horarios.",
  ],
  giveaways: ["Active giveaways. React to enter.", "Sorteos activos. Reacciona para participar."],
  tournaments: [
    "Tournament info, sign-ups and rules.",
    "Información, inscripciones y reglas de torneos.",
  ],
  showcase: ["Show off what you've made.", "Enseña lo que has hecho."],
  resources: ["Useful links, guides and tools.", "Enlaces, guías y herramientas útiles."],
  "staff-chat": [
    "Staff only. Decisions and coordination.",
    "Solo staff. Decisiones y coordinación.",
  ],
  reports: [
    "Member reports. Handle, then react ✅.",
    "Reportes de miembros. Gestiona y reacciona ✅.",
  ],
  "mod-logs": [
    "Automated moderation log. Don't chat here.",
    "Registro automático de moderación. No escribas aquí.",
  ],
  "bot-logs": ["Bot output. Don't chat here.", "Salida de bots. No escribas aquí."],
  "ticket-logs": ["Closed ticket transcripts.", "Transcripciones de tickets cerrados."],
  "risk-disclaimer": [
    "Nothing here is financial advice. Trade at your own risk.",
    "Nada de esto es asesoramiento financiero. Opera bajo tu propio riesgo.",
  ],
  signals: [
    "Trade ideas from mentors. Not financial advice.",
    "Ideas de trading de los mentores. No es asesoramiento financiero.",
  ],
  "playtest-signup": [
    "Want to playtest? Post your platform and availability.",
    "¿Quieres probar el juego? Indica tu plataforma y disponibilidad.",
  ],
  "start-here": [
    "New member? Read this first, then go to module 1.",
    "¿Eres nuevo? Lee esto primero y luego ve al módulo 1.",
  ],
  wins: ["Share your wins, big or small.", "Comparte tus logros, grandes o pequeños."],
  "daily-check-in": ["What are you working on today?", "¿En qué estás trabajando hoy?"],
  "spoiler-zone": [
    "Spoilers allowed. Use ||spoiler tags|| for anything recent.",
    "Se permiten spoilers. Usa ||etiquetas de spoiler|| para lo reciente.",
  ],
  "session-schedule": ["Next sessions and who's playing.", "Próximas sesiones y quién juega."],
  "character-sheets": [
    "One post per character. Keep sheets up to date.",
    "Una publicación por personaje. Mantén las fichas al día.",
  ],
};

/** Channels that work best as forum posts (one thread per topic). */
const FORUM = new Set([
  "suggestions",
  "feature-requests",
  "bug-reports",
  "feedback",
  "looking-for-group",
  "lfg",
  "team-recruitment",
  "questions",
  "playtest-signup",
  "recommendations",
  "character-sheets",
  "character-profiles",
  "applications",
  "job-board",
  "collab-board",
]);

/** Read-only channels that should be announcement channels (followable from other servers). */
const ANNOUNCEMENT = new Set([
  "announcements",
  "news",
  "changelog",
  "devlog",
  "going-live",
  "signals",
  "game-updates",
]);

/** "🌷︱welcome" → welcome, "rules・reglas" → rules; bilingual when the name carries a "・" translation. */
function parseName(name: string) {
  const afterDivider = name.split("︱").pop() ?? name;
  const bilingual = afterDivider.includes("・");
  const base = (afterDivider.split("・")[0] ?? "")
    .replace(/^[^\p{L}\p{N}]+/u, "")
    .trim()
    .toLowerCase();
  return { base, bilingual };
}

function enrichChannel(ch: ChannelSpec): ChannelSpec {
  if (ch.kind === "voice") return ch;
  const { base, bilingual } = parseName(ch.name);
  let kind: ChannelKind = ch.kind;
  if (ch.kind === "text") {
    if (ch.readOnly && ANNOUNCEMENT.has(base)) kind = "announcement";
    else if (!ch.readOnly && FORUM.has(base)) kind = "forum";
  }
  const t = TOPICS[base];
  const topic = ch.topic ?? (t ? (bilingual ? `${t[0]} · ${t[1]}` : t[0]) : undefined);
  return { ...ch, kind, ...(topic ? { topic } : {}) };
}

export function enrichTemplate(tpl: ServerTemplate): ServerTemplate {
  return {
    ...tpl,
    categories: tpl.categories.map((cat) => ({
      ...cat,
      channels: cat.channels.map(enrichChannel),
    })),
  };
}
