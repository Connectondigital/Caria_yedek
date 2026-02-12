import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useTheme } from "../contexts/ThemeContext";
import { useLang } from "../contexts/LangContext";

import SalesPage from "./pages/SalesPage";
import PropertyPage from "./pages/PropertyPage";
import PropertyCreatePage from "./pages/PropertyCreatePage";
import PropertyEditPage from "./pages/PropertyEditPage";
import ClientPage from "./pages/ClientPage";
import ClientCreatePage from "./pages/ClientCreatePage";
import ClientEditPage from "./pages/ClientEditPage";
import CalendarPage from "./pages/CalendarPage";
import LeadInboxPage from "./pages/LeadInboxPage";
import ExecutivePage from "./pages/ExecutivePage";
import CmsPage from "./pages/CmsPage";
import ActivityPage from "./pages/ActivityPage";
import UsersPage from "./pages/UsersPage";
import AdminTopBar from "./components/layout/AdminTopBar";
import { useAdminStore } from "./state/adminStore";
import { getBranding, getCariaLogoSrc, shouldUseBackplate } from "../lib/branding";

/**
 * Robust hash-based route parser with safe default
 */
function getAdminRoute() {
  const hash = window.location.hash || "";
  const raw = hash.replace("#", "").trim();
  if (!raw) return { key: "sales", id: null };
  const routePart = raw.split("?")[0];
  const parts = routePart.split("/");
  return {
    key: parts[0] || "sales",
    id: parts[1] || null
  };
}

const PAGE_COMPONENTS = {
  sales: SalesPage,
  property: PropertyPage,
  "property-create": PropertyCreatePage,
  "property-edit": PropertyEditPage,
  client: ClientPage,
  "client-create": ClientCreatePage,
  "client-edit": ClientEditPage,
  calendar: CalendarPage,
  "lead-inbox": LeadInboxPage,
  executive: ExecutivePage,
  cms: CmsPage,
  activity: ActivityPage,
  users: UsersPage
};

