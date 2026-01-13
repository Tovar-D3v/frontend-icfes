"use client";

import { useState, useEffect } from "react";
import { Sun, MoonStar } from "lucide-react";
import { useTheme } from "@/components/theme/ThemeProvider";
import config from "@/config/config";

export function TopHeader() {
  const [racha, setRacha] = useState(0);
  const [role, setRole] = useState(null);
  const [asignacionObj, setAsignacionObj] = useState(null);

  const { isDarkMode, toggleTheme } = useTheme();

  useEffect(() => {
    if (typeof window === "undefined") return;
    setRole(localStorage.getItem("role"));
    try {
      const raw = localStorage.getItem("asignacion_seleccionada");
      setAsignacionObj(raw ? JSON.parse(raw) : null);
    } catch (e) {
      setAsignacionObj(null);
    }
  }, []);

  useEffect(() => {
    const fetchRacha = async () => {
      const storedUser =
        typeof window !== "undefined" ? localStorage.getItem("user") : null;
      if (storedUser) {
        const userId = JSON.parse(storedUser).id;

        try {
          const response = await fetch(
            `${config.API_BASE_URL}/api/racha/${userId}`
          );
          const data = await response.json();
          setRacha(data.racha || 0);
        } catch (error) {
          console.error("Error al obtener la racha:", error);
        }
      }
    };

    fetchRacha();
  }, []);

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

        {role === "PROFESOR" ? (
          <div className="flex items-center border-card rounded-2xl gap-1">
            <div className="px-4 py-1.5 rounded-full text-right flex items-center gap-2 ">
              <div className="text-sm">CURSO</div>
              <div className="text-sm ">{asignacionObj?.curso ?? "—"}</div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-1">
            <div className="flex items-center gap-2 px-4 py-1.5 bg-orange-100 dark:bg-orange-900/30 rounded-full">
              {racha == 0 ? (
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
                3 d
              </span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
