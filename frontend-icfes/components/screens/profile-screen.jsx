"use client";

import { useState, useEffect } from "react";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import config from "@/config/config";
import ProfileAvatar from "./profile/avatar";
import { getInformacionUsuario } from "@/services/apiInformacionUsuario";
import { LEAGUES } from "@/lib/constants";
import { useAuth } from "@/context/auth-context";

export function ProfileScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();

  const [profileData, setProfileData] = useState({
    username: "",
    avatar_style: null,
  });


  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const data = await getInformacionUsuario();
        setProfileData({
          ...data,
        });
        setLoading(false);
      } catch (e) {
        console.error("Error fetching profile data:", e);
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const handleAvatarSave = async (newAvatarConfig) => {
    setProfileData((prev) => ({ ...prev, avatar_style: newAvatarConfig }));

    try {
      const stored =
        typeof window !== "undefined" ? localStorage.getItem("user") : null;
      if (!stored) return;
      const userId = JSON.parse(stored).id;
      await fetch(`${config.API_BASE_URL}/api/perfil/${userId}/avatar`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ avatar_style: newAvatarConfig }),
      });
    } catch (e) {
      console.error("No se pudo guardar avatar en el servidor:", e);
    }
  };

  // obtener liga actual (fallback al primer elemento)
  const league =
    typeof profileData?.liga === "number"
      ? LEAGUES[profileData.liga]
      : LEAGUES.find((l) => l.name === profileData?.liga) ?? LEAGUES[0];

  if (loading) {
    return (
      <div className="px-4 pb-24 flex flex-col min-h-screen justify-center items-center">
        <p>Cargando perfil...</p>
      </div>
    );
  }

  return (
    <div className="px-4 pb-24 lg:pb-6 gap-6 flex flex-col h-full justify-between">
      <div className=" flex flex-col gap-8">
        <div className=" flex flex-col gap-4">
          <ProfileAvatar
            initialAvatar={profileData.avatar_style}
            onSave={handleAvatarSave}
          />

          <div className=" flex justify-between ">
            <div className="flex flex-col">
              <p className=" text-2xl">
                {profileData?.first_name || ""} {profileData?.last_name || ""}
              </p>
              <p className=" text-sm text-white/60">
                {profileData?.username || ""}
              </p>
            </div>

            <div className=" flex flex-col text-end">
              <p className=" ">{user?.role_plain || ""}</p>
              <p>{profileData?.email || ""}</p>
            </div>
          </div>
        </div>

        <div className=" w-full border-b-2 border-[#d1d5db42]"></div>

        <div className=" grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="card-base flex gap-4 items-start">
            <img
              src="https://d35aaqx5ub95lt.cloudfront.net/images/profile/8a6dca76019d059a81c4c7c1145aa7a4.svg"
              alt=""
              className="h-10"
            />
            <div className="flex flex-col gap-1">
              {profileData?.racha_actual || 0}
              <p className=" text-sm text-white/40 ">días de racha</p>
            </div>
          </div>
          <div className="card-base flex gap-4 items-start">
            <img
              src="https://d35aaqx5ub95lt.cloudfront.net/images/profile/01ce3a817dd01842581c3d18debcbc46.svg"
              alt=""
              className="h-10"
            />
            <div className="flex flex-col gap-1">
              {profileData?.total_exp || 0}
              <p className=" text-sm text-white/40 ">EXP totales</p>
            </div>
          </div>
          <div className="card-base flex gap-4 items-start">
            {league?.icon ? (
              <img
                src={league.icon}
                alt={league.name || "Liga"}
                className="h-10"
              />
            ) : (
              <div className="w-10 h-10 bg-white/10 rounded flex items-center justify-center text-xs text-white/60">
                {league?.name?.slice(0, 2) || "L"}
              </div>
            )}
            <div className="flex flex-col gap-1">
              {profileData?.liga || 0}
              <p className=" text-sm text-white/40 ">división actual</p>
            </div>
          </div>
          <div className="card-base flex gap-4 items-start">
            <img
              src="https://d35aaqx5ub95lt.cloudfront.net/images/goals/39f13d2de304cad2ac2f88b31a7e2ff4.svg"
              alt=""
            />
            <div className="flex flex-col gap-1">
              {profileData?.nivel_app || 0}
              <p className=" text-sm text-white/40 ">Nivel adquirido</p>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={logout}
        className="border-card quiz-option-incorrect-selected w-full text-white font-bold py-3 rounded-sm transition-all flex items-center justify-center gap-2"
      >
        <LogOut className="w-5 h-5" />
        Cerrar Sesión
      </button>
    </div>
  );
}