export default function AdminApp({ clientConfig }) {
  const { theme, toggleTheme } = useTheme();
  const { lang, toggleLang } = useLang();
  const { session } = useAdminStore();

  // Redirect to login if not admin/manager
  useEffect(() => {
    if (session && session.role !== 'admin' && session.role !== 'manager') {
      window.location.pathname = '/advisor';
    }
  }, [session]);

  // Safe route initialization
  const [currentRoute, setCurrentRoute] = useState(() => getAdminRoute());

  useEffect(() => {
    const onHashChange = () => {
      const nextRoute = getAdminRoute();
      console.log('Admin Route Change:', nextRoute);
      setCurrentRoute(nextRoute);
    };

    window.addEventListener("hashchange", onHashChange);

    // Ensure initial route is set correctly if hash is empty
    if (!window.location.hash || window.location.hash === "#") {
      window.location.hash = "sales";
    }

    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  // Safe access to module configuration
  const menuItems = useMemo(() => ([
    { key: "sales", labelTr: "Satış Hunisi", labelEn: "Sales Pipeline", enabled: !!clientConfig?.modules?.sales },
    { key: "property", labelTr: "Portföy", labelEn: "Portfolio", enabled: !!clientConfig?.modules?.property },
    { key: "client", labelTr: "Müşteriler", labelEn: "Clients", enabled: !!clientConfig?.modules?.client },
    { key: "calendar", labelTr: "Ajanda", labelEn: "Calendar", enabled: true },
    { key: "lead-inbox", labelTr: "Lead Inbox", labelEn: "Lead Inbox", enabled: !!clientConfig?.modules?.sales },
    { key: "executive", labelTr: "Genel Bakış", labelEn: "Executive", enabled: !!clientConfig?.modules?.executive },
    { key: "activity", labelTr: "Aktivite Merkezi", labelEn: "Activity Center", enabled: true },
    { key: "users", labelTr: "Kullanıcılar", labelEn: "Users", enabled: session?.role === 'admin' || session?.role === 'manager' },
    { key: "cms", labelTr: "CMS", labelEn: "CMS", enabled: !!clientConfig?.modules?.cms },
  ]), [clientConfig, session]);

  const navigate = useCallback((key) => {
    window.location.hash = key;
  }, []);

  const ActivePage = PAGE_COMPONENTS[currentRoute.key] || PAGE_COMPONENTS.sales;

  const brand = getBranding(clientConfig, theme);

  return (
    <div className="flex h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200 overflow-hidden">
      {/* Admin Debug Banner */}
      <div className="fixed bottom-4 right-4 z-[9999] bg-slate-900 text-white text-[10px] font-mono px-3 py-1.5 rounded-lg border border-slate-700 shadow-2xl pointer-events-none opacity-50 hover:opacity-100 transition-opacity flex gap-3">
        <span>PATH: {window.location.pathname}</span>
        <span>HASH: {window.location.hash || "#empty"}</span>
        <span>KEY: {currentRoute.key}</span>
      </div>

      <aside className="w-[280px] border-r border-slate-200 dark:border-slate-800 flex flex-col h-full shrink-0 bg-white dark:bg-slate-900 transition-all duration-300">
        <div className="h-20 flex items-center px-6 border-b border-slate-100 dark:border-slate-800/50 mb-6">
          <a
            href="/estateos-admin#sales"
            onClick={(e) => {
              e.preventDefault();
              navigate("sales");
            }}
            className="block group transition-all"
          >
            <div className={`h-[64px] flex items-center ${shouldUseBackplate(theme) ? 'bg-white/80 border border-white/20 rounded-xl px-2 py-1.5 backdrop-blur-sm' : ''}`}>
              <img
                src={getCariaLogoSrc(theme)}
                alt={brand.brandName}
                loading="lazy"
                className="block h-[44px] w-auto object-contain object-center select-none transition-all duration-300 group-hover:scale-[1.02] group-hover:brightness-110"
                onError={(e) => {
                  const currentSrc = e.target.src;
                  if (currentSrc.includes('light')) {
                    e.target.src = getCariaLogoSrc('light');
                  } else if (currentSrc.includes('dark')) {
                    e.target.src = getCariaLogoSrc('dark');
                  } else {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "block";
                  }
                }}
              />
              <div
                className="font-black text-xl tracking-tighter text-[#3BB2B8] uppercase italic"
                style={{ display: 'none' }}
              >
                {brand.brandName || "CARIA ESTATES"}
              </div>
            </div>
          </a>
        </div>

        <div className="px-6 flex flex-col flex-1 overflow-hidden">
          <div className="flex gap-2 mb-8">
            <button
              onClick={toggleLang}
              className="flex-1 px-3 py-2 text-[10px] font-black tracking-widest rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              {lang === "tr" ? "TUR" : "ENG"}
            </button>

            <button
              onClick={toggleTheme}
              className="flex-1 px-3 py-2 text-[10px] font-black tracking-widest rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              {theme === "dark" ? "GECE" : "GÜNDÜZ"}
            </button>
          </div>

          <div className="text-[10px] font-black text-slate-400 mb-4 uppercase tracking-[0.2em] opacity-60">
            ANA MENÜ
          </div>

          <nav className="flex flex-col gap-1.5 flex-1 overflow-y-auto scrollbar-hidden">
            {menuItems.filter(m => m.enabled).map((m) => {
              const active = currentRoute.key === m.key || (m.key === 'property' && ['property-create', 'property-edit'].includes(currentRoute.key));
              const label = lang === "tr" ? m.labelTr : m.labelEn;

              return (
                <button
                  key={m.key}
                  onClick={() => navigate(m.key)}
                  className={`text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all ${active
                    ? "bg-[#3BB2B8] text-white shadow-lg shadow-cyan-500/20"
                    : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900"
                    }`}
                >
                  {label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto p-6 border-t border-slate-100 dark:border-slate-800">
          <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 opacity-60">
            SİSTEM DURUMU
          </div>
          <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
            Online Center
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 bg-slate-50/50 dark:bg-transparent">
        <AdminTopBar clientConfig={clientConfig} />
        <main className="flex-1 overflow-auto w-full">
          <ActivePage
            key={currentRoute.key + (currentRoute.id || '')}
            clientConfig={clientConfig}
            id={currentRoute.id}
          />
        </main>
      </div>
    </div >
  );
}
