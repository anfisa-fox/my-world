"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type AuthorModeContextValue = {
  isAuthorMode: boolean;
  studioSecret: string;
  activateAuthorMode: (secret: string) => void;
  deactivateAuthorMode: () => void;
};

const AuthorModeContext = createContext<AuthorModeContextValue | null>(null);

export function AuthorModeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAuthorMode, setIsAuthorMode] = useState(false);
  const [studioSecret, setStudioSecret] = useState("");

  useEffect(() => {
    const savedSecret = sessionStorage.getItem("studio-secret") ?? "";

    setStudioSecret(savedSecret);
    setIsAuthorMode(sessionStorage.getItem("author-mode") === "active");
  }, []);

  function activateAuthorMode(secret: string) {
    sessionStorage.setItem("author-mode", "active");
    sessionStorage.setItem("studio-secret", secret);

    setStudioSecret(secret);
    setIsAuthorMode(true);
  }

  function deactivateAuthorMode() {
    sessionStorage.removeItem("author-mode");
    sessionStorage.removeItem("studio-secret");

    setStudioSecret("");
    setIsAuthorMode(false);
  }

  const value = useMemo(
    () => ({
      isAuthorMode,
      studioSecret,
      activateAuthorMode,
      deactivateAuthorMode,
    }),
    [isAuthorMode, studioSecret]
  );

  return (
    <AuthorModeContext.Provider value={value}>
      {children}
    </AuthorModeContext.Provider>
  );
}

export function useAuthorMode() {
  const context = useContext(AuthorModeContext);

  if (!context) {
    throw new Error("useAuthorMode must be used inside AuthorModeProvider");
  }

  return context;
}