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
    <div className="px-4 pb-24 space-y-6 max-w-xl mx-auto">

      {/* ---------- BANNER ---------- */}
      <div className="relative w-full h-48 bg-blue-800 rounded-2xl flex items-center justify-center p-4">
        <img src="https://res.cloudinary.com/dulrdwjul/image/upload/v1765248172/Gemini_Generated_Image_v61wftv61wftv61w_20251208213453_suiyt4.png" alt="" className=" h-full" />

        {/* Botón editar */}
        <button className="absolute top-3 right-3 bg-white/70 dark:bg-black/40 backdrop-blur-md 
                           p-2 rounded-xl border border-white/50">
          <Pencil className="w-5 h-5 text-black dark:text-white" />
        </button>
      </div>

      {/* ---------- USER INFO ---------- */}
      <div>
        <h2 className="text-xl font-bold text-foreground">{username || "Usuario"}</h2>

        <p className="text-sm text-muted-foreground">
          Se unió en {fecha_registro ? fecha_registro : "2024"}
        </p>

        {/* Bandera */}
        <img
          src="https://flagcdn.com/us.svg"
          className="w-8 h-6 mt-1 rounded shadow"
          alt=""
        />

        <button className="text-blue-500 font-bold mt-2">2 amigos</button>
      </div>

      <hr className="border-border" />

      {/* ---------- ESTADÍSTICAS ---------- */}
      <h3 className="text-2xl font-extrabold text-foreground">Estadísticas</h3>

      <div className="grid grid-cols-2 gap-4">

        {/* Racha */}
        <div className="bg-card border border-border rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Flame className="w-6 h-6 text-orange-500" />
            <span className="text-sm text-muted-foreground">Racha</span>
          </div>
          <div className="text-3xl font-bold">{racha}</div>
          <div className="text-xs text-muted-foreground">días de racha</div>
        </div>

        {/* XP Total */}
        <div className="bg-card border border-border rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-6 h-6 text-yellow-500" />
            <span className="text-sm text-muted-foreground">Experiencia</span>
          </div>
          <div className="text-3xl font-bold">{xp_total}</div>
          <div className="text-xs text-muted-foreground">EXP totales</div>
        </div>

        {/* Liga */}
        <div className="bg-card border border-border rounded-2xl p-4 col-span-2">
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-6 h-6 text-primary" />
            <span className="text-sm text-muted-foreground">Tu división</span>
          </div>
          {liga ? (
            <div className="flex items-center gap-3">
              <img src={liga.icono} className="h-8" alt="" />
              <span className="font-bold text-xl">{liga.nombre}</span>
            </div>
          ) : (
            <div className="text-muted-foreground text-sm">Sin división</div>
          )}
        </div>

        {/* Unidades Completadas */}
        <div className="bg-card border border-border rounded-2xl p-4 col-span-2">
          <div className="flex items-center gap-2 mb-2">
            <img
              src="https://d35aaqx5ub95lt.cloudfront.net/vendor/882b3d3e43fc041d51f6fc2af496e617.svg"
              className="h-8"
              alt=""
            />
            <span className="text-sm text-muted-foreground">Unidades</span>
          </div>
          <div className="text-3xl font-bold">{unidades_completadas}</div>
          <div className="text-xs text-muted-foreground">completadas</div>
        </div>
      </div>

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
