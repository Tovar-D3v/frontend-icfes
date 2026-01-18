"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import {jwtDecode} from "jwt-decode";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(
    typeof window !== "undefined" ? localStorage.getItem("token") : null
  );
  const [refreshToken, setRefreshToken] = useState(
    typeof window !== "undefined" ? localStorage.getItem("refresh") : null
  );
  const [user, setUser] = useState(() => {
    try {
      const t = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      return t ? jwtDecode(t) : null;
    } catch {
      return null;
    }
  });

  const setTokens = useCallback((access, refresh) => {
    if (typeof window === "undefined") return;

    setAccessToken(access || null);
    setRefreshToken(refresh || null);

    try {
      setUser(access ? jwtDecode(access) : null);
    } catch {
      setUser(null);
    }
  }, []);

  const logout = useCallback(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("refresh");
      localStorage.removeItem("usuario");
      localStorage.removeItem("role");
      window.location.href = "/";
    }
    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);
  }, []);

  // sincronizar cambios externos en localStorage (p. ej. authService)
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === "token" || e.key === "refresh") {
        const t = localStorage.getItem("token");
        setAccessToken(t);
        try {
          setUser(t ? jwtDecode(t) : null);
        } catch {
          setUser(null);
        }
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return (
    <AuthContext.Provider value={{ user, accessToken, refreshToken, setTokens, setRefreshToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe utilizarse dentro de AuthProvider");
  return ctx;
}