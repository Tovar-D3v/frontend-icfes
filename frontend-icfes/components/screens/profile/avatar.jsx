"use client";

import React, { useState, useEffect } from "react";
import Avatar, { genConfig } from "react-nice-avatar";
import { Modal, Button } from "antd";
import { Pencil } from "lucide-react";
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

export function ProfileAvatar({ initialAvatar = null }) {
  const [avatarConfig, setAvatarConfig] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const randomHex = () =>
    "#" +
    Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, "0");

  // Inicializar avatar solo en cliente
  useEffect(() => {
    if (initialAvatar) {
      try {
        let parsed = initialAvatar;
        if (typeof initialAvatar === "string") {
          try {
            parsed = JSON.parse(initialAvatar);
          } catch (err) {
            // intenta normalizar comillas simples -> dobles y parsear
            const normalized = initialAvatar.replace(/'/g, '"');
            parsed = JSON.parse(normalized);
          }
        }
        setAvatarConfig(parsed);
      } catch (e) {
        console.error("Error parsing initialAvatar:", e);
        const cfg = genConfig();
        cfg.shirtColor = randomHex();
        cfg.bgColor = randomHex();
        cfg.shape = "square";
        setAvatarConfig(cfg);
      }
    } else {
      const cfg = genConfig();
      cfg.shirtColor = randomHex();
      cfg.bgColor = randomHex();
      cfg.shape = "square";
      setAvatarConfig(cfg);
    }
  }, [initialAvatar]);

  // Función para ir rotando valores
  const cycleValue = (key, values) => {
    setAvatarConfig((prev) => {
      const current = prev?.[key];
      const index = values.indexOf(current);
      const next = values[(index + 1) % values.length];
      return { ...prev, [key]: next };
    });
  };

  const handleSave = () => {
    updateInformacionUsuario({ avatar_style: avatarConfig })
      .then(() => {
        setIsModalOpen(false);
      })
      .catch((e) => {
        console.error("Error updating avatar:", e);
      });
  };

  return (
    <div className="flex flex-col items-center gap-4 mt-6">
      {/* Avatar principal */}
      {avatarConfig ? (
        <div
          className="w-full p-4 flex justify-center items-center rounded-2xl pb-0 relative"
          style={{
            backgroundColor: avatarConfig.bgColor || "#ffffff",
          }}
        >
          <button
            onClick={() => setIsModalOpen(true)}
            className="border-card bg-primary text-background px-3 py-2 rounded-sm flex items-center gap-2 absolute top-2 right-2 cursor-pointer"
          >
            <Pencil />
          </button>
          <Avatar
            style={{ width: 200, height: 200 }}
            shape={avatarConfig?.shape || "square"}
            {...avatarConfig}
          />
        </div>
      ) : (
        <div className="w-[160px] h-[160px] rounded-full bg-gray-200" />
      )}

      {/* Modal */}
      <Modal
        title="Editar Avatar"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={600}
      >
        <div className="flex flex-col gap-6">
          {/* Preview */}
          <div className="flex justify-center rounded-sm pt-4" style={{ background: avatarConfig?.bgColor || "#ffffff" }}>
            {avatarConfig ? (
              <Avatar
                style={{ width: 140, height: 140 }}
                shape={avatarConfig?.shape || "square"}
                {...avatarConfig}
              />
            ) : (
              <div className="w-[140px] h-[140px] rounded-full bg-gray-200" />
            )}
          </div>

          {avatarConfig && (
            <div className="grid grid-cols-3 gap-4">
              <button
                onClick={() =>
                  cycleValue("faceColor", ["#F9C9B6", "#AC6651", "#8D5524"])
                }
                className="editor-btn"
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
                className="editor-btn"
              >
                <Hair color={avatarConfig?.hairColor || "#000000"} />
                Cabello
              </button>

              <button
                onClick={() =>
                  cycleValue("eyeStyle", ["circle", "oval", "smile"])
                }
                className="editor-btn"
              >
                <Eyes />
                Ojos
              </button>

              <button
                onClick={() =>
                  cycleValue("glassesStyle", ["round", "square", "none"])
                }
                className="editor-btn"
              >
                <GlassesRound />
                Gafas
              </button>

              {/* Boca */}
              <button
                onClick={() =>
                  cycleValue("mouthStyle", ["laugh", "smile", "peace"])
                }
                className="editor-btn"
              >
                <Smile />
                Boca
              </button>

              {/* Orejas */}
              <button
                onClick={() => cycleValue("earSize", ["small", "big"])}
                className="editor-btn"
              >
                <EarSmall color={avatarConfig?.faceColor || "#171921"} />
                Orejas
              </button>

              {/* Sombrero */}
              <button
                onClick={() =>
                  cycleValue("hatStyle", ["beanie", "turban", "none"])
                }
                className="editor-btn"
              >
                <Hat color={"#c0c0c0"} />
                Sombrero
              </button>

              {/* Nariz */}
              <button
                onClick={() =>
                  cycleValue("noseStyle", ["short", "long", "round"])
                }
                className="editor-btn"
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
                className="editor-btn"
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
                className="editor-btn"
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

              {/* Shape (circle | rounded | square) */}
              <button
                onClick={() =>
                  cycleValue("shape", ["circle", "rounded", "square"])
                }
                className="editor-btn"
              >
                <div
                  style={{
                    width: 28,
                    height: 20,
                    background: "#cbd5e1",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius:
                      avatarConfig?.shape === "circle"
                        ? 999
                        : avatarConfig?.shape === "rounded"
                        ? 8
                        : 2,
                  }}
                >
                  ⇄
                </div>
                Forma
              </button>

              {/* Cejas */}
              <button
                onClick={() => cycleValue("eyeBrowStyle", ["up", "upWoman"])}
                className="editor-btn"
              >
                <Eyebrow color={avatarConfig?.hairColor || "#000000"} />
                Cejas
              </button>
            </div>
          )}

          {/* Botones */}
          <div className="flex justify-end gap-3 pt-4">
            <Button onClick={() => setIsModalOpen(false)}>Cancelar</Button>
            <Button type="primary" onClick={handleSave}>
              Guardar
            </Button>
          </div>
        </div>
      </Modal>

      {/* estilos botones */}
      <style jsx>{`
        .editor-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          padding: 12px;
          border-radius: 12px;
          background: #f1f5f9;
          font-weight: 500;
          transition: all 0.2s;
        }
        .editor-btn:hover {
          background: #e2e8f0;
          transform: scale(1.05);
        }
      `}</style>
    </div>
  );
}

export default ProfileAvatar;
