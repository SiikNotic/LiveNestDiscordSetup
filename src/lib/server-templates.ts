import type { CategorySpec, RoleSpec } from "./livenest-blueprint";
import { CATALOG_COPY, enrichTemplate } from "./template-enrichment";

export type TemplateCategory = "Gaming" | "Roleplay" | "Community" | "Streaming" | "Friends" | "Creator" | "Anime" | "Tech" | "Study" | "Music" | "Sports" | "Business" | "Art" | "Lifestyle";

export type ServerTemplate = {
  id: string;
  name: string;
  category: TemplateCategory;
  description: string;
  descriptionEs: string;
  theme: { accent: string; secondary: string; surface: string; tagline: string };
  categories: readonly CategorySpec[];
  roles: readonly RoleSpec[];
};

const staff: RoleSpec[] = [
  { name:"👑・Owner", color:"#D4AF37", permissions:["ADMINISTRATOR"], hoist:true },
  { name:"🛡️・Administrator", color:"#B8860B", permissions:["MANAGE_GUILD","MANAGE_MESSAGES","MANAGE_THREADS","MODERATE_MEMBERS","KICK_MEMBERS"], hoist:true },
  { name:"🔨・Moderator", color:"#5865F2", permissions:["MANAGE_MESSAGES","MANAGE_THREADS","MODERATE_MEMBERS","KICK_MEMBERS"], hoist:true },
  { name:"🎧・Support", color:"#00B8A9", permissions:["MANAGE_MESSAGES"], hoist:true },
  { name:"🤖・Bot", color:"#64748B", permissions:[] }
];
const members: RoleSpec[] = [
  {name:"🌱・New Member",color:"#A7A9AC",permissions:[]},{name:"💬・Member",color:"#E5E7EB",permissions:[]}
];
const baseRoles=(extra:RoleSpec[])=>[...staff,...members,...extra];
const text=(names:string[],readOnly=false)=>names.map(name=>({name,kind:"text" as const,...(readOnly?{readOnly:true}:{})}));
const voice=(names:string[])=>names.map(name=>({name,kind:"voice" as const}));
const privateStaff=(names:string[]):CategorySpec=>({name:"🛡️・STAFF",privateTo:["👑・Owner","🛡️・Administrator","🔨・Moderator","🎧・Support"],channels:text(names)});

