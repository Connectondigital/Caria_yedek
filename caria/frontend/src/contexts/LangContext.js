import React, { createContext, useContext, useMemo, useState } from "react";

const LangContext = createContext(null);

export function LangProvider({ defaultLang = "tr", children }) {
  const [lang, setLang] = useState(defaultLang);

  const value = useMemo(() => ({
    lang,
    setLang,
    toggleLang: () => setLang((l) => (l === "tr" ? "en" : "tr")),
  }), [lang]);

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used within LangProvider");
  return ctx;
}
