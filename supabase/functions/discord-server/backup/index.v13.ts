import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const C={"access-control-allow-origin":"*","access-control-allow-headers":"authorization,content-type","access-control-allow-methods":"GET,POST,OPTIONS"};
const json=(data:any,status=200)=>new Response(JSON.stringify(data),{status,headers:{"content-type":"application/json",...C}});
const b64=(s:string)=>atob(s.replaceAll("-","+").replaceAll("_","/")+"===".slice((s.length+3)%4));
const secret=()=>{const k=JSON.parse(Deno.env.get("SUPABASE_SECRET_KEYS")||"{}");return k.default||Deno.env.get("APP_SESSION_SECRET")||""};
async function auth(req:Request){
 const token=(req.headers.get("authorization")||"").replace(/^Bearer\s+/i,""),[a,b]=token.split(".");
 if(!a||!b)throw Error("unauthorized");
 const key=await crypto.subtle.importKey("raw",new TextEncoder().encode(secret()),{name:"HMAC",hash:"SHA-256"},false,["verify"]);
 if(!await crypto.subtle.verify("HMAC",key,Uint8Array.from(b64(b),c=>c.charCodeAt(0)),new TextEncoder().encode(a)))throw Error("unauthorized");
 const p=JSON.parse(b64(a));if(!p.exp||p.exp<Date.now())throw Error("session_expired");return p;
}
const db=()=>createClient(Deno.env.get("SUPABASE_URL")!,JSON.parse(Deno.env.get("SUPABASE_SECRET_KEYS")||"{}").default);
const dc=async(path:string,init:any={})=>{const r=await fetch("https://discord.com/api/v10"+path,{...init,headers:{...(init.headers||{}),authorization:`Bot ${Deno.env.get("DISCORD_BOT_TOKEN")}`,"content-type":"application/json"}});return{ok:r.ok,status:r.status,data:await r.json().catch(()=>null)}};
const display=(x:any,l:string)=>l==="es"?x.es:l==="en"?x.en:`${x.en}・${x.es}`;
const BOT_PERMISSIONS={MANAGE_CHANNELS:1n<<4n,VIEW_CHANNEL:1n<<10n,SEND_MESSAGES:1n<<11n,MANAGE_ROLES:1n<<28n};
const hasPermission=(permissions:string|number|bigint,bit:bigint)=> (BigInt(permissions)&bit)===bit;

