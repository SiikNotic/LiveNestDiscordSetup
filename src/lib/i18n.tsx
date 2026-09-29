import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "en" | "es";

type Dict = Record<string, { en: string; es: string }>;

export const T: Dict = {
  brand: { en: "LiveNest Discord Setup", es: "LiveNest Discord Setup" },
  tagline: {
    en: "One-click, non-destructive configuration for your existing LiveNest Discord server.",
    es: "Configuración de un clic y no destructiva para tu servidor de Discord LiveNest ya existente.",
  },
  heroKicker: { en: "Server configurator", es: "Configurador de servidor" },
  heroTitle: { en: "Set up LiveNest, safely.", es: "Configura LiveNest, con seguridad." },
  heroBody: {
    en: "This tool configures a Discord server you already own. It audits first, shows you exactly what changes, and never deletes anything.",
    es: "Esta herramienta configura un servidor de Discord que ya posees. Primero audita, te muestra exactamente qué cambia y nunca borra nada.",
  },
  start: { en: "Start setup", es: "Empezar configuración" },
  viewStructure: { en: "View target structure", es: "Ver estructura objetivo" },
  connect: { en: "Connect with Discord", es: "Conectar con Discord" },
  disconnect: { en: "Disconnect", es: "Desconectar" },
  step1: { en: "Connect", es: "Conectar" },
  step2: { en: "Select server", es: "Elegir servidor" },
  step3: { en: "Dry-run audit", es: "Auditoría previa" },
  step4: { en: "Apply", es: "Aplicar" },
  chooseTemplate: { en: "Choose a server template", es: "Elige una plantilla de servidor" },
  chooseTemplateBody: { en: "Pick the structure you are installing. Roles, channels and permissions belong to the selected template.", es: "Elige la estructura que vas a instalar. Los roles, canales y permisos pertenecen a la plantilla seleccionada." },
  selectGuild: { en: "Select your LiveNest server", es: "Selecciona tu servidor LiveNest" },
  selectGuildBody: {
    en: "Only servers where you have Manage Server permission are listed.",
    es: "Solo se listan servidores donde tienes permiso Gestionar servidor.",
  },
  noGuilds: {
    en: "No eligible servers found for this account.",
    es: "No se encontraron servidores elegibles para esta cuenta.",
  },
  runAudit: { en: "Run dry-run audit", es: "Ejecutar auditoría" },
  auditing: { en: "Auditing…", es: "Auditando…" },
  auditTitle: { en: "Audit result", es: "Resultado de la auditoría" },
  auditBody: {
    en: "Nothing has been changed yet. Review the plan below.",
    es: "Todavía no se ha cambiado nada. Revisa el plan a continuación.",
  },
  create: { en: "Create", es: "Crear" },
  update: { en: "Update", es: "Actualizar" },
  skip: { en: "Skip", es: "Omitir" },
  review: { en: "Review", es: "Revisar" },
  apply: { en: "Configure LiveNest", es: "Configurar LiveNest" },
  applying: { en: "Applying…", es: "Aplicando…" },
  confirmTitle: { en: "Apply configuration?", es: "¿Aplicar configuración?" },
  confirmBody: {
    en: "This creates missing roles, categories and channels and updates permissions. Nothing is deleted.",
    es: "Esto crea roles, categorías y canales faltantes y actualiza permisos. No se borra nada.",
  },
  cancel: { en: "Cancel", es: "Cancelar" },
  confirm: { en: "Yes, configure", es: "Sí, configurar" },
  console: { en: "Progress log", es: "Registro de progreso" },
  summary: { en: "Summary", es: "Resumen" },
  created: { en: "Created", es: "Creados" },
  updated: { en: "Updated", es: "Actualizados" },
  skipped: { en: "Skipped", es: "Omitidos" },
  failed: { en: "Failed", es: "Fallidos" },
  roles: { en: "Roles", es: "Roles" },
  channels: { en: "Categories & channels", es: "Categorías y canales" },
  permissions: { en: "Permission matrix", es: "Matriz de permisos" },
  notConfigured: { en: "Discord app not configured", es: "App de Discord sin configurar" },
  notConfiguredBody: {
    en: "Add DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET and DISCORD_BOT_TOKEN in Project Settings → Secrets to enable the connection.",
    es: "Añade DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET y DISCORD_BOT_TOKEN en Ajustes del proyecto → Secretos para habilitar la conexión.",
  },
  botMissing: {
    en: "The LiveNest bot is not in this server yet. Invite it with Manage Roles and Manage Channels, then re-run the audit.",
    es: "El bot de LiveNest aún no está en este servidor. Invítalo con Gestionar roles y Gestionar canales y vuelve a auditar.",
  },
  leftovers: { en: "Possible leftovers", es: "Posibles restos" },
  leftoversBody: {
    en: "Found but never touched by this tool. Remove them manually if you want.",
    es: "Encontrados pero nunca tocados por esta herramienta. Elimínalos manualmente si quieres.",
  },
  safety: { en: "Non-destructive", es: "No destructivo" },
  safetyBody: {
    en: "No channel, role or message is ever deleted.",
    es: "Nunca se borra ningún canal, rol o mensaje.",
  },
  idem: { en: "Idempotent", es: "Idempotente" },
  idemBody: {
    en: "Run it twice; existing items are updated, never duplicated.",
    es: "Ejecútalo dos veces; lo existente se actualiza, nunca se duplica.",
  },
  leastPriv: { en: "Least privilege", es: "Mínimo privilegio" },
  leastPrivBody: {
    en: "Administrator stays with Owner only. Secrets never leave the server.",
    es: "Administrator se queda solo con Owner. Los secretos nunca salen del servidor.",
  },
  back: { en: "Back", es: "Volver" },
  again: { en: "Run audit again", es: "Auditar de nuevo" },
  readOnly: { en: "read-only", es: "solo lectura" },
  private: { en: "private", es: "privado" },
  publicCat: { en: "public", es: "público" },
};

export const tr = (lang: Lang, key: keyof typeof T | string) =>
  T[key] ? T[key][lang] : String(key);

const Ctx = createContext<{ lang: Lang; setLang: (l: Lang) => void; t: (k: string) => string }>({
  lang: "en",
  setLang: () => {},
  t: (k) => k,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");

  useEffect(() => {
    const stored = window.localStorage.getItem("livenest-lang");
    if (stored === "en" || stored === "es") setLang(stored);
  }, []);

  useEffect(() => {
    window.localStorage.setItem("livenest-lang", lang);
  }, [lang]);

  return (
    <Ctx.Provider value={{ lang, setLang, t: (k) => tr(lang, k) }}>{children}</Ctx.Provider>
  );
}

export const useLang = () => useContext(Ctx);