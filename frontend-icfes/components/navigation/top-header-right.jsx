"use client";

import { useState, useEffect } from "react";
import { Sun, MoonStar } from "lucide-react";
import { useTheme } from "@/components/theme/ThemeProvider";
import config from "@/config/config";

export function TopHeaderRight() {
  const [racha, setRacha] = useState(0);

  const { isDarkMode, toggleTheme } = useTheme();

  useEffect(() => {
    const fetchRacha = async () => {
      const storedUser = typeof window !== "undefined" ? localStorage.getItem("user") : null;
      if (storedUser) {
        const userId = JSON.parse(storedUser).id;

        try {
          const response = await fetch(`${config.API_BASE_URL}/api/racha/${userId}`);
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
    <header className="sticky top-0 z-999 bg-background pt-8">
      <div className="container max-w-2xl mx-auto px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 px-4 py-1.5 bg-orange-100 dark:bg-orange-900/30 rounded-full">
            {racha == 0 ? (<img src="https://d35aaqx5ub95lt.cloudfront.net/images/profile/8a6dca76019d059a81c4c7c1145aa7a4.svg" alt="" className="w-6" />) :
              (<img src="https://d35aaqx5ub95lt.cloudfront.net/vendor/ba95e6081679d9d7e8c132da5cfce1ec.svg" alt="" className="w-6" />)}
            <span className="text-sm font-bold text-orange-700 dark:text-orange-400">
              3 Días
            </span>
          </div>

          <div className="flex gap-2 items-center bg-sky-100 rounded-full px-4 py-1.5 dark:bg-sky-600/30">
            <img src="https://d35aaqx5ub95lt.cloudfront.net/images/profile/01ce3a817dd01842581c3d18debcbc46.svg" alt="" className="w-6 h-7" />
            <span>203 EXP</span>
          </div>

          <div className="flex gap-2 items-center bg-green-700 rounded-full px-4 py-1.5 dark:bg-bronze-900/30">
            <img src="https://d35aaqx5ub95lt.cloudfront.net/images/leagues/838ba65643baef4c8442317df514cab5.svg" alt="" className="w-6" />
            <span>Bronce</span>
          </div>
        </div>
      </div>
    </header>
  );
}
