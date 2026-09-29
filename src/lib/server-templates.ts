import type { CategorySpec, RoleSpec } from "./livenest-blueprint";

export type TemplateCategory = "Gaming" | "Roleplay" | "Community" | "Streaming" | "Friends" | "Creator";

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

const templates: ServerTemplate[] = [
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

export const SERVER_TEMPLATES = templates;
export const TEMPLATE_CATEGORIES: TemplateCategory[] = ["Gaming","Roleplay","Community","Streaming","Friends","Creator"];
export function getServerTemplate(id:string):ServerTemplate {
 return SERVER_TEMPLATES.find(t=>t.id===id) ?? SERVER_TEMPLATES[0];
}