Deno.serve(async(req)=>{
 if(req.method==="OPTIONS")return new Response(null,{status:204,headers:C});
 try{
  const u=new URL(req.url),action=u.searchParams.get("action")||"guilds",s=db();

  // Public catalog. The catalog is the single source of truth for templates.
  if(action==="templates"){
   const {data,error}=await s.from("template_catalog").select("id,name,category,description,definition").eq("enabled",true).order("name");
   if(error) return json({error:"template_catalog_failed"},500);
   return json({templates:data||[]});
  }

  const user=await auth(req);

  if(action==="guilds"){
   const {data:rows,error}=await s.from("discord_installations").select("*").eq("discord_user_id",user.sub);
   if(error)return json({error:"database_error"},500);
   // Check each manageable guild directly against the bot membership endpoint.
   // This avoids relying on the bot guild-list cache after a fresh invite.
   const botUser=await dc("/users/@me");
   if(!botUser.ok||!botUser.data?.id)return json({error:"bot_membership_check_failed",details:botUser.data},502);
   const now=new Date().toISOString();
   const guilds=await Promise.all((rows||[]).map(async(g:any)=>{
    const member=await dc(`/guilds/${g.guild_id}/members/${botUser.data.id}`);
    const present=member.ok;
    await s.from("discord_installations").update({bot_present:present,last_scanned_at:now}).eq("id",g.id);
    return {...g,bot_present:present};
   }));
   return json({guilds});
  }

  const id=u.searchParams.get("guild_id");
  if(action==="scan"){
   if(!id)return json({error:"guild_id_required"},400);
   const {data:inst}=await s.from("discord_installations").select("*").eq("discord_user_id",user.sub).eq("guild_id",id).maybeSingle();
   if(!inst)return json({error:"server_not_authorized"},403);
   const [g,c,r]=await Promise.all([dc(`/guilds/${id}`),dc(`/guilds/${id}/channels`),dc(`/guilds/${id}/roles`)]);
   if(!g.ok)return json({error:"bot_not_installed"},409);
   await s.from("discord_installations").update({bot_present:true,last_scanned_at:new Date().toISOString()}).eq("id",inst.id);
   return json({guild:g.data,channels:c.data||[],roles:r.data||[]});
  }

  if(action==="install"){
   const body=await req.json().catch(()=>null);
   const guildId=body?.guild_id,templateId=body?.template_id,language=body?.language||"both";
   if(!guildId||!templateId)return json({error:"invalid_install_request"},400);
   if(!["en","es","both"].includes(language))return json({error:"invalid_language"},400);

   const {data:inst}=await s.from("discord_installations").select("*").eq("discord_user_id",user.sub).eq("guild_id",guildId).maybeSingle();
   if(!inst)return json({error:"server_not_authorized"},403);

   const live=await dc(`/guilds/${guildId}`);
   if(!live.ok){await s.from("discord_installations").update({bot_present:false}).eq("id",inst.id);return json({error:"bot_not_installed"},409)}

   // Preflight: verify the bot can create/manage channels and roles before mutating the server.
   const botUser=await dc("/users/@me");
   const [botMember,botRoles]=await Promise.all([
     botUser.ok&&botUser.data?.id ? dc(`/guilds/${guildId}/members/${botUser.data.id}`) : Promise.resolve({ok:false,status:500,data:null}),
     dc(`/guilds/${guildId}/roles`)
   ]);
   if(!botUser.ok||!botMember.ok||!botRoles.ok){
     return json({error:"bot_permission_check_failed",details:{user:botUser.data,member:botMember.data,roles:botRoles.data}},502);
   }
   const guildRoles=botRoles.data||[];
   const everyoneRole=guildRoles.find((r:any)=>r.id===guildId);
   let effectivePermissions=BigInt(everyoneRole?.permissions||"0");
   for(const role of guildRoles){
     if((botMember.data?.roles||[]).includes(role.id)) effectivePermissions|=BigInt(role.permissions||"0");
   }
   const isAdministrator=(effectivePermissions&(1n<<3n))!==0n;
   const missing:string[]=[];
   if(!isAdministrator&&!hasPermission(effectivePermissions,BOT_PERMISSIONS.MANAGE_CHANNELS)) missing.push("MANAGE_CHANNELS");
   if(!isAdministrator&&!hasPermission(effectivePermissions,BOT_PERMISSIONS.MANAGE_ROLES)) missing.push("MANAGE_ROLES");
   if(missing.length){
     return json({
       error:"bot_missing_permissions",
       missing,
       required:["MANAGE_CHANNELS","MANAGE_ROLES"],
       message:"LiveNest Bot no tiene los permisos necesarios. Vuelve a autorizarlo con Gestionar canales y Gestionar roles."
     },403);
   }

   const {data:t,error:templateError}=await s.from("template_catalog").select("*").eq("id",templateId).eq("enabled",true).maybeSingle();
   if(templateError)return json({error:"template_catalog_failed"},500);
   if(!t)return json({error:"template_not_found"},404);

   const [cr,rr]=await Promise.all([dc(`/guilds/${guildId}/channels`),dc(`/guilds/${guildId}/roles`)]);
   if(!cr.ok||!rr.ok)return json({error:"discord_scan_failed",details:{channels:cr.data,roles:rr.data}},500);

   const existingChannels=cr.data||[],existingRoles=rr.data||[];
   const definition=t.definition||{};
   const categories=definition.categories||[],channels=definition.channels||[],roles=definition.roles||[];
   const created:any[]=[];
   const createdDiscord:{type:string,id:string}[]=[];

   const rollback=async()=>{
    for(const x of [...createdDiscord].reverse()){
     if(x.type==="role") await dc(`/guilds/${guildId}/roles/${x.id}`,{method:"DELETE"});
     else await dc(`/channels/${x.id}`,{method:"DELETE"});
    }
   };

   try{
    for(const x of categories){
     const n=display(x,language);
     let f=existingChannels.find((z:any)=>z.type===4&&z.name.toLowerCase()===n.toLowerCase());
     if(!f){
      const r=await dc(`/guilds/${guildId}/channels`,{method:"POST",body:JSON.stringify({name:n,type:4})});
      if(!r.ok)throw Object.assign(new Error("category_create_failed"),{status:r.status,details:r.data});
      f=r.data;createdDiscord.push({type:"channel",id:f.id});created.push({type:"category",key:x.key,id:f.id,name:n});
     }else created.push({type:"category",key:x.key,id:f.id,name:f.name,existing:true});
    }
    for(const x of channels){
     const n=display(x,language),parent=created.find((z:any)=>z.type==="category"&&z.key===x.category);
     let f=existingChannels.find((z:any)=>z.type===x.type&&z.name.toLowerCase()===n.toLowerCase()&&(x.type!==0||z.parent_id===parent?.id));
     if(!f){
      const payload:any={name:n,type:x.type};if(parent?.id)payload.parent_id=parent.id;
      const r=await dc(`/guilds/${guildId}/channels`,{method:"POST",body:JSON.stringify(payload)});
      if(!r.ok)throw Object.assign(new Error("channel_create_failed"),{status:r.status,details:r.data});
      f=r.data;createdDiscord.push({type:"channel",id:f.id});created.push({type:"channel",key:x.key,id:f.id,name:n});
     }else created.push({type:"channel",key:x.key,id:f.id,name:f.name,existing:true});
    }
    for(const x of roles){
     const n=display(x,language);
     let f=existingRoles.find((z:any)=>z.name.toLowerCase()===n.toLowerCase());
     if(!f){
      const r=await dc(`/guilds/${guildId}/roles`,{method:"POST",body:JSON.stringify({name:n,color:x.color||0,mentionable:false})});
      if(!r.ok)throw Object.assign(new Error("role_create_failed"),{status:r.status,details:r.data});
      f=r.data;createdDiscord.push({type:"role",id:f.id});created.push({type:"role",key:x.key,id:f.id,name:n});
     }else created.push({type:"role",key:x.key,id:f.id,name:f.name,existing:true});
    }
   }catch(e){
    await rollback();
    const error=e as any;
    await s.from("activity_log").insert({discord_user_id:user.sub,guild_id:guildId,action:"install_template",status:"failed",details:{template_id:templateId,error:error?.message||"install_failed"}});
    return json({error:error?.message||"install_failed",details:error?.details,status:error?.status||500},error?.status||500);
   }

   for(const x of created.filter((z:any)=>!z.existing)){
    await s.from("managed_resources").insert({installation_id:inst.id,guild_id:guildId,resource_type:x.type,discord_resource_id:x.id,resource_key:x.key,resource_name:x.name,template_id:templateId,created_by_livenest:true});
   }
   await s.from("discord_installations").update({bot_present:true,last_scanned_at:new Date().toISOString()}).eq("id",inst.id);
   await s.from("server_configurations").insert({discord_user_id:user.sub,guild_id:guildId,template_id:templateId,server_language:language,configuration:body,status:"installed"});
   await s.from("activity_log").insert({discord_user_id:user.sub,guild_id:guildId,action:"install_template",status:"success",details:{template_id:templateId,language,created:created.filter((z:any)=>!z.existing).length}});
   return json({ok:true,created,summary:{created:created.filter((z:any)=>!z.existing).length,kept:created.filter((z:any)=>z.existing).length}});
  }

  return json({error:"unknown_action"},404);
 }catch(e){return json({error:e instanceof Error?e.message:"server_error"},500)}
});
