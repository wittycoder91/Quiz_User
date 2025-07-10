import React, { createContext, useContext, useState, useEffect } from "react";
import { apiService, UPLOAD_URL } from "../services/api";

const SettingsContext = createContext();

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    logo: null,
    backgroundColor: "#ffffff",
    textColor: "#000",
    fontFamily: "OpalOrbit, sans-serif",
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    const loadSettings = async () => {
      try {
        // Load logo and settings in parallel
        const [logoData, settingsData] = await Promise.all([
          apiService.getLogo(),
          apiService.getSettings(),
        ]);

        setSettings({
          logo: logoData.image ? `${UPLOAD_URL}${logoData.image}` : null,
          backgroundColor: settingsData.backgroundColor || "#ffffff",
          textColor: settingsData.textColor || "#000",
          fontFamily: settingsData.fontFamily || "OpalOrbit, sans-serif",
          logoWidth: settingsData.logoWidth || null,
          logoHeight: settingsData.logoHeight || null,
          backgroundImage: settingsData.backgroundImage || null,
          isLoading: false,
          error: null,
        });

        // Apply global styles
        document.documentElement.style.setProperty(
          "--background-color",
          settingsData.backgroundColor || "#ffffff"
        );
        document.documentElement.style.setProperty(
          "--text-color",
          settingsData.textColor || "#000"
        );
        document.documentElement.style.setProperty(
          "--font-family",
          settingsData.fontFamily || "OpalOrbit, sans-serif"
        );
      } catch (error) {
        console.error("Error loading settings:", error);
        setSettings((prev) => ({
          ...prev,
          isLoading: false,
          error: error.message,
        }));
      }
    };

    loadSettings();
  }, []);

  const value = {
    ...settings,
    reloadSettings: () => {
      setSettings((prev) => ({ ...prev, isLoading: true, error: null }));
      // This will trigger the useEffect again
    },
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};
