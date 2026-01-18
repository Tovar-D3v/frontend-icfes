"use client";

import React, { useState, useEffect } from "react";
import Avatar, { genConfig } from "react-nice-avatar";
import EarSmall from "./iconos/small";
import Eyebrow from "./iconos/eyebrown";
import GlassesRound from "./iconos/glases";
import Face from "./iconos/face";
import Hair from "./iconos/hair";
import Hat from "./iconos/hat";
import Nose from "./iconos/nose";
import Smile from "./iconos/smile";
import Eyes from "./iconos/eye";
import Shirt from "./iconos/shirt";
import { updateInformacionUsuario } from "@/services/apiInformacionUsuario";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";


export function CreateAvatar() {
  const [avatarConfig, setAvatarConfig] = useState(null);
  const initialAvatar = null;
  const { user } = useAuth();
  const router = useRouter();

  const randomHex = () =>
    "#" +
    Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, "0");

  useEffect(() => {
    if (initialAvatar) {
      setAvatarConfig(initialAvatar);
    } else {
      const cfg = genConfig();
      cfg.shirtColor = randomHex();
      cfg.bgColor = randomHex();
      cfg.shape = "square";
      setAvatarConfig(cfg);
    }
  }, [initialAvatar]);

  const cycleValue = (key, values) => {
    setAvatarConfig((prev) => {
      const current = prev?.[key];
      const index = values.indexOf(current);
      const next = values[(index + 1) % values.length];
      return { ...prev, [key]: next };
    });
  };

  const handleUpdateAvatar = async () => {
    try {
      await updateInformacionUsuario({ avatar_style: avatarConfig });
      const role = user?.role_plain ?? user?.role;
      if (role === "ESTUDIANTE") router.push("/home");
      else if (role === "PROFESOR") router.push("/cursos-materias");
      else router.push("/no-encontre");
    } catch (e) {
      console.error("Error updating avatar:", e);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 justify-between h-full">
      <div className=" flex flex-col w-full gap-4 mt-8">
        <div className=" w-full items-start flex">
          <h1 className=" text-2xl">Crea tu avatar para continuar</h1>
        </div>

        {/* Avatar principal */}
        {avatarConfig ? (
          <div
            className="w-full p-4 flex justify-center items-center rounded-2xl pb-0 relative"
            style={{
              backgroundColor: avatarConfig.bgColor || "#ffffff",
            }}
          >
            <Avatar
              style={{ width: 200, height: 200 }}
              shape={avatarConfig?.shape || "square"}
              {...avatarConfig}
            />
          </div>
        ) : (
          <div className="w-[160px] h-[160px] rounded-full bg-gray-200" />
        )}

        {avatarConfig && (
          <div className="grid sm:grid-cols-3 grid-cols-2 gap-4 w-full mt-4">
            <button
              onClick={() =>
                cycleValue("faceColor", ["#F9C9B6", "#AC6651", "#8D5524"])
              }
              className="border-card flex items-center gap-2 justify-center rounded-sm py-4 quiz-option-white-selected"
            >
              <Face color={avatarConfig?.faceColor || "#F9C9B6"} />
              Piel
            </button>

            <button
              onClick={() =>
                cycleValue("hairStyle", [
                  "normal",
                  "thick",
                  "mohawk",
                  "womanLong",
                  "womanShort",
                ])
              }
              className="border-card flex items-center gap-2 justify-center rounded-sm py-4 quiz-option-white-selected"
            >
              <Hair color={avatarConfig?.hairColor || "#000000"} />
              Cabello
            </button>

            <button
              onClick={() =>
                cycleValue("eyeStyle", ["circle", "oval", "smile"])
              }
              className="border-card flex items-center gap-2 justify-center rounded-sm py-4 quiz-option-white-selected"
            >
              <Eyes />
              Ojos
            </button>

            <button
              onClick={() =>
                cycleValue("glassesStyle", ["round", "square", "none"])
              }
              className="border-card flex items-center gap-2 justify-center rounded-sm py-4 quiz-option-white-selected"
            >
              <GlassesRound />
              Gafas
            </button>

            {/* Boca */}
            <button
              onClick={() =>
                cycleValue("mouthStyle", ["laugh", "smile", "peace"])
              }
              className="border-card flex items-center gap-2 justify-center rounded-sm py-4 quiz-option-white-selected"
            >
              <Smile />
              Boca
            </button>

            {/* Orejas */}
            <button
              onClick={() => cycleValue("earSize", ["small", "big"])}
              className="border-card flex items-center gap-2 justify-center rounded-sm py-4 quiz-option-white-selected"
            >
              <EarSmall color={avatarConfig?.faceColor || "#171921"} />
              Orejas
            </button>

            {/* Sombrero */}
            <button
              onClick={() =>
                cycleValue("hatStyle", ["beanie", "turban", "none"])
              }
              className="border-card flex items-center gap-2 justify-center rounded-sm py-4 quiz-option-white-selected"
            >
              <Hat color={"#c0c0c0"} />
              Sombrero
            </button>

            {/* Nariz */}
            <button
              onClick={() =>
                cycleValue("noseStyle", ["short", "long", "round"])
              }
              className="border-card flex items-center gap-2 justify-center rounded-sm py-4 quiz-option-white-selected"
            >
              <Nose />
              Nariz
            </button>

            {/* Camisa */}
            <button
              onClick={() =>
                setAvatarConfig((prev) => {
                  const styles = ["hoody", "short", "polo"];
                  const index = styles.indexOf(prev?.shirtStyle);
                  const next = styles[(index + 1) % styles.length];
                  return {
                    ...prev,
                    shirtStyle: next,
                    shirtColor: randomHex(),
                  };
                })
              }
              className="border-card flex items-center gap-2 justify-center rounded-sm py-4 quiz-option-white-selected"
            >
              <Shirt color={avatarConfig?.shirtColor || "#000000"} />
              Camisa
            </button>

            {/* Fondo (bgColor) */}
            <button
              onClick={() =>
                cycleValue("bgColor", [
                  "#ffffff",
                  "#f1f5f9",
                  "#e6fffa",
                  "#fff7ed",
                  "#fdf2f8",
                ])
              }
              className="border-card flex items-center gap-2 justify-center rounded-sm py-4 quiz-option-white-selected"
            >
              <div
                style={{
                  width: 28,
                  height: 20,
                  borderRadius: 6,
                  background: avatarConfig?.bgColor || "#ffffff",
                  border: "1px solid #e2e8f0",
                }}
              />
              Fondo
            </button>

            {/* Cejas */}
            <button
              onClick={() => cycleValue("eyeBrowStyle", ["up", "upWoman"])}
              className="border-card flex items-center gap-2 justify-center rounded-sm py-4 quiz-option-white-selected"
            >
              <Eyebrow color={avatarConfig?.hairColor || "#000000"} />
              Cejas
            </button>
          </div>
        )}
      </div>
      <div className=" mb-8 flex w-full justify-end">
        <button
          className="flex gap-4 bg-primary hover:bg-primary/90 px-4 py-2 w-fit rounded-sm shadow-[0_4px_0_#58a701] items-center justify-center text-lg font-bold text-white"
          onClick={handleUpdateAvatar}
        >
          Guardar y Continuar
        </button>
      </div>
    </div>
  );
}

export default CreateAvatar;
