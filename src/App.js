import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";

import "./assets/css/tailwind.css";
import "./assets/css/icons.css";

import Index from "./pages/index";
import Page404 from "./pages/404";

import Layout from "./component/Layout";
import { SettingsProvider } from "./context/SettingsContext";
import ErrorBoundary from "./components/ErrorBoundary";

function AppContent() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/404" element={<Page404 />} />
      </Routes>
    </Layout>
  );
}

function App() {
  useEffect(() => {
    document.documentElement.setAttribute("dir", "ltr");
    document.documentElement.classList.add("light");
  }, []);

  return (
    <ErrorBoundary>
      <SettingsProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </SettingsProvider>
    </ErrorBoundary>
  );
}

export default App;
