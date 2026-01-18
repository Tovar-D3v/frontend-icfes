"use client";

import { useState, useEffect } from "react";
import { Sun, MoonStar, X } from "lucide-react";
import { useTheme } from "@/components/theme/ThemeProvider";
import config from "@/config/config";
import CursosTopHeader from "@/components/navigation/profesores/cursos-topheader";
import { useAuth } from "@/context/auth-context";

export function TopHeader() {
  const [racha, setRacha] = useState(0);
  const [role, setRole] = useState(null);
  const [asignacionObj, setAsignacionObj] = useState(null);
  const [openDrawerTop, setOpenDrawerTop] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (typeof window === "undefined") return;
    setRole(localStorage.getItem("role"));
    try {
      const raw = localStorage.getItem("asignacion_seleccionada");
      setAsignacionObj(raw ? JSON.parse(raw) : null);
    } catch (e) {
      setAsignacionObj(null);
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (user) {
      setRacha(user.racha_actual ?? 0);
    } else {
      setRacha(0);
    }
  }, [user]);

  return (
    <header className="sticky top-0 z-999 bg-background">
      <div className="container max-w-2xl mx-auto px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center">
            <img
              src="https://d35aaqx5ub95lt.cloudfront.net/images/practiceHub/2c76c04c8e99125ccda0b74b11ac468e.svg"
              alt=""
            />
          </div>
          <span className="text-2xl font-extrabold text-foreground">
            +500 ICFES
          </span>
        </div>

        {mounted && (role === "PROFESOR" ? (
          <div className="flex items-center border-card rounded-2xl gap-1">
            <button
              className="px-4 py-1.5 rounded-full text-right flex items-center gap-2 cursor-pointer"
              onClick={() => setOpenDrawerTop(!openDrawerTop)}
            >
              <div className="text-sm">CURSO</div>
              <div className="text-sm ">{asignacionObj?.curso ?? "—"}</div>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-1">
            <div className="flex items-center gap-2 px-4 py-1.5 bg-orange-100 dark:bg-orange-900/30 rounded-full">
              {racha > 0 ? (
                <img
                  src="https://d35aaqx5ub95lt.cloudfront.net/images/profile/8a6dca76019d059a81c4c7c1145aa7a4.svg"
                  alt=""
                  className="w-6"
                />
              ) : (
                <img
                  src="https://d35aaqx5ub95lt.cloudfront.net/vendor/ba95e6081679d9d7e8c132da5cfce1ec.svg"
                  alt=""
                  className="w-6"
                />
              )}
              <span className="text-sm font-bold text-orange-700 dark:text-orange-400">
                {racha || 0} d
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Drawer Top */}

      {openDrawerTop && (
        <div className="fixed top-0 left-0 w-full h-[55vh] md:h-[42vh] bg-background shadow-lg z-50 p-4 rounded-b-2xl">
          <button
            className="absolute top-4 right-4 p-2 hover:bg-gray-200 rounded-2xl z-10"
            onClick={() => setOpenDrawerTop(false)}
          >
            <X className="w-6 h-6 text-gray-400" />
          </button>

          {/* contenido drawer */}
          <div className=" mt-5">
            <CursosTopHeader />
          </div>
        </div>
      )}
    </header>
  );
}