const baseTemplates: ServerTemplate[] = [
{
 id:"gaming-community",
 theme:{accent:"#A855F7",secondary:"#22D3EE",surface:"#120A22",tagline:"NEON ARCADE • COMMUNITY • EVENTS"},name:"Gaming Community",category:"Gaming",
 description:"Modern gaming community with LFG, games, events, media, support and staff operations.",
 descriptionEs:"Comunidad gaming moderna con LFG, juegos, eventos, medios, soporte y gestión de staff.",
 roles:baseRoles([
  {name:"🎮・Gamer",color:"#22C55E",permissions:[]},{name:"⚔️・Competitive",color:"#F59E0B",permissions:[]},{name:"💎・VIP",color:"#C9A227",permissions:[]},
  {name:"🖥️・PC",color:"#3B82F6",permissions:[]},{name:"🎮・PlayStation",color:"#2563EB",permissions:[]},{name:"🟢・Xbox",color:"#16A34A",permissions:[]},
  {name:"🔴・Nintendo",color:"#EF4444",permissions:[]},{name:"📰・Game Updates",color:"#8B5CF6",permissions:[]}
 ]),
 categories:[
  {name:"👋・WELCOME",channels:text(["welcome・bienvenida","rules・reglas","choose-roles・roles","announcements・anuncios"],true)},
  {name:"💬・COMMUNITY",channels:text(["general・general","introductions・presentaciones","media・medios","memes","suggestions・sugerencias"])},
  {name:"🎮・GAMING",channels:text(["gaming-chat","game-news","game-deals","looking-for-group","clips・clips"])},
  {name:"🎉・EVENTS",channels:text(["events・eventos","tournaments・torneos","giveaways・sorteos"])},
  {name:"🎫・SUPPORT",channels:text(["help・ayuda","open-ticket・abrir-ticket","faq・preguntas-frecuentes"])},
  {name:"🔊・VOICE",channels:voice(["Lobby","Gaming 1","Gaming 2","Gaming 3","Streaming","Music","AFK"])},
  privateStaff(["staff-chat","staff-announcements","reports","mod-logs","bot-logs","ticket-logs"])
 ]
},
{
 id:"competitive-gaming",
 theme:{accent:"#EF4444",secondary:"#F59E0B",surface:"#1A0808",tagline:"ESPORTS • RANKED • TOURNAMENTS"},name:"Competitive Gaming",category:"Gaming",
 description:"Tournament-ready structure for teams, matchmaking, rankings, events and moderation.",
 descriptionEs:"Estructura competitiva para equipos, matchmaking, rankings, eventos y moderación.",
 roles:baseRoles([
  {name:"⚔️・Competitive Player",color:"#F59E0B",permissions:[]},{name:"👑・Team Captain",color:"#EF4444",permissions:[]},{name:"🏆・Tournament Staff",color:"#A855F7",permissions:[]},
  {name:"🎙️・Caster",color:"#06B6D4",permissions:[]},{name:"🥇・Champion",color:"#D4AF37",permissions:[]},{name:"📣・Tournament Ping",color:"#F97316",permissions:[]}
 ]),
 categories:[
  {name:"👋・WELCOME",channels:text(["welcome・bienvenida","rules・reglas","announcements・anuncios"],true)},
  {name:"⚔️・COMPETITION",channels:text(["matchmaking","team-recruitment","team-management","scrims","results"])},
  {name:"🏆・TOURNAMENTS",channels:text(["tournament-info","brackets","match-schedule","match-results","tournament-chat"])},
  {name:"💬・COMMUNITY",channels:text(["general","gaming-chat","clips","highlights","suggestions"])},
  {name:"🎫・SUPPORT",channels:text(["support","appeals","open-ticket"])},
  {name:"🔊・VOICE",channels:voice(["Lobby","Team 1","Team 2","Team 3","Match Room 1","Match Room 2","Caster Room","AFK"])},
  privateStaff(["staff-chat","tournament-staff","reports","match-logs","mod-logs"])
 ]
},
{
 id:"fivem-roleplay",
 theme:{accent:"#38BDF8",secondary:"#F59E0B",surface:"#07131C",tagline:"ROLEPLAY • DEPARTMENTS • RADIO"},name:"FiveM Roleplay",category:"Roleplay",
 description:"FiveM RP structure with departments, applications, scenes, radio and staff operations.",
 descriptionEs:"Estructura FiveM RP con departamentos, solicitudes, escenas, radio y operaciones de staff.",
 roles:baseRoles([
  {name:"👤・Civilian",color:"#94A3B8",permissions:[]},{name:"🚓・Police",color:"#2563EB",permissions:[]},{name:"⭐・Sheriff",color:"#0EA5E9",permissions:[]},
  {name:"🚑・EMS",color:"#EF4444",permissions:[]},{name:"🚒・Fire Department",color:"#F97316",permissions:[]},{name:"🚧・DOT",color:"#EAB308",permissions:[]},
  {name:"🏛️・Government",color:"#8B5CF6",permissions:[]},{name:"💼・Business Owner",color:"#22C55E",permissions:[]},{name:"✅・Verified",color:"#10B981",permissions:[]},
  {name:"🎥・Streamer",color:"#9146FF",permissions:[]}
 ]),
 categories:[
  {name:"👋・WELCOME",channels:text(["welcome・bienvenida","rules・reglas","server-info","announcements・anuncios"],true)},
  {name:"💬・COMMUNITY",channels:text(["general","media","clips","suggestions","looking-for-players"])},
  {name:"🎭・ROLEPLAY",channels:text(["rp-chat","character-info","businesses","events","scene-coordination"])},
  {name:"📋・APPLICATIONS",channels:text(["staff-application","department-application","business-application","appeals"])},
  {name:"🚨・DEPARTMENTS",channels:text(["police-info","ems-info","fire-info","dot-info","government-info"],true)},
  {name:"🎫・SUPPORT",channels:text(["help","open-ticket","faq"])},
  {name:"📻・RTO RADIO",channels:voice(["Police RTO","EMS RTO","Fire RTO","DOT RTO","Government RTO"])},
  {name:"🎬・SCENES",channels:voice(["Scene 1","Scene 2","Scene 3","Scene 4","Staff Scene"])},
  privateStaff(["staff-chat","staff-announcements","applications-review","ingame-logs","reports","ban-appeals","ticket-logs"])
 ]
},
{
 id:"gta-rp-community",
 theme:{accent:"#F59E0B",secondary:"#22C55E",surface:"#171008",tagline:"CITY LIFE • JOBS • FACTIONS"},name:"GTA RP Community",category:"Roleplay",
 description:"GTA RP hub for characters, jobs, factions, events, support and community.",
 descriptionEs:"Centro GTA RP para personajes, trabajos, facciones, eventos, soporte y comunidad.",
 roles:baseRoles([
  {name:"👤・Citizen",color:"#94A3B8",permissions:[]},{name:"🚓・Law Enforcement",color:"#2563EB",permissions:[]},{name:"🚑・Medical",color:"#EF4444",permissions:[]},
  {name:"🚒・Fire",color:"#F97316",permissions:[]},{name:"🏛️・Government",color:"#8B5CF6",permissions:[]},{name:"💼・Business",color:"#22C55E",permissions:[]},
  {name:"👑・Faction Leader",color:"#D4AF37",permissions:[]},{name:"🎥・Content Creator",color:"#EC4899",permissions:[]}
 ]),
 categories:[
  {name:"👋・WELCOME",channels:text(["welcome・bienvenida","rules・reglas","server-info","announcements・anuncios"],true)},
  {name:"💬・COMMUNITY",channels:text(["general","introductions","media","memes","suggestions"])},
  {name:"🎭・ROLEPLAY",channels:text(["character-chat","jobs","businesses","factions","rp-events"])},
  {name:"🎫・SUPPORT",channels:text(["help","player-reports","appeals","open-ticket"])},
  {name:"🔊・VOICE",channels:voice(["Lobby","RP Lounge","Faction 1","Faction 2","Chill","AFK"])},
  privateStaff(["staff-chat","reports","appeals-review","mod-logs","ticket-logs"])
 ]
},
{
 id:"streamer-community",
 theme:{accent:"#EC4899",secondary:"#8B5CF6",surface:"#180A17",tagline:"LIVE • CONTENT • COMMUNITY"},name:"Streamer Community",category:"Streaming",
 description:"Streamer-focused server with live alerts, content, fans, subscribers, events and support.",
 descriptionEs:"Servidor para streamers con avisos en directo, contenido, fans, suscriptores, eventos y soporte.",
 roles:baseRoles([
  {name:"👋・Follower",color:"#3B82F6",permissions:[]},{name:"⭐・Subscriber",color:"#A855F7",permissions:[]},{name:"💎・VIP",color:"#D4AF37",permissions:[]},
  {name:"🎥・Streamer",color:"#9146FF",permissions:[]},{name:"🎥・Content Creator",color:"#EC4899",permissions:[]},{name:"🔴・Stream Notifications",color:"#EF4444",permissions:[]},
  {name:"▶️・YouTube Notifications",color:"#DC2626",permissions:[]},{name:"📣・Events Ping",color:"#F59E0B",permissions:[]}
 ]),
 categories:[
  {name:"👋・WELCOME",channels:text(["welcome・bienvenida","rules・reglas","roles・roles"],true)},
  {name:"🔴・LIVE NOW",channels:text(["stream-status","stream-announcements","clips","highlights"])},
  {name:"💬・COMMUNITY",channels:text(["general","chat","memes","fan-art","suggestions"])},
  {name:"🌐・SOCIALS",channels:text(["twitch","youtube","tiktok","instagram"],true)},
  {name:"🎉・EVENTS",channels:text(["events","giveaways","community-events"])},
  {name:"⭐・SUBSCRIBERS",channels:text(["subscriber-chat","subscriber-media"])},
  {name:"🎫・SUPPORT",channels:text(["help","open-ticket","faq"])},
  {name:"🔊・VOICE",channels:voice(["Lobby","Chilling","Gaming","Streaming","Subscriber Lounge","AFK"])},
  privateStaff(["staff-chat","content-planning","mod-logs","bot-logs","ticket-logs"])
 ]
},
{
 id:"creator-community",
 theme:{accent:"#06B6D4",secondary:"#EC4899",surface:"#07151A",tagline:"CREATE • COLLAB • PUBLISH"},name:"Creator / YouTuber",category:"Creator",
 description:"Creator hub for videos, projects, collaborations, feedback and content planning.",
 descriptionEs:"Centro para creadores con vídeos, proyectos, colaboraciones, feedback y planificación.",
 roles:baseRoles([
  {name:"🎨・Creator",color:"#EC4899",permissions:[]},{name:"✅・Verified Creator",color:"#F59E0B",permissions:[]},{name:"✂️・Editor",color:"#8B5CF6",permissions:[]},
  {name:"🖌️・Designer",color:"#06B6D4",permissions:[]},{name:"🤝・Collaborator",color:"#22C55E",permissions:[]},{name:"💙・Supporter",color:"#3B82F6",permissions:[]},
  {name:"📣・Project Ping",color:"#F97316",permissions:[]}
 ]),
 categories:[
  {name:"👋・WELCOME",channels:text(["welcome・bienvenida","rules・reglas","about・acerca-de","announcements・anuncios"],true)},
  {name:"🎨・CREATOR HUB",channels:text(["creator-chat","introductions","showcase","feedback","resources"])},
  {name:"🎬・CONTENT",channels:text(["video-releases","clips","thumbnails","content-ideas","behind-the-scenes"])},
  {name:"📁・PROJECTS",channels:text(["project-board","collaborations","team-search","project-feedback"])},
  {name:"💬・COMMUNITY",channels:text(["general","off-topic","memes","events"])},
  {name:"🎫・SUPPORT",channels:text(["help","open-ticket","faq"])},
  {name:"🔊・VOICE",channels:voice(["Lounge","Creator Room","Collab Room","Recording Room","AFK"])},
  privateStaff(["staff-chat","content-planning","reports","mod-logs","ticket-logs"])
 ]
},
{
 id:"modern-community",
 theme:{accent:"#D4AF37",secondary:"#60A5FA",surface:"#12110B",tagline:"PREMIUM • SOCIAL • EVENTS"},name:"Modern Community",category:"Community",
 description:"Clean all-purpose community server with discussion, media, events, support and staff.",
 descriptionEs:"Comunidad moderna para cualquier público con discusión, medios, eventos, soporte y staff.",
 roles:baseRoles([
  {name:"✅・Verified",color:"#10B981",permissions:[]},{name:"⚡・Active Member",color:"#3B82F6",permissions:[]},{name:"💎・VIP",color:"#D4AF37",permissions:[]},
  {name:"🤝・Partner",color:"#C084FC",permissions:[]},{name:"📣・Event Ping",color:"#F59E0B",permissions:[]},{name:"📢・Announcement Ping",color:"#EF4444",permissions:[]}
 ]),
 categories:[
  {name:"👋・WELCOME",channels:text(["welcome・bienvenida","rules・reglas","choose-roles・roles","announcements・anuncios"],true)},
  {name:"💬・COMMUNITY",channels:text(["general","introductions","questions","suggestions","polls"])},
  {name:"🖼️・MEDIA",channels:text(["photos","videos","memes","art","showcase"])},
  {name:"🎉・EVENTS",channels:text(["events","giveaways","community-events"])},
  {name:"🎫・SUPPORT",channels:text(["help","open-ticket","faq"])},
  {name:"🔊・VOICE",channels:voice(["Lobby","Chill 1","Chill 2","Gaming","Music","AFK"])},
  privateStaff(["staff-chat","staff-announcements","reports","mod-logs","ticket-logs"])
 ]
},
{
 id:"friends-chill",
 theme:{accent:"#8B5CF6",secondary:"#22C55E",surface:"#100B18",tagline:"FRIENDS • GAMING • CHILL"},name:"Friends & Chill",category:"Friends",
 description:"Relaxed private community for friends, gaming, media, events and voice hangouts.",
 descriptionEs:"Comunidad relajada para amigos, gaming, medios, eventos y salas de voz.",
 roles:baseRoles([
  {name:"💜・Friend",color:"#3B82F6",permissions:[]},{name:"💙・Close Friend",color:"#8B5CF6",permissions:[]},{name:"💎・VIP Friend",color:"#D4AF37",permissions:[]},
  {name:"🎮・Gamer",color:"#22C55E",permissions:[]},{name:"🎥・Streamer",color:"#9146FF",permissions:[]}
 ]),
 categories:[
  {name:"🚀・START HERE",channels:text(["welcome","rules","announcements"],true)},
  {name:"☕・HANGOUT",channels:text(["general","random","memes","photos","videos","music"])},
  {name:"🎮・GAMING",channels:text(["gaming-chat","looking-for-players","clips","game-news"])},
  {name:"🎉・EVENTS",channels:text(["events","game-nights","giveaways"])},
  {name:"🔊・VOICE",channels:voice(["Lobby","Chill 1","Chill 2","Gaming 1","Gaming 2","Music","AFK"])},
  privateStaff(["staff-chat","mod-logs"])
 ]
}
];



type CatalogConfig = {
  id:string; name:string; category:TemplateCategory; accent:string; secondary:string; surface:string; tagline:string;
  roleNames:string[]; roleColors:string[];
  description?:string; descriptionEs?:string;
  sections:Array<{name:string; channels:string[]; readOnly?:boolean; voice?:boolean}>;
};

const catalogTemplate = (c:CatalogConfig):ServerTemplate => ({
  id:c.id,
  name:c.name,
  category:c.category,
  description:c.description ?? CATALOG_COPY[c.id]?.[0] ?? `A polished ${c.name} Discord template with purpose-built channels, roles, events, support and staff structure.`,
  descriptionEs:c.descriptionEs ?? CATALOG_COPY[c.id]?.[1] ?? `Plantilla premium de Discord para ${c.name}, con canales especializados, roles, eventos, soporte y estructura de staff.`,
  theme:{accent:c.accent,secondary:c.secondary,surface:c.surface,tagline:c.tagline},
  roles:baseRoles(c.roleNames.map((name,i)=>({name,color:c.roleColors[i] ?? c.accent,permissions:[]}))),
  categories:c.sections.map(section=>({
    name:section.name,
    channels:section.voice ? voice(section.channels) : text(section.channels,section.readOnly)
  }))
});

// Curated 2026 set. Patterns taken from what sells on setup marketplaces and from
// large public servers: a read-only start section first, 5–8 categories of 3–6
// channels, emoji + divider naming kept readable, tickets and staff logs separated.
const curatedConfigs:CatalogConfig[] = [
  {
    id:"minimal-starter",name:"Minimal Starter",category:"Community",accent:"#E5E7EB",secondary:"#94A3B8",surface:"#0E0F11",tagline:"CLEAN • SMALL • READY",
    description:"Few channels on purpose. Small servers feel empty with 40 channels; this one feels busy with 10 people.",
    descriptionEs:"Pocos canales a propósito. Un servidor pequeño con 40 canales se siente vacío; este se siente activo con 10 personas.",
    roleNames:["⭐・Regular","📣・Pings"],roleColors:["#F5F5F4","#94A3B8"],
    sections:[
      {name:"📌︱START",channels:["📜︱rules","📢︱announcements"],readOnly:true},
      {name:"💬︱CHAT",channels:["💬︱general","🖼️︱media","🔗︱links"]},
      {name:"🔊︱VOICE",channels:["Lounge","Focus","AFK"],voice:true},
      {name:"🛡️︱STAFF",channels:["staff","logs"]}
    ]
  },
  {
    id:"kawaii-pastel",name:"Kawaii Pastel",category:"Friends",accent:"#F9A8D4",secondary:"#A5B4FC",surface:"#1B1420",tagline:"PASTEL • SOFT • COZY",
    description:"The pastel look people pay designers for: soft dividers, cute role names and cozy voice rooms.",
    descriptionEs:"El estilo pastel por el que la gente paga a diseñadores: separadores suaves, roles tiernos y salas de voz acogedoras.",
    roleNames:["🍓・Strawberry","🫐・Blueberry","🍑・Peach","🧸・Cuddle Buddy","🌙・Night Owl","🎀・Booster"],roleColors:["#F9A8D4","#A5B4FC","#FDBA74","#FDE68A","#C4B5FD","#F472B6"],
    sections:[
      {name:"🎀 ⋆ WELCOME",channels:["🌷︱welcome","📜︱rules","📢︱news","🎀︱roles"],readOnly:true},
      {name:"🍓 ⋆ HANGOUT",channels:["🍓︱chat","🧁︱introductions","🐱︱pets","📸︱selfies","🌈︱memes"]},
      {name:"🎨 ⋆ CREATIVE",channels:["🎨︱art","✂️︱edits","🎧︱music","📚︱books"]},
      {name:"🎮 ⋆ PLAY",channels:["🎮︱games","🌙︱game-night","🎁︱giveaways"]},
      {name:"☁️ ⋆ VOICE",channels:["☁️ Cloud Lounge","🍵 Tea Room","🎮 Game Room","💤 Sleepy"],voice:true},
      {name:"🛡️ ⋆ STAFF",channels:["staff-chat","reports","mod-logs"]}
    ]
  },
  {
    id:"product-community",name:"Product Community",category:"Business",accent:"#6366F1",secondary:"#22D3EE",surface:"#0B0C18",tagline:"CHANGELOG • FEEDBACK • SUPPORT",
    description:"For SaaS, apps and indie products: changelog, feature requests, bug reports, beta testers and a support desk.",
    descriptionEs:"Para SaaS, apps y productos indie: changelog, peticiones, reportes de bugs, beta testers y soporte.",
    roleNames:["💳・Customer","🧪・Beta Tester","🏗️・Builder","🧑‍💻・Team","📣・Changelog Ping"],roleColors:["#22D3EE","#A78BFA","#34D399","#6366F1","#94A3B8"],
    sections:[
      {name:"🚀︱START HERE",channels:["👋︱welcome","📜︱rules","📢︱announcements","📝︱changelog"],readOnly:true},
      {name:"💬︱COMMUNITY",channels:["💬︱general","🙋︱introductions","🏗️︱showcase","💡︱tips"]},
      {name:"🧭︱PRODUCT",channels:["✨︱feature-requests","🐛︱bug-reports","🗺️︱roadmap","🧪︱beta"]},
      {name:"🎫︱SUPPORT",channels:["❓︱help","🎫︱open-ticket","📚︱docs"]},
      {name:"🔊︱VOICE",channels:["Office Hours","Community Call","AFK"],voice:true},
      {name:"🛡️︱TEAM",channels:["team-chat","escalations","ticket-logs","mod-logs"]}
    ]
  },
  {
    id:"trading-desk",name:"Trading Desk",category:"Business",accent:"#10B981",secondary:"#F43F5E",surface:"#06120E",tagline:"MARKETS • SIGNALS • JOURNAL",
    description:"Markets community with read-only signals, per-market chats, trade journals and a clear risk disclaimer up top.",
    descriptionEs:"Comunidad de mercados con señales de solo lectura, chats por mercado, diarios de trading y aviso de riesgo arriba.",
    roleNames:["📈・Trader","💎・Premium","🎓・Mentor","🪙・Crypto","💱・Forex","📊・Stocks"],roleColors:["#10B981","#D4AF37","#38BDF8","#F59E0B","#A78BFA","#F43F5E"],
    sections:[
      {name:"📌︱START",channels:["👋︱welcome","📜︱rules","⚠️︱risk-disclaimer","📢︱announcements"],readOnly:true},
      {name:"📡︱SIGNALS",channels:["📡︱signals","📰︱market-news","🗓️︱economic-calendar"],readOnly:true},
      {name:"💬︱MARKETS",channels:["💬︱general","🪙︱crypto","💱︱forex","📊︱stocks"]},
      {name:"📒︱LEARN",channels:["📒︱trade-journal","🧠︱strategies","📚︱resources","❓︱questions"]},
      {name:"🔊︱VOICE",channels:["Market Open","Live Trading","Mentor Room","AFK"],voice:true},
      {name:"🛡️︱STAFF",channels:["staff-chat","reports","mod-logs"]}
    ]
  },
  {
    id:"membership-academy",name:"Membership Academy",category:"Creator",accent:"#F59E0B",secondary:"#FB7185",surface:"#160F06",tagline:"COURSE • COHORT • ACCOUNTABILITY",
    description:"For paid courses and memberships: modules, wins, weekly calls and accountability pods. Pair with a paid-role bot.",
    descriptionEs:"Para cursos y membresías de pago: módulos, logros, llamadas semanales y grupos de responsabilidad. Úsala con un bot de roles de pago.",
    roleNames:["🎓・Student","💎・Member","🏆・Alumni","🧑‍🏫・Coach","🔥・Accountability"],roleColors:["#F59E0B","#D4AF37","#FB7185","#38BDF8","#F97316"],
    sections:[
      {name:"🎓︱ORIENTATION",channels:["👋︱welcome","📜︱rules","🧭︱start-here","📢︱announcements"],readOnly:true},
      {name:"📚︱MODULES",channels:["📘︱module-1","📗︱module-2","📙︱module-3","📎︱resources"]},
      {name:"💬︱COMMUNITY",channels:["💬︱general","🏆︱wins","🙋︱questions","🤝︱networking"]},
      {name:"🔥︱ACCOUNTABILITY",channels:["🎯︱weekly-goals","✅︱daily-check-in","👥︱pods"]},
      {name:"🔊︱LIVE",channels:["Weekly Call","Co-working","Hot Seat","AFK"],voice:true},
      {name:"🛡️︱STAFF",channels:["coach-chat","student-issues","mod-logs"]}
    ]
  },
  {
    id:"vtuber-community",name:"VTuber Community",category:"Streaming",accent:"#C084FC",secondary:"#67E8F9",surface:"#110A1C",tagline:"STREAMS • FANART • MEMBERS",
    description:"Built around a VTuber: stream alerts, fanart and clips, member-only lounge and a lore channel.",
    descriptionEs:"Pensada para un VTuber: avisos de stream, fanart y clips, sala exclusiva para miembros y canal de lore.",
    roleNames:["🌟・Fan","💜・Member","🎨・Fan Artist","✂️・Clipper","🔔・Live Ping","🛡️・Stream Mod"],roleColors:["#C084FC","#A855F7","#F472B6","#67E8F9","#FACC15","#5865F2"],
    sections:[
      {name:"🌙︱WELCOME",channels:["🌙︱welcome","📜︱rules","📢︱announcements","🔴︱going-live"],readOnly:true},
      {name:"💬︱FANS",channels:["💬︱general","📖︱lore","🗳️︱stream-ideas","🌈︱memes"]},
      {name:"🎨︱CREATE",channels:["🎨︱fanart","✂️︱clips","🎵︱covers","🖼️︱emotes-wip"]},
      {name:"💜︱MEMBERS",channels:["💜︱members-chat","🎁︱perks","🗓️︱members-stream"]},
      {name:"🔊︱VOICE",channels:["Watch Party","Collab Room","Fan Hangout","AFK"],voice:true},
      {name:"🛡️︱STAFF",channels:["mod-chat","stream-mods","reports","mod-logs"]}
    ]
  },
  {
    id:"indie-game-studio",name:"Indie Game Studio",category:"Tech",accent:"#F97316",secondary:"#84CC16",surface:"#140B05",tagline:"DEVLOGS • PLAYTESTS • WISHLIST",
    description:"For a game in development: devlogs, playtest sign-ups, bug reports by build and a press kit channel.",
    descriptionEs:"Para un juego en desarrollo: devlogs, inscripción a playtests, bugs por build y canal de press kit.",
    roleNames:["🕹️・Player","🧪・Playtester","🎨・Artist","🧑‍💻・Developer","📰・Press","🔔・Devlog Ping"],roleColors:["#F97316","#84CC16","#F472B6","#38BDF8","#E5E7EB","#FACC15"],
    sections:[
      {name:"🕹️︱START",channels:["👋︱welcome","📜︱rules","📢︱announcements","📰︱devlog"],readOnly:true},
      {name:"💬︱COMMUNITY",channels:["💬︱general","🖼️︱screenshots","💡︱suggestions","🎨︱fan-content"]},
      {name:"🧪︱PLAYTEST",channels:["📝︱playtest-signup","🐛︱bug-reports","🗣️︱feedback","📦︱builds"]},
      {name:"📰︱PRESS",channels:["📰︱press-kit","🎥︱creators"]},
      {name:"🔊︱VOICE",channels:["Dev Stream","Playtest Room","Hangout","AFK"],voice:true},
      {name:"🛡️︱TEAM",channels:["dev-chat","art","design","bug-triage","mod-logs"]}
    ]
  },
  {
    id:"tabletop-rpg",name:"Tabletop RPG",category:"Roleplay",accent:"#B45309",secondary:"#DC2626",surface:"#140D07",tagline:"CAMPAIGNS • DICE • LORE",
    description:"For D&D and other tabletop games: campaign tables, character sheets, scheduling and a dice room.",
    descriptionEs:"Para D&D y otros juegos de mesa: mesas de campaña, fichas de personaje, horarios y sala de dados.",
    roleNames:["🎲・Player","🧙・Game Master","📜・Lorekeeper","🗓️・Session Ping","🐉・Veteran"],roleColors:["#F59E0B","#DC2626","#A78BFA","#38BDF8","#D4AF37"],
    sections:[
      {name:"🏰︱TAVERN DOOR",channels:["👋︱welcome","📜︱rules","📢︱announcements","🗓️︱session-schedule"],readOnly:true},
      {name:"🍺︱TAVERN",channels:["🍺︱general","🎲︱dice-rolls","🖼️︱art-and-maps","🌈︱memes"]},
      {name:"🐉︱CAMPAIGNS",channels:["🗺️︱campaign-a","🗺️︱campaign-b","🧾︱character-sheets","📖︱lore"]},
      {name:"📝︱LFG",channels:["🔎︱looking-for-group","🧙︱gm-recruitment","🆕︱one-shots"]},
      {name:"🔊︱TABLES",channels:["Table 1","Table 2","Tavern","AFK"],voice:true},
      {name:"🛡️︱STAFF",channels:["gm-chat","reports","mod-logs"]}
    ]
  }
];

const catalogConfigs:CatalogConfig[] = [
  {
    id:"minecraft-community",name:"Minecraft Community",category:"Gaming",accent:"#22C55E",secondary:"#A3E635",surface:"#07160D",tagline:"SURVIVAL • BUILDING • EVENTS",
    roleNames:["⛏️・Builder","🧭・Explorer","⚔️・PvP","🌾・Farmer","💎・VIP","📣・Event Ping"],roleColors:["#22C55E","#38BDF8","#EF4444","#84CC16","#D4AF37","#F59E0B"],
    sections:[
      {name:"👋・START HERE",channels:["welcome","rules","server-info","announcements"],readOnly:true},
      {name:"⛏️・SURVIVAL",channels:["survival-chat","base-building","farms-and-redstone","trading","looking-for-group"]},
      {name:"🗺️・WORLD",channels:["map","coordinates","world-events","screenshots"]},
      {name:"🎉・EVENTS",channels:["events","competitions","giveaways"]},{name:"🔊・VOICE",channels:["Lobby","Survival","Building","Chill","AFK"],voice:true},
      {name:"🛡️・STAFF",channels:["staff-chat","reports","mod-logs","bot-logs"]}
    ]
  },
  {
    id:"roblox-community",name:"Roblox Community",category:"Gaming",accent:"#E11D48",secondary:"#F59E0B",surface:"#19070D",tagline:"ROBLOX • EXPERIENCES • EVENTS",
    roleNames:["🎮・Player","🛠️・Developer","🎨・Creator","🏆・Pro","💎・VIP","📣・Event Ping"],roleColors:["#3B82F6","#8B5CF6","#EC4899","#F59E0B","#D4AF37","#EF4444"],
    sections:[
      {name:"👋・WELCOME",channels:["welcome","rules","announcements","choose-roles"],readOnly:true},
      {name:"🎮・ROBLOX",channels:["game-chat","experience-reviews","looking-for-group","trading","tips-and-guides"]},
      {name:"🎨・CREATORS",channels:["game-showcase","avatar-showcase","dev-chat","collabs"]},
      {name:"🎉・EVENTS",channels:["events","tournaments","giveaways"]},{name:"🔊・VOICE",channels:["Lobby","Gaming 1","Gaming 2","Chill","AFK"],voice:true},
      {name:"🛡️・STAFF",channels:["staff-chat","reports","mod-logs","ticket-logs"]}
    ]
  },
  {
    id:"valorant-hub",name:"Valorant Community",category:"Gaming",accent:"#EF4444",secondary:"#F59E0B",surface:"#180708",tagline:"VALORANT • RANKED • CLIPS",
    roleNames:["🎯・Player","🏆・Ranked","👑・Team Captain","🎙️・Caster","🥇・Champion","📣・LFG Ping"],roleColors:["#EF4444","#F59E0B","#A855F7","#06B6D4","#D4AF37","#22C55E"],
    sections:[
      {name:"👋・WELCOME",channels:["welcome","rules","announcements","rank-roles"],readOnly:true},
      {name:"🎯・VALORANT",channels:["general","agent-talk","tips-and-guides","clips","highlights"]},
      {name:"⚔️・LFG",channels:["looking-for-group","ranked-lfg","scrims","team-recruitment"]},
      {name:"🏆・COMPETITION",channels:["tournaments","brackets","match-results","leaderboard"]},{name:"🔊・VOICE",channels:["Lobby","Ranked 1","Ranked 2","Team Room","AFK"],voice:true},
      {name:"🛡️・STAFF",channels:["staff-chat","reports","match-logs","mod-logs"]}
    ]
  },
  {
    id:"fortnite-squad",name:"Fortnite Squad",category:"Gaming",accent:"#14B8A6",secondary:"#A3E635",surface:"#061514",tagline:"FORTNITE • SQUADS • CREATIVE",
    roleNames:["🪂・Player","🏆・Competitive","🎨・Creative","👑・Squad Leader","💎・VIP","📣・LFG Ping"],roleColors:["#14B8A6","#F59E0B","#A855F7","#EF4444","#D4AF37","#22C55E"],
    sections:[
      {name:"👋・WELCOME",channels:["welcome","rules","announcements","roles"],readOnly:true},
      {name:"🪂・FORTNITE",channels:["general","tips-and-tricks","clips","creative","item-shop-talk"]},
      {name:"👥・SQUADS",channels:["lfg","duo-lfg","trio-lfg","squad-lfg"]},
      {name:"🏆・EVENTS",channels:["tournaments","custom-games","giveaways"]},{name:"🔊・VOICE",channels:["Lobby","Duos","Trios","Squads","AFK"],voice:true},
      {name:"🛡️・STAFF",channels:["staff-chat","reports","mod-logs"]}
    ]
  },
  {
    id:"cod-warzone",name:"Call of Duty / Warzone",category:"Gaming",accent:"#22C55E",secondary:"#EF4444",surface:"#06130A",tagline:"WARZONE • LOADOUTS • SQUADS",
    roleNames:["🎮・Player","🎯・Ranked","🪖・Squad Lead","🏆・Tournament","💎・VIP","📣・LFG Ping"],roleColors:["#22C55E","#EF4444","#F59E0B","#A855F7","#D4AF37","#3B82F6"],
    sections:[
      {name:"👋・WELCOME",channels:["welcome","rules","announcements","loadout-roles"],readOnly:true},
      {name:"🎯・WARZONE",channels:["general","loadouts","meta-talk","clips","highlights"]},
      {name:"🪖・SQUADS",channels:["lfg","ranked-lfg","team-recruitment","scrims"]},
      {name:"🏆・COMPETITION",channels:["tournaments","match-results","leaderboard"]},{name:"🔊・VOICE",channels:["Lobby","Squad 1","Squad 2","Ranked","AFK"],voice:true},
      {name:"🛡️・STAFF",channels:["staff-chat","reports","mod-logs","match-logs"]}
    ]
  },
  {
    id:"sim-racing",name:"Sim Racing",category:"Gaming",accent:"#06B6D4",secondary:"#EF4444",surface:"#061217",tagline:"SIM RACING • LEAGUES • RACE CONTROL",
    roleNames:["🏎️・Driver","🏁・League Driver","👑・Team Principal","🎙️・Race Control","🔧・Engineer","📣・Race Ping"],roleColors:["#06B6D4","#F59E0B","#D4AF37","#EF4444","#8B5CF6","#22C55E"],
    sections:[
      {name:"👋・WELCOME",channels:["welcome","rules","league-info","announcements"],readOnly:true},
      {name:"🏎️・PADDOCK",channels:["general","setup-help","livery-showcase","clips"]},
      {name:"🏁・RACE WEEK",channels:["race-calendar","qualifying","race-results","standings"]},
      {name:"🔧・TEAMS",channels:["team-recruitment","driver-search","team-chat"]},{name:"🔊・VOICE",channels:["Lobby","Practice","Race Control","Team Radio","AFK"],voice:true},
      {name:"🛡️・STAFF",channels:["staff-chat","race-control","reports","mod-logs"]}
    ]
  },
  {
    id:"mmorpg-guild",name:"MMORPG Guild",category:"Gaming",accent:"#8B5CF6",secondary:"#F59E0B",surface:"#100A18",tagline:"GUILD • RAIDS • LOOT",
    roleNames:["⚔️・Adventurer","🛡️・Tank","💚・Healer","👑・Guild Officer","🏆・Raider","💎・Veteran"],roleColors:["#8B5CF6","#3B82F6","#22C55E","#F59E0B","#EF4444","#D4AF37"],
    sections:[
      {name:"👋・GUILD HALL",channels:["welcome","rules","guild-info","announcements"],readOnly:true},
      {name:"⚔️・ADVENTURE",channels:["general","builds","lore","screenshots"]},
      {name:"🏆・RAIDS",channels:["raid-planning","raid-signups","loot","raid-results"]},
      {name:"🤝・RECRUITMENT",channels:["looking-for-guild","applications","guild-recruitment"]},{name:"🔊・VOICE",channels:["Guild Hall","Raid 1","Raid 2","Strategy","AFK"],voice:true},
      {name:"🛡️・OFFICERS",channels:["officer-chat","reports","mod-logs"]}
    ]
  },
  {
    id:"esports-team",name:"Esports Team",category:"Gaming",accent:"#EF4444",secondary:"#06B6D4",surface:"#140607",tagline:"ESPORTS • TEAM • PERFORMANCE",
    roleNames:["🏆・Player","👑・Captain","🎯・Analyst","🎙️・Coach","📊・Staff","🥇・Champion"],roleColors:["#EF4444","#F59E0B","#06B6D4","#8B5CF6","#22C55E","#D4AF37"],
    sections:[
      {name:"🚀・TEAM HQ",channels:["welcome","rules","team-news","calendar"],readOnly:true},
      {name:"🎯・MATCH OPS",channels:["scrims","match-schedule","match-results","opponent-info"]},
      {name:"📊・PERFORMANCE",channels:["stats","vod-review","strategy","training"]},
      {name:"🎬・MEDIA",channels:["clips","highlights","content-ideas"]},{name:"🔊・VOICE",channels:["Team Room","Strategy","Scrim 1","Scrim 2","AFK"],voice:true},
      {name:"🛡️・STAFF",channels:["staff-room","match-ops","mod-logs"]}
    ]
  },
  {
    id:"anime-community",name:"Anime Community",category:"Anime",accent:"#EC4899",secondary:"#8B5CF6",surface:"#180A17",tagline:"ANIME • MANGA • WATCH PARTIES",
    roleNames:["🌸・Fan","🔥・Shonen Fan","✨・Collector","🎨・Artist","📚・Manga Reader","💎・VIP"],roleColors:["#EC4899","#EF4444","#F59E0B","#A855F7","#3B82F6","#D4AF37"],
    sections:[
      {name:"👋・WELCOME",channels:["welcome","rules","announcements","spoiler-guide"],readOnly:true},
      {name:"🌸・ANIME HUB",channels:["general","seasonal-anime","recommendations","memes"]},
      {name:"📚・MANGA",channels:["manga-chat","chapter-discussion","theories","collections"]},
      {name:"🎨・CREATIVE",channels:["fan-art","cosplay","edits","fan-fiction"]},{name:"🍿・WATCH PARTIES",channels:["watch-schedule","episode-chat","spoiler-zone"]},
      {name:"🔊・VOICE",channels:["Watch Party","Anime Lounge","Chill","AFK"],voice:true},{name:"🛡️・STAFF",channels:["staff-chat","reports","mod-logs"]}
    ]
  },
  {
    id:"kpop-fandom",name:"K-Pop Fandom",category:"Anime",accent:"#EC4899",secondary:"#06B6D4",surface:"#170A15",tagline:"K-POP • FANDOM • COMEBACKS",
    roleNames:["💜・Fan","💎・Collector","🎤・Stan","📸・Fan Photographer","🎨・Fan Artist","📣・Comeback Ping"],roleColors:["#A855F7","#06B6D4","#EC4899","#F59E0B","#22C55E","#EF4444"],
    sections:[
      {name:"👋・WELCOME",channels:["welcome","rules","announcements","bias-roles"],readOnly:true},
      {name:"🎤・FANDOM",channels:["general","bias-chat","comebacks","fan-projects"]},
      {name:"💿・MEDIA",channels:["photos","fan-art","edits","collections"]},{name:"📅・EVENTS",channels:["streaming-parties","watch-parties","giveaways"]},
      {name:"🌐・SOCIALS",channels:["social-links","fan-pages","community-links"],readOnly:true},{name:"🔊・VOICE",channels:["Fandom Lounge","Music Room","Watch Party","AFK"],voice:true},
      {name:"🛡️・STAFF",channels:["staff-chat","reports","mod-logs"]}
    ]
  },
  {
    id:"cyberpunk-rp",name:"Cyberpunk Roleplay",category:"Roleplay",accent:"#06B6D4",secondary:"#EC4899",surface:"#050F13",tagline:"NEON CITY • RP • FACTIONS",
    roleNames:["🧑‍💻・Netrunner","🔫・Merc","🏢・Corporate","🛠️・Fixer","🚓・Law","🎭・Character"],roleColors:["#06B6D4","#EF4444","#8B5CF6","#F59E0B","#3B82F6","#EC4899"],
    sections:[
      {name:"🌃・CITY GATE",channels:["welcome","rules","lore","announcements"],readOnly:true},
      {name:"🎭・CHARACTERS",channels:["character-creation","character-profiles","relationships"]},
      {name:"🌆・NIGHT CITY",channels:["rp-chat","jobs","factions","missions"]},
      {name:"🧬・NETRUN",channels:["netrunner-hub","tech","heists"]},{name:"🎬・SCENES",channels:["scene-requests","scene-logs","story-arcs"]},
      {name:"🔊・VOICE",channels:["Afterlife","Netrunners","Faction Room","RP Scene","AFK"],voice:true},{name:"🛡️・STAFF",channels:["gm-room","reports","appeals","mod-logs"]}
    ]
  },
  {
    id:"medieval-rp",name:"Medieval Roleplay",category:"Roleplay",accent:"#D4AF37",secondary:"#8B5CF6",surface:"#120D05",tagline:"KINGDOMS • LORE • ROLEPLAY",
    roleNames:["👑・Noble","⚔️・Knight","🧙・Mage","🏹・Ranger","🧑‍🌾・Commoner","📜・Lorekeeper"],roleColors:["#D4AF37","#64748B","#8B5CF6","#22C55E","#A16207","#06B6D4"],
    sections:[
      {name:"🏰・KINGDOM GATE",channels:["welcome","rules","world-lore","announcements"],readOnly:true},
      {name:"📜・LORE",channels:["history","factions","religions","maps"]},{name:"⚔️・ROLEPLAY",channels:["tavern","court","adventure-board","character-profiles"]},
      {name:"🏹・GUILDS",channels:["guild-recruitment","guild-chat","quests"]},{name:"🎉・EVENTS",channels:["kingdom-events","tournaments","feasts"]},
      {name:"🔊・VOICE",channels:["Tavern","Castle","Guild Hall","Story Room","AFK"],voice:true},{name:"🛡️・STAFF",channels:["gm-room","reports","appeals","mod-logs"]}
    ]
  },
  {
    id:"horror-rp",name:"Horror Roleplay",category:"Roleplay",accent:"#EF4444",secondary:"#8B5CF6",surface:"#090509",tagline:"HORROR • STORIES • SURVIVAL",
    roleNames:["🕯️・Survivor","👻・Haunted","🔦・Investigator","🩸・Dark Character","📖・Storyteller","💀・Veteran"],roleColors:["#F59E0B","#8B5CF6","#06B6D4","#EF4444","#EC4899","#64748B"],
    sections:[
      {name:"🕯️・WELCOME",channels:["welcome","rules","lore","content-warning"],readOnly:true},{name:"👻・HORROR HUB",channels:["general","creepypasta","urban-legends","theories"]},
      {name:"🎭・ROLEPLAY",channels:["character-creation","scenes","story-arcs","case-files"]},{name:"🔦・INVESTIGATION",channels:["clues","evidence","case-board"]},
      {name:"🎬・EVENTS",channels:["horror-nights","story-events","contests"]},{name:"🔊・VOICE",channels:["Haunted House","Investigation","Story Room","Campfire","AFK"],voice:true},
      {name:"🛡️・STAFF",channels:["gm-room","reports","appeals","mod-logs"]}
    ]
  },
  {
    id:"study-campus",name:"Study Campus",category:"Study",accent:"#3B82F6",secondary:"#22C55E",surface:"#06111A",tagline:"STUDY • FOCUS • COMMUNITY",
    roleNames:["📚・Student","🎓・Graduate","🧠・Study Mentor","🏆・Top Student","📝・Tutor","💎・VIP"],roleColors:["#3B82F6","#8B5CF6","#22C55E","#F59E0B","#06B6D4","#D4AF37"],
    sections:[
      {name:"🚀・START HERE",channels:["welcome","rules","announcements","introductions"],readOnly:true},{name:"📚・STUDY HALL",channels:["general","study-chat","questions","resources"]},
      {name:"📝・SUBJECTS",channels:["math","science","languages","programming"]},{name:"⏱️・FOCUS",channels:["study-sprints","accountability","goals"]},
      {name:"🎉・CAMPUS",channels:["events","study-groups","giveaways"]},{name:"🔊・VOICE",channels:["Study Hall","Focus Room","Break Room","AFK"],voice:true},
      {name:"🛡️・STAFF",channels:["staff-chat","reports","mod-logs"]}
    ]
  },
  {
    id:"programming-community",name:"Programming Community",category:"Tech",accent:"#06B6D4",secondary:"#8B5CF6",surface:"#061217",tagline:"CODE • BUILD • SHIP",
    roleNames:["💻・Developer","🧑‍💻・Engineer","🌱・Beginner","🚀・Builder","🔧・Open Source","💎・Expert"],roleColors:["#06B6D4","#8B5CF6","#22C55E","#F59E0B","#3B82F6","#D4AF37"],
    sections:[
      {name:"👋・WELCOME",channels:["welcome","rules","announcements","introductions"],readOnly:true},{name:"💻・CODE",channels:["general","help","code-review","debugging"]},
      {name:"🧰・TECH STACK",channels:["javascript","python","web-dev","mobile-dev"]},{name:"🚀・PROJECTS",channels:["project-showcase","collaboration","job-board","open-source"]},
      {name:"📚・LEARNING",channels:["resources","tutorials","study-groups"]},{name:"🔊・VOICE",channels:["Coding Room","Study Room","Pair Programming","Chill","AFK"],voice:true},
      {name:"🛡️・STAFF",channels:["staff-chat","reports","mod-logs"]}
    ]
  },
  {
    id:"ai-tech-hub",name:"AI & Tech Hub",category:"Tech",accent:"#8B5CF6",secondary:"#06B6D4",surface:"#0C0714",tagline:"AI • TECH • BUILDERS",
    roleNames:["🤖・AI Builder","🧠・Researcher","💻・Developer","🎨・AI Creator","🚀・Founder","💎・Expert"],roleColors:["#8B5CF6","#06B6D4","#3B82F6","#EC4899","#F59E0B","#D4AF37"],
    sections:[
      {name:"🚀・START HERE",channels:["welcome","rules","announcements","introductions"],readOnly:true},{name:"🤖・AI LAB",channels:["ai-chat","prompting","models","ai-news"]},
      {name:"💻・BUILDERS",channels:["coding","projects","debugging","showcase"]},{name:"🧠・RESEARCH",channels:["papers","research-chat","resources"]},
      {name:"🎨・CREATORS",channels:["ai-art","video","automation","workflows"]},{name:"🔊・VOICE",channels:["AI Lounge","Build Room","Research Room","AFK"],voice:true},
      {name:"🛡️・STAFF",channels:["staff-chat","reports","mod-logs"]}
    ]
  },
  {
    id:"open-source","name":"Open Source Project",category:"Tech",accent:"#22C55E",secondary:"#3B82F6",surface:"#06130A",tagline:"OPEN SOURCE • COLLAB • SHIP",
    roleNames:["🧑‍💻・Contributor","🛠️・Maintainer","🐛・Bug Hunter","📝・Docs","⭐・Core Team","🤝・Partner"],roleColors:["#22C55E","#3B82F6","#EF4444","#06B6D4","#D4AF37","#A855F7"],
    sections:[
      {name:"🚀・PROJECT",channels:["welcome","rules","roadmap","announcements"],readOnly:true},{name:"🧑‍💻・DEVELOPMENT",channels:["general","issues","pull-requests","architecture"]},
      {name:"🐛・QUALITY",channels:["bug-reports","testing","feature-requests"]},{name:"📚・DOCS",channels:["documentation","tutorials","faq"]},
      {name:"🤝・COMMUNITY",channels:["showcase","contributors","events"]},{name:"🔊・VOICE",channels:["Dev Room","Maintainer Room","Community","AFK"],voice:true},
      {name:"🛡️・STAFF",channels:["maintainers","mod-logs","bot-logs"]}
    ]
  },
  {
    id:"startup-hub",name:"Startup Hub",category:"Business",accent:"#F59E0B",secondary:"#06B6D4",surface:"#140D03",tagline:"STARTUPS • FOUNDERS • GROWTH",
    roleNames:["🚀・Founder","💼・Operator","🧑‍💻・Developer","🎨・Designer","📈・Investor","🤝・Partner"],roleColors:["#F59E0B","#3B82F6","#06B6D4","#EC4899","#22C55E","#A855F7"],
    sections:[
      {name:"🚀・START HERE",channels:["welcome","rules","announcements","introductions"],readOnly:true},{name:"💡・IDEAS",channels:["idea-lab","feedback","market-research","validation"]},
      {name:"🏗️・BUILD",channels:["product","engineering","design","growth"]},{name:"🤝・NETWORK",channels:["introductions","collabs","jobs","partnerships"]},
      {name:"🎤・EVENTS",channels:["founder-events","pitch-night","community-events"]},{name:"🔊・VOICE",channels:["Founder Lounge","Build Room","Networking","AFK"],voice:true},
      {name:"🛡️・STAFF",channels:["staff-room","reports","mod-logs"]}
    ]
  },
  {
    id:"freelancer-network",name:"Freelancer Network",category:"Business",accent:"#06B6D4",secondary:"#F59E0B",surface:"#061217",tagline:"FREELANCE • CLIENTS • WORK",
    roleNames:["💼・Freelancer","🎨・Designer","💻・Developer","✍️・Writer","📈・Marketer","🤝・Client"],roleColors:["#06B6D4","#EC4899","#3B82F6","#A855F7","#22C55E","#F59E0B"],
    sections:[
      {name:"👋・WELCOME",channels:["welcome","rules","announcements","introductions"],readOnly:true},{name:"💼・WORK",channels:["general","job-board","project-help","pricing-talk"]},
      {name:"🎨・SERVICES",channels:["design","development","writing","marketing"]},{name:"🤝・NETWORK",channels:["portfolio","collaborations","referrals"]},
      {name:"📚・RESOURCES",channels:["tools","contracts","business-tips"]},{name:"🔊・VOICE",channels:["Freelancer Lounge","Client Room","Networking","AFK"],voice:true},
      {name:"🛡️・STAFF",channels:["staff-chat","reports","mod-logs"]}
    ]
  },
  {
    id:"music-producer",name:"Music Producer Hub",category:"Music",accent:"#8B5CF6",secondary:"#06B6D4",surface:"#0C0714",tagline:"BEATS • PRODUCTION • COLLAB",
    roleNames:["🎹・Producer","🎤・Vocalist","🎸・Musician","🎚️・Engineer","🎧・DJ","💎・Verified Artist"],roleColors:["#8B5CF6","#EC4899","#F59E0B","#06B6D4","#3B82F6","#D4AF37"],
    sections:[
      {name:"👋・WELCOME",channels:["welcome","rules","announcements","introductions"],readOnly:true},{name:"🎹・STUDIO",channels:["general","production","mixing","mastering"]},
      {name:"🎤・COLLABS",channels:["collab-board","vocalists","producers","feedback"]},{name:"🎧・SHOWCASE",channels:["new-releases","beats","music-videos","playlists"]},
      {name:"📚・RESOURCES",channels:["samples","plugins","tutorials"]},{name:"🔊・VOICE",channels:["Studio A","Studio B","Listening Room","Chill","AFK"],voice:true},
      {name:"🛡️・STAFF",channels:["staff-chat","reports","mod-logs"]}
    ]
  },
  {
    id:"dj-nightlife",name:"DJ & Nightlife",category:"Music",accent:"#EC4899",secondary:"#8B5CF6",surface:"#180A17",tagline:"DJ • EVENTS • NIGHTLIFE",
    roleNames:["🎧・DJ","🎤・Artist","🪩・Party Host","🎚️・Producer","⭐・Resident","📣・Event Ping"],roleColors:["#EC4899","#8B5CF6","#F59E0B","#06B6D4","#D4AF37","#EF4444"],
    sections:[
      {name:"🌃・WELCOME",channels:["welcome","rules","announcements","introductions"],readOnly:true},{name:"🎧・MUSIC",channels:["general","track-share","mixes","new-music"]},
      {name:"🪩・NIGHTLIFE",channels:["event-calendar","venue-chat","party-planning"]},{name:"🎤・ARTISTS",channels:["artist-showcase","collabs","promotions"]},
      {name:"🎁・EVENTS",channels:["events","giveaways","guest-list"]},{name:"🔊・VOICE",channels:["Main Room","DJ Booth","Lounge","After Party","AFK"],voice:true},
      {name:"🛡️・STAFF",channels:["staff-chat","reports","mod-logs"]}
    ]
  },
  {
    id:"sports-fans",name:"Sports Fans",category:"Sports",accent:"#3B82F6",secondary:"#EF4444",surface:"#06101A",tagline:"SPORTS • MATCHDAY • COMMUNITY",
    roleNames:["🏟️・Fan","🔥・Ultra","📊・Analyst","🎙️・Commentator","🏆・Champion","📣・Matchday Ping"],roleColors:["#3B82F6","#EF4444","#06B6D4","#F59E0B","#D4AF37","#22C55E"],
    sections:[
      {name:"🏟️・WELCOME",channels:["welcome","rules","announcements","team-roles"],readOnly:true},{name:"💬・FAN ZONE",channels:["general","match-chat","memes","hot-takes"]},
      {name:"📊・ANALYSIS",channels:["stats","predictions","lineups","highlights"]},{name:"🏆・MATCHDAY",channels:["schedule","results","standings","events"]},
      {name:"📸・MEDIA",channels:["photos","clips","fan-art"]},{name:"🔊・VOICE",channels:["Fan Lounge","Matchday","Analysis Room","AFK"],voice:true},
      {name:"🛡️・STAFF",channels:["staff-chat","reports","mod-logs"]}
    ]
  },
  {
    id:"soccer-community",name:"Soccer Community",category:"Sports",accent:"#22C55E",secondary:"#3B82F6",surface:"#06130A",tagline:"FOOTBALL • MATCHDAY • LFG",
    roleNames:["⚽・Supporter","🏆・Player","🧠・Tactician","🎙️・Commentator","⭐・Captain","📣・Match Ping"],roleColors:["#22C55E","#3B82F6","#8B5CF6","#F59E0B","#D4AF37","#EF4444"],
    sections:[
      {name:"⚽・WELCOME",channels:["welcome","rules","announcements","team-roles"],readOnly:true},{name:"🏟️・MATCHDAY",channels:["match-chat","fixtures","results","standings"]},
      {name:"🧠・TACTICS",channels:["tactics","lineups","player-talk","stats"]},{name:"👥・PLAYERS",channels:["looking-for-group","pickup-games","team-recruitment"]},
      {name:"🎉・EVENTS",channels:["watch-parties","tournaments","giveaways"]},{name:"🔊・VOICE",channels:["Matchday","Tactics","Team Room","Chill","AFK"],voice:true},
      {name:"🛡️・STAFF",channels:["staff-chat","reports","mod-logs"]}
    ]
  },
  {
    id:"fitness-community",name:"Fitness Community",category:"Lifestyle",accent:"#22C55E",secondary:"#06B6D4",surface:"#06130A",tagline:"FITNESS • ACCOUNTABILITY • PROGRESS",
    roleNames:["🏋️・Athlete","🏃・Runner","🧘・Wellness","🥇・Coach","🔥・Accountability","💎・VIP"],roleColors:["#22C55E","#06B6D4","#8B5CF6","#F59E0B","#EF4444","#D4AF37"],
    sections:[
      {name:"🌱・START HERE",channels:["welcome","rules","announcements","introductions"],readOnly:true},{name:"🏋️・TRAINING",channels:["general","workouts","form-check","gym-talk"]},
      {name:"🥗・LIFESTYLE",channels:["nutrition","meal-prep","sleep","habits"]},{name:"🔥・ACCOUNTABILITY",channels:["daily-check-in","goals","progress","challenges"]},
      {name:"🎉・COMMUNITY",channels:["events","meetups","challenges"]},{name:"🔊・VOICE",channels:["Gym Lounge","Coach Room","Focus Room","AFK"],voice:true},
      {name:"🛡️・STAFF",channels:["staff-chat","reports","mod-logs"]}
    ]
  },
  {
    id:"book-club",name:"Book Club",category:"Community",accent:"#A855F7",secondary:"#F59E0B",surface:"#100A16",tagline:"BOOKS • DISCUSSION • READING",
    roleNames:["📚・Reader","✍️・Writer","🧠・Reviewer","🏆・Bookworm","📝・Club Host","💎・VIP Reader"],roleColors:["#A855F7","#EC4899","#06B6D4","#F59E0B","#22C55E","#D4AF37"],
    sections:[
      {name:"📖・WELCOME",channels:["welcome","rules","announcements","club-info"],readOnly:true},{name:"📚・BOOK CLUB",channels:["general","currently-reading","reviews","recommendations"]},
      {name:"🧠・DISCUSSION",channels:["chapter-chat","character-talk","theories","spoilers"]},{name:"✍️・CREATIVE",channels:["writing-corner","fan-fiction","book-art"]},
      {name:"🏆・CHALLENGES",channels:["reading-challenge","monthly-pick","giveaways"]},{name:"🔊・VOICE",channels:["Book Club","Reading Room","Discussion","AFK"],voice:true},
      {name:"🛡️・STAFF",channels:["staff-chat","reports","mod-logs"]}
    ]
  },
  {
    id:"movie-club",name:"Movie & TV Club",category:"Community",accent:"#EF4444",secondary:"#8B5CF6",surface:"#150708",tagline:"MOVIES • SERIES • WATCH PARTIES",
    roleNames:["🎬・Viewer","🍿・Movie Buff","📺・Series Fan","🎥・Filmmaker","📝・Critic","💎・VIP"],roleColors:["#EF4444","#F59E0B","#8B5CF6","#06B6D4","#22C55E","#D4AF37"],
    sections:[
      {name:"🎬・WELCOME",channels:["welcome","rules","announcements","spoiler-rules"],readOnly:true},{name:"🍿・DISCUSSION",channels:["general","movie-talk","series-talk","recommendations"]},
      {name:"📝・REVIEWS",channels:["reviews","ratings","theories","film-analysis"]},{name:"🎥・CREATORS",channels:["filmmaking","screenwriting","editing"]},
      {name:"📅・WATCH PARTIES",channels:["schedule","watch-chat","events"]},{name:"🔊・VOICE",channels:["Cinema","Watch Party","Critics Room","AFK"],voice:true},
      {name:"🛡️・STAFF",channels:["staff-chat","reports","mod-logs"]}
    ]
  },
  {
    id:"photography",name:"Photography Community",category:"Art",accent:"#06B6D4",secondary:"#F59E0B",surface:"#061217",tagline:"PHOTOGRAPHY • SHOWCASE • CRITIQUE",
    roleNames:["📷・Photographer","🎞️・Film Shooter","🖼️・Editor","🌟・Featured Artist","🧑‍🏫・Mentor","📣・Challenge Ping"],roleColors:["#06B6D4","#F59E0B","#8B5CF6","#D4AF37","#22C55E","#EC4899"],
    sections:[
      {name:"📸・WELCOME",channels:["welcome","rules","announcements","introductions"],readOnly:true},{name:"📷・SHOWCASE",channels:["photo-showcase","street","portrait","landscape"]},
      {name:"📝・CRITIQUE",channels:["feedback","editing-help","gear-talk"]},{name:"🎨・CREATIVE",channels:["photo-challenges","projects","collabs"]},
      {name:"📚・LEARNING",channels:["tutorials","resources","composition"]},{name:"🔊・VOICE",channels:["Photo Lounge","Critique Room","Editing Room","AFK"],voice:true},
      {name:"🛡️・STAFF",channels:["staff-chat","reports","mod-logs"]}
    ]
  },
  {
    id:"digital-art",name:"Digital Art Community",category:"Art",accent:"#EC4899",secondary:"#8B5CF6",surface:"#180A17",tagline:"DIGITAL ART • SHOWCASE • CREATE",
    roleNames:["🎨・Artist","🖌️・Illustrator","🧑‍💻・3D Artist","✨・Featured Artist","🧑‍🏫・Mentor","💎・Verified Artist"],roleColors:["#EC4899","#8B5CF6","#06B6D4","#F59E0B","#22C55E","#D4AF37"],
    sections:[
      {name:"🎨・WELCOME",channels:["welcome","rules","announcements","introductions"],readOnly:true},{name:"🖼️・SHOWCASE",channels:["art-showcase","wips","finished-work","sketches"]},
      {name:"📝・CRITIQUE",channels:["feedback","art-help","portfolio-review"]},{name:"🤝・COLLABS",channels:["collab-board","commissions","projects"]},
      {name:"📚・LEARNING",channels:["tutorials","resources","software-help"]},{name:"🔊・VOICE",channels:["Art Lounge","Drawing Room","Critique","AFK"],voice:true},
      {name:"🛡️・STAFF",channels:["staff-chat","reports","mod-logs"]}
    ]
  },
  {
    id:"fashion-style",name:"Fashion & Style",category:"Lifestyle",accent:"#EC4899",secondary:"#D4AF37",surface:"#180A12",tagline:"FASHION • STYLE • SHOWCASE",
    roleNames:["👗・Fashion Lover","🧥・Streetwear","💎・Collector","📸・Style Creator","🧵・Designer","⭐・Featured"],roleColors:["#EC4899","#3B82F6","#D4AF37","#8B5CF6","#F59E0B","#22C55E"],
    sections:[
      {name:"✨・WELCOME",channels:["welcome","rules","announcements","introductions"],readOnly:true},{name:"👗・STYLE",channels:["general","outfit-check","streetwear","inspiration"]},
      {name:"💎・COLLECTORS",channels:["collections","rare-finds","trades"]},{name:"🧵・CREATORS",channels:["designers","customs","projects"]},
      {name:"📸・SHOWCASE",channels:["fits","photography","editorials"]},{name:"🔊・VOICE",channels:["Style Lounge","Chill","Shopping Talk","AFK"],voice:true},
      {name:"🛡️・STAFF",channels:["staff-chat","reports","mod-logs"]}
    ]
  },
  {
    id:"travel-community",name:"Travel Community",category:"Lifestyle",accent:"#06B6D4",secondary:"#22C55E",surface:"#061515",tagline:"TRAVEL • GUIDES • ADVENTURES",
    roleNames:["✈️・Traveler","🗺️・Explorer","📸・Travel Creator","🧳・Nomad","🧑‍💼・Travel Pro","💎・VIP Traveler"],roleColors:["#06B6D4","#22C55E","#EC4899","#F59E0B","#8B5CF6","#D4AF37"],
    sections:[
      {name:"✈️・WELCOME",channels:["welcome","rules","announcements","introductions"],readOnly:true},{name:"🗺️・DESTINATIONS",channels:["general","usa","caribbean","europe"]},
      {name:"🧳・PLANNING",channels:["trip-planning","itineraries","budget-travel","packing"]},{name:"📸・TRAVEL MEDIA",channels:["photos","videos","food","hidden-gems"]},
      {name:"🤝・MEETUPS",channels:["events","travel-buddies","local-meetups"]},{name:"🔊・VOICE",channels:["Travel Lounge","Planning Room","Nomad Room","AFK"],voice:true},
      {name:"🛡️・STAFF",channels:["staff-chat","reports","mod-logs"]}
    ]
  },
  {
    id:"food-community",name:"Food & Cooking",category:"Lifestyle",accent:"#F97316",secondary:"#22C55E",surface:"#160A04",tagline:"FOOD • RECIPES • COMMUNITY",
    roleNames:["👨‍🍳・Chef","🍳・Home Cook","🍰・Baker","🌶️・Foodie","📸・Food Creator","💎・VIP Foodie"],roleColors:["#F97316","#22C55E","#EC4899","#EF4444","#8B5CF6","#D4AF37"],
    sections:[
      {name:"🍴・WELCOME",channels:["welcome","rules","announcements","introductions"],readOnly:true},{name:"🍳・KITCHEN",channels:["general","recipes","meal-prep","cooking-help"]},
      {name:"🍰・BAKERY",channels:["baking","desserts","bread","decorating"]},{name:"🌶️・FOODIE",channels:["restaurant-talk","food-reviews","food-photos"]},
      {name:"🏆・EVENTS",channels:["cook-offs","recipe-challenges","giveaways"]},{name:"🔊・VOICE",channels:["Kitchen","Dinner Table","Cooking Room","AFK"],voice:true},
      {name:"🛡️・STAFF",channels:["staff-chat","reports","mod-logs"]}
    ]
  },
  {
    id:"podcast-community",name:"Podcast Community",category:"Streaming",accent:"#EF4444",secondary:"#8B5CF6",surface:"#160708",tagline:"PODCAST • EPISODES • COMMUNITY",
    roleNames:["🎙️・Listener","🎤・Host","🎚️・Producer","📝・Writer","🎧・Guest","⭐・VIP Listener"],roleColors:["#8B5CF6","#EF4444","#06B6D4","#F59E0B","#22C55E","#D4AF37"],
    sections:[
      {name:"🎙️・WELCOME",channels:["welcome","rules","announcements","introductions"],readOnly:true},{name:"🎧・LISTENERS",channels:["general","episode-chat","recommendations","feedback"]},
      {name:"🎤・PRODUCTION",channels:["episode-planning","recording","editing","show-notes"]},{name:"🤝・GUESTS",channels:["guest-ideas","guest-requests","collabs"]},
      {name:"📅・SHOW",channels:["release-calendar","live-recordings","giveaways"]},{name:"🔊・VOICE",channels:["Recording Room","Producer Room","Lounge","AFK"],voice:true},
      {name:"🛡️・STAFF",channels:["staff-chat","production","mod-logs"]}
    ]
  },
  {
    id:"streamer-team",name:"Streamer Team",category:"Streaming",accent:"#9146FF",secondary:"#EC4899",surface:"#130817",tagline:"STREAM • TEAM • CONTENT",
    roleNames:["🔴・Streamer","🎬・Editor","🖼️・Designer","🛡️・Moderator","📈・Manager","💎・VIP"],roleColors:["#9146FF","#EC4899","#06B6D4","#3B82F6","#F59E0B","#D4AF37"],
    sections:[
      {name:"🔴・LIVE OPS",channels:["welcome","rules","stream-schedule","announcements"],readOnly:true},{name:"🎬・CONTENT",channels:["content-plan","clips","highlights","thumbnails"]},
      {name:"🤝・COLLABS",channels:["collab-board","creator-chat","sponsors"]},{name:"📈・GROWTH",channels:["analytics","ideas","campaigns"]},
      {name:"🎉・COMMUNITY",channels:["events","giveaways","fan-projects"]},{name:"🔊・VOICE",channels:["Team Lounge","Recording","Planning","AFK"],voice:true},
      {name:"🛡️・STAFF",channels:["management","reports","mod-logs"]}
    ]
  },
  {
    id:"creator-agency",name:"Creator Agency",category:"Creator",accent:"#06B6D4",secondary:"#EC4899",surface:"#07151A",tagline:"CREATORS • CLIENTS • CAMPAIGNS",
    roleNames:["🎨・Creator","💼・Account Manager","✂️・Editor","🖌️・Designer","📈・Strategist","🤝・Client"],roleColors:["#EC4899","#06B6D4","#8B5CF6","#F59E0B","#22C55E","#D4AF37"],
    sections:[
      {name:"🚀・AGENCY",channels:["welcome","rules","announcements","agency-info"],readOnly:true},{name:"🎨・CREATORS",channels:["creator-chat","showcase","availability","feedback"]},
      {name:"💼・CLIENTS",channels:["client-intake","project-chat","approvals","deliverables"]},{name:"📁・PROJECTS",channels:["project-board","campaigns","deadlines","assets"]},
      {name:"📈・GROWTH",channels:["ideas","analytics","resources"]},{name:"🔊・VOICE",channels:["Agency Lounge","Client Room","Project Room","AFK"],voice:true},
      {name:"🛡️・STAFF",channels:["management","reports","mod-logs"]}
    ]
  },
  {
    id:"chill-aesthetic",name:"Aesthetic Chill",category:"Friends",accent:"#A855F7",secondary:"#EC4899",surface:"#100A16",tagline:"AESTHETIC • CHILL • FRIENDS",
    roleNames:["🌸・Bestie","💜・Close Friend","🎮・Gamer","🎨・Creative","⭐・OG","💎・VIP"],roleColors:["#EC4899","#A855F7","#22C55E","#06B6D4","#F59E0B","#D4AF37"],
    sections:[
      {name:"🌸・WELCOME",channels:["welcome","rules","announcements","introductions"],readOnly:true},{name:"☕・HANGOUT",channels:["general","random","memes","photos","music"]},
      {name:"🎨・CREATIVE",channels:["art","edits","outfits","showcase"]},{name:"🎮・GAMING",channels:["gaming-chat","lfg","clips","game-night"]},
      {name:"🎉・EVENTS",channels:["events","movie-night","giveaways"]},{name:"🔊・VOICE",channels:["Lounge","Chill 1","Chill 2","Gaming","Music","AFK"],voice:true},
      {name:"🛡️・STAFF",channels:["staff-chat","reports","mod-logs"]}
    ]
  },
  {
    id:"gothic-community",name:"Gothic Community",category:"Community",accent:"#8B5CF6",secondary:"#EF4444",surface:"#08050A",tagline:"GOTHIC • NIGHT • COMMUNITY",
    roleNames:["🖤・Night Owl","🥀・Goth","🕯️・Dark Academia","🎨・Artist","🎸・Alt","💎・VIP"],roleColors:["#8B5CF6","#EF4444","#F59E0B","#EC4899","#06B6D4","#D4AF37"],
    sections:[
      {name:"🕯️・WELCOME",channels:["welcome","rules","announcements","introductions"],readOnly:true},{name:"🖤・THE LOUNGE",channels:["general","late-night","memes","music"]},
      {name:"🥀・AESTHETIC",channels:["outfits","art","photography","inspiration"]},{name:"🎸・MUSIC",channels:["music-chat","recommendations","showcase"]},
      {name:"🌙・EVENTS",channels:["events","watch-parties","giveaways"]},{name:"🔊・VOICE",channels:["Night Lounge","Music Room","Chill","AFK"],voice:true},
      {name:"🛡️・STAFF",channels:["staff-chat","reports","mod-logs"]}
    ]
  },
  {
    id:"coquette-community",name:"Coquette Community",category:"Friends",accent:"#EC4899",secondary:"#F9A8D4",surface:"#1A0A12",tagline:"COQUETTE • SOFT • SOCIAL",
    roleNames:["🎀・Bestie","🌸・Sweetheart","💄・Fashionista","🎨・Creative","⭐・Favorite","💎・VIP"],roleColors:["#EC4899","#F9A8D4","#A855F7","#06B6D4","#F59E0B","#D4AF37"],
    sections:[
      {name:"🎀・WELCOME",channels:["welcome","rules","announcements","introductions"],readOnly:true},{name:"💗・SOCIAL",channels:["general","daily-chat","memes","selfies"]},
      {name:"💄・STYLE",channels:["outfits","beauty","fashion","inspiration"]},{name:"🎨・CREATIVE",channels:["art","edits","photography","showcase"]},
      {name:"🎀・EVENTS",channels:["events","movie-night","giveaways"]},{name:"🔊・VOICE",channels:["Lounge","Besties","Music","AFK"],voice:true},
      {name:"🛡️・STAFF",channels:["staff-chat","reports","mod-logs"]}
    ]
  },
  {
    id:"language-learning",name:"Language Learning",category:"Study",accent:"#3B82F6",secondary:"#22C55E",surface:"#06101A",tagline:"LANGUAGES • PRACTICE • FRIENDS",
    roleNames:["🗣️・Learner","🎓・Advanced","🧑‍🏫・Tutor","🌎・Polyglot","✍️・Writer","💎・Fluent"],roleColors:["#3B82F6","#8B5CF6","#22C55E","#F59E0B","#EC4899","#D4AF37"],
    sections:[
      {name:"🌎・WELCOME",channels:["welcome","rules","announcements","introductions"],readOnly:true},{name:"🗣️・PRACTICE",channels:["general","english","spanish","other-languages"]},
      {name:"📚・LEARNING",channels:["grammar","vocabulary","resources","questions"]},{name:"🎙️・SPEAKING",channels:["conversation","pronunciation","voice-practice"]},
      {name:"🏆・CHALLENGES",channels:["daily-challenge","weekly-goals","events"]},{name:"🔊・VOICE",channels:["English Room","Spanish Room","Practice Room","AFK"],voice:true},
      {name:"🛡️・STAFF",channels:["staff-chat","reports","mod-logs"]}
    ]
  }
];

const templates:ServerTemplate[] = [...baseTemplates,...[...curatedConfigs,...catalogConfigs].map(catalogTemplate)].map(enrichTemplate);

/** Hand-picked 2026 templates, highlighted as new in the gallery. */
export const CURATED_TEMPLATE_IDS = new Set(curatedConfigs.map(c=>c.id));

export const SERVER_TEMPLATES = templates;
export const TEMPLATE_CATEGORIES: TemplateCategory[] = ["Gaming","Roleplay","Community","Streaming","Friends","Creator","Anime","Tech","Study","Music","Sports","Business","Art","Lifestyle"];
export function getServerTemplate(id:string):ServerTemplate {
 return SERVER_TEMPLATES.find(t=>t.id===id) ?? SERVER_TEMPLATES[0];
}
