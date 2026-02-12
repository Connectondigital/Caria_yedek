import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import AdminApp from "./admin/AdminApp";
import ErrorBoundary from "./ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LangProvider } from "./contexts/LangContext";
import { loadClientConfig } from "./config/loadClientConfig";

const root = ReactDOM.createRoot(document.getElementById("root"));

const Main = () => {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const pathname = window.location.pathname;

  useEffect(() => {
    if (pathname.startsWith("/estateos-admin")) {
      loadClientConfig("caria").then((cfg) => {
        setConfig(cfg);
        setLoading(false);
      }).catch(err => {
        console.error("Config load error:", err);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [pathname]);

  if (loading) return null;

  if (pathname.startsWith("/estateos-admin")) {
    return (
      <ErrorBoundary>
        <ThemeProvider>
          <LangProvider>
            <AdminApp clientConfig={config} />
          </LangProvider>
        </ThemeProvider>
      </ErrorBoundary>
    );
  }

  // Horizon/Admin path - preserve existing flow (App handles it via routes or fallback)
  if (pathname.startsWith("/admin")) {
    return <App />;
  }

  return <App />;
};

root.render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>,
);
