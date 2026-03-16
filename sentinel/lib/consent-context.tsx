import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { appendConsentAudit, ConsentAuditActor } from "@/lib/consent-audit";

export type ConsentCategory = "marketing" | "biometrics" | "childData";

export type ConsentPreferences = {
  marketing: boolean;
  biometrics: boolean;
  childData: boolean;
};

type ConsentStateV1 = {
  version: 1;
  necessary: true;
  preferences: {
    analytics: boolean;
    marketing: boolean;
  };
  updatedAt: string;
};

export type ConsentState = {
  version: 2;
  necessary: true;
  preferences: ConsentPreferences;
  updatedAt: string; // ISO string
};

type ConsentContextType = {
  ready: boolean;
  consent: ConsentState | null;
  isSettingsOpen: boolean;
  openSettings: () => void;
  closeSettings: () => void;
  acceptAll: () => void;
  rejectOptional: () => void;
  savePreferences: (prefs: ConsentPreferences, source?: "settings" | "persetujuan") => void;
  hasConsent: (category: ConsentCategory) => boolean;
  resetConsent: () => void;
};

const STORAGE_KEY = "sentinel_consent_v1";

const ConsentContext = createContext<ConsentContextType | undefined>(undefined);

function parseConsent(raw: string | null): { state: ConsentState | null; migrated: boolean } {
  if (!raw) return { state: null, migrated: false };
  try {
    const parsed = JSON.parse(raw) as Partial<ConsentState | ConsentStateV1>;
    if (parsed?.necessary !== true) return { state: null, migrated: false };
    if (typeof parsed?.updatedAt !== "string") return { state: null, migrated: false };

    if (parsed?.version === 2) {
      const prefs = (parsed as ConsentState).preferences;
      if (!prefs) return { state: null, migrated: false };
      if (typeof prefs.marketing !== "boolean") return { state: null, migrated: false };
      if (typeof prefs.biometrics !== "boolean") return { state: null, migrated: false };
      if (typeof prefs.childData !== "boolean") return { state: null, migrated: false };
      return { state: parsed as ConsentState, migrated: false };
    }

    if (parsed?.version === 1) {
      const v1 = parsed as ConsentStateV1;
      if (!v1.preferences) return { state: null, migrated: false };
      if (typeof v1.preferences.analytics !== "boolean") return { state: null, migrated: false };
      if (typeof v1.preferences.marketing !== "boolean") return { state: null, migrated: false };
      const migrated = buildConsent(
        { marketing: v1.preferences.marketing, biometrics: false, childData: false },
        v1.updatedAt
      );
      return { state: migrated, migrated: true };
    }

    return { state: null, migrated: false };
  } catch {
    return { state: null, migrated: false };
  }
}

function buildConsent(preferences: ConsentPreferences, updatedAt = new Date().toISOString()): ConsentState {
  return {
    version: 2,
    necessary: true,
    preferences,
    updatedAt,
  };
}

export function ConsentProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [consent, setConsent] = useState<ConsentState | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    const parsed = parseConsent(localStorage.getItem(STORAGE_KEY));
    if (parsed?.state) {
      setConsent(parsed.state);
      if (parsed.migrated) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed.state));
      }
    } else {
      setConsent(null);
    }
    setReady(true);
  }, []);

  const readActor = (): ConsentAuditActor | null => {
    const raw =
      sessionStorage.getItem("sentinel_session_user") ??
      localStorage.getItem("sentinel_user");
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw) as Partial<{ id: string; email: string; name: string }>;
      return {
        id: parsed.id,
        email: parsed.email,
        name: parsed.name,
      };
    } catch {
      return null;
    }
  };

  const persist = (
    next: ConsentState | null,
    source: "banner" | "settings" | "persetujuan" | "unknown" | "reset" = "unknown"
  ) => {
    setConsent(next);
    if (next) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      appendConsentAudit({
        actor: readActor(),
        preferences: next.preferences,
        updatedAt: next.updatedAt,
        source,
        consentVersion: next.version,
      });
    } else {
      localStorage.removeItem(STORAGE_KEY);
      appendConsentAudit({
        actor: readActor(),
        preferences: { marketing: false, biometrics: false, childData: false },
        updatedAt: new Date().toISOString(),
        source: "reset",
        consentVersion: 2,
      });
    }
  };

  const value = useMemo<ConsentContextType>(() => {
    const openSettings = () => setIsSettingsOpen(true);
    const closeSettings = () => setIsSettingsOpen(false);

    const acceptAll = () => {
      persist(
        buildConsent({ marketing: true, biometrics: true, childData: true }),
        isSettingsOpen ? "settings" : "banner"
      );
      closeSettings();
    };

    const rejectOptional = () => {
      persist(
        buildConsent({ marketing: false, biometrics: false, childData: false }),
        isSettingsOpen ? "settings" : "banner"
      );
      closeSettings();
    };

    const savePreferences = (prefs: ConsentPreferences, source: "settings" | "persetujuan" = "settings") => {
      persist(buildConsent(prefs), source);
      closeSettings();
    };

    const hasConsent = (category: ConsentCategory) => {
      if (!consent) return false;
      return consent.preferences[category] === true;
    };

    const resetConsent = () => {
      persist(null, "reset");
      closeSettings();
    };

    return {
      ready,
      consent,
      isSettingsOpen,
      openSettings,
      closeSettings,
      acceptAll,
      rejectOptional,
      savePreferences,
      hasConsent,
      resetConsent,
    };
  }, [ready, consent, isSettingsOpen]);

  return <ConsentContext.Provider value={value}>{children}</ConsentContext.Provider>;
}

export function useConsent() {
  const context = useContext(ConsentContext);
  if (!context) throw new Error("useConsent must be used within a ConsentProvider");
  return context;
}
