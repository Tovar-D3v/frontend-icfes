"use client";

import { useState, useEffect } from "react";
import { User, LogOut, Pencil, Flame, Zap, Award } from "lucide-react";
import { useRouter } from "next/navigation";
import config from "@/config/config";

export function ProfileScreen() {
  const router = useRouter();

  const [profileData, setProfileData] = useState({
    vidas: 5,
    racha: 0,
    xp_total: 0,
    liga: null,
    unidades_completadas: 0,
    username: "",
    fecha_registro: "",
    avatar: null,
  });

  useEffect(() => {
    const fetchProfileData = async () => {
      const stored = typeof window !== "undefined" ? localStorage.getItem("user") : null;
      if (!stored) return;

      const userId = JSON.parse(stored).id;

      try {
        const res = await fetch(`${config.API_BASE_URL}/api/perfil/${userId}`);
        const data = await res.json();
        setProfileData(data);
      } catch (e) {
        console.error("Error loading profile:", e);
      }
    };

    fetchProfileData();
  }, []);

  const { racha, xp_total, liga, unidades_completadas, username, fecha_registro, avatar } =
    profileData;

  return (
    <div className="px-4 pb-24 space-y-6 max-w-xl mx-auto flex flex-col justify-end min-h-full">

      {/* ---------- BOTÓN CERRAR SESIÓN ---------- */}
      <button
        onClick={() => router.push(`/`)}
        className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl transition-all active:scale-[0.97] flex items-center justify-center gap-2"
      >
        <LogOut className="w-5 h-5" />
        Cerrar Sesión
      </button>
    </div>
  );
}
