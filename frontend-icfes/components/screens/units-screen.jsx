"use client";

import { useEffect, useState, useRef } from "react";
import { getNivelesByMateria } from "@/services/estudiante/apiNivelesMateriaService";
import { ButtonUnits } from "@/components/units-screen-components/button";
import { Tarjet } from "@/components/units-screen-components/tarjet";
import { Rate } from 'antd'
import { RandomImage } from "@/components/units-screen-components/random-image";
import { useRouter } from "next/navigation";

const snakePathClasses = [
  "translate-x-4",
  "-translate-x-9",
  "-translate-x-17",
  "-translate-x-9",
  "translate-x-4",
  "-translate-x-9",
];

export function UnitsScreen({ idMateria, onBack }) {
  const [contenidoMateria, setContenidoMateria] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeUnit, setActiveUnit] = useState(null);
  const containerRef = useRef(null);
  const router = useRouter();

  const sectionRefs = useRef([]);
  const headerRef = useRef(null);
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);

  useEffect(() => {
    async function loadUnits() {
      try {
        const data = await getNivelesByMateria(idMateria);
        setContenidoMateria(data || null);
      } catch (err) {
        alert("Error cargando las unidades");
      }
      setLoading(false);
    }

    loadUnits();
  }, [idMateria]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setActiveUnit(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


  useEffect(() => {
    function onScroll() {
      if (!sectionRefs.current.length) return;
      const headerBottom =
        headerRef.current?.getBoundingClientRect().bottom || 0;
      let newIndex = 0;
      sectionRefs.current.forEach((el, idx) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        if (rect.top <= headerBottom + 8) {
          newIndex = idx;
        }
      });
      if (newIndex !== activeSectionIndex) {
        setActiveSectionIndex(newIndex);
      }
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [activeSectionIndex]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!contenidoMateria) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>No hay datos disponibles</div>
      </div>
    );
  }

  const activeSection = contenidoMateria.secciones[activeSectionIndex];

  return (
    <div className="flex-1 overflow-auto min-h-0 from-background to-muted/30 pb-28 px-3 relative">
      <div
        ref={headerRef}
        className=" mx-auto px-4  z-50 w-full fixed left-0 right-0 overflow-hidden flex items-center justify-center max-w-xl sm:max-w-2xl md:max-w-2xl "
      >
        <div
          className="text-primary-foreground p-4 rounded-sm z-50 w-full border-0 border-b-4 border-border"
          style={{
            backgroundColor: activeSection?.background_color_hex || "#fff",
          }}
        >
          <div className="flex flex-row sm:flex-row justify-between items-center gap-4">
            <div>
              <div className="text-sm opacity-90 flex gap-2 items-center">
               
                <span className="font-bold text-foreground opacity-80 uppercase text-sm">
                  SECCIÓN {activeSectionIndex + 1}: {activeSection?.nombre}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-foreground">
                {contenidoMateria.materia?.toUpperCase() || "MATERIA"}
              </h1>
            </div>
            <div>
              <button
                onClick={() => router.push(`/guia/${idMateria}`)}
                className="flex gap-4 font-bold py-2 px-4 rounded-sm w-full sm:w-auto shadow-[0_4px_0_#0003] border-2 border-border items-center"
              >
                <img
                  src="https://d35aaqx5ub95lt.cloudfront.net/images/path/5b531828e59ae83aadb3d88e6b3a98a8.svg"
                  alt=""
                  className="w-6 h-6 sm:w-8 sm:h-8"
                />
                <span className="font-extrabold text-foreground">GUÍA</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {contenidoMateria.secciones.map((seccion, secIndex) => (
        <div
          key={seccion.id}
          className="mb-8"
          ref={(el) => (sectionRefs.current[secIndex] = el)}
        >
          <div className="px-6 py-8 " style={{ marginTop: secIndex === 0 ? "7rem" : 0 }}>
            <div className="max-w-xs mx-auto flex flex-col items-center">
              {seccion.niveles && seccion.niveles.length > 0 ? (
                seccion.niveles.map((nivel, index) => {
                  const unlocked = Boolean(nivel.desbloqueado);
                  const isLocked = !unlocked;
                  const isActive = activeUnit?.id === nivel.id;

                  const snakeClass =
                    snakePathClasses[index % snakePathClasses.length];

                  const zIndexClass = isActive ? "z-40" : "z-0";

                  return (
                    <div
                      key={nivel.id}
                      className={`mb-8 last:mb-0 w-full flex justify-center ${snakeClass} transition-transform duration-300 ${zIndexClass}`}
                    >
                      <div
                        className="flex flex-col items-center relative"
                        ref={isActive ? containerRef : null}
                      >
                        {unlocked && !nivel.completado  && (
                          <div className="absolute -top-10 bg-card p-2 rounded-md shadow-md animate-float z-30">
                            <span className="font-extrabold text-sm text-pink-600">
                              EMPEZAR
                            </span>
                            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-t-8 border-t-card border-l-8 border-l-transparent border-r-8 border-r-transparent"></div>
                          </div>
                        )}

                        <ButtonUnits
                          onClick={() =>
                            unlocked &&
                            setActiveUnit((prev) =>
                              prev?.id === nivel.id ? null : nivel
                            )
                          }
                          disabled={isLocked}
                          completed={nivel.completado}
                        />

                        {index !== 0 &&
                          (snakeClass === "-translate-x-34" ||
                            snakeClass === "translate-x-0") && (
                            <div
                              className={`absolute ${
                                snakeClass === "-translate-x-34"
                                  ? "translate-x-96"
                                  : "-translate-x-60"
                              } w-3xs -translate-y-20`}
                            >
                              <RandomImage snakeClass={snakeClass} />
                            </div>
                          )}

                        {isActive && (
                          <Tarjet
                            unidad_id={nivel.id}
                            dificultad={nivel.dificultad}
                            title={nivel.nombre}
                            description={nivel.descripcion || ""}
                            exp={nivel.exp_base || 0}
                          />
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center text-sm opacity-80">
                  No hay niveles disponibles en esta sección
                </div>
              )}
            </div>
          </div>

          {secIndex < contenidoMateria.secciones.length - 1 && (
            <div className="w-full flex items-center justify-center my-6">
              <div className="relative w-full">
                <div className="border-t border-border-secundary w-full" />
                <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-background px-3">
                  <span className="text-sm font-extrabold opacity-50 uppercase">
                    SECCIÓN {secIndex + 2}:{" "}
                    {contenidoMateria.secciones[secIndex + 1].nombre}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
