import { useEffect, useState } from "react";
import {
  activateTemplates,
  fetchRemoteTemplates,
  readLang,
  writeLang,
  type CatalogTemplate,
  type Lang,
} from "./v2/catalog";
import { Landing } from "./v2/Landing";
import { Dashboard } from "./v2/Dashboard";

/** "/" is the public landing page, "/app" the dashboard. OAuth returns with ?discord_session, which belongs to the dashboard. */
function Root() {
  const initial =
    location.pathname.startsWith("/app") ||
    new URLSearchParams(location.search).has("discord_session")
      ? "app"
      : "landing";
  const [route, setRoute] = useState<"landing" | "app">(initial);
  const [lang, setLangState] = useState<Lang>(readLang());
  const [picked, setPicked] = useState<CatalogTemplate | null>(null);
  const setLang = (l: Lang) => {
    setLangState(l);
    writeLang(l);
  };
  useEffect(() => {
    const onPop = () => setRoute(location.pathname.startsWith("/app") ? "app" : "landing");
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);
  // Templates become installable as soon as the installer lists them; re-render once if that changes anything.
  const [, setCatalogVersion] = useState(0);
  useEffect(() => {
    fetchRemoteTemplates(localStorage.getItem("livenest_discord_session") || undefined).then(
      (rows) => {
        if (activateTemplates(rows)) setCatalogVersion((v) => v + 1);
      },
    );
  }, []);
  const go = (r: "landing" | "app") => {
    if (r === "app" && !location.pathname.startsWith("/app"))
      history.pushState({}, "", "/app" + location.search);
    if (r === "landing") history.pushState({}, "", "/");
    setRoute(r);
    window.scrollTo(0, 0);
  };
  if (route === "landing")
    return (
      <Landing
        lang={lang}
        setLang={setLang}
        openApp={() => go("app")}
        useTemplate={(t) => {
          setPicked(t);
          go("app");
        }}
      />
    );
  return (
    <Dashboard
      lang={lang}
      setLang={setLang}
      initialTemplate={picked}
      goHome={() => go("landing")}
    />
  );
}

export default Root;
