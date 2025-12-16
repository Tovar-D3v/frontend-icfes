"use client";

import { useEffect, useState, useRef } from "react";
import { getUnitsBySubject } from "@/services/unitsService";
import { ButtonUnits } from "@/components/units-screen-components/button";
import { Tarjet } from "@/components/units-screen-components/tarjet";
import { ArrowLeft } from "lucide-react";
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

export function UnitsScreen({
  subject,
  onBack,
}) {
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeUnit, setActiveUnit] = useState(null);
  const containerRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    async function loadUnits() {
      try {
        const data = await getUnitsBySubject(subject.id);

        const formatted = data.map((u) => ({
          id: u.id,
          name: u.nombre,
          description: u.descripcion,
          level: "Nivel " + u.nivel,
          requiredScore: u.puntaje_requerido,
        
          unlocked: u.desbloqueada,
          completed: u.completada,
          progress: u.progreso,
        }));
        

        setUnits(formatted);
      } catch (err) {
        alert("Error cargando las unidades");
      }
      setLoading(false);
    }

    loadUnits();
  }, [subject.id]);

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen from-background to-muted/30 pb-28 px-3 pt-3 relative">
      <div className=" mx-auto px-2 z-50 w-full fixed top-auto bottom-auto left-0 right-0 overflow-hidden flex items-center justify-center max-w-xl sm:max-w-md md:max-w-2xl lg:max-w-3xl ">
        <div className="bg-[#cc348d] text-primary-foreground p-4 rounded-sm z-50 w-full border-0 border-b-4 border-border">
          <div className="flex flex-row sm:flex-row justify-between items-center gap-4">
            <div>
              <div className="text-sm opacity-90 flex gap-2 items-center">
                <ArrowLeft
                  className="cursor-pointer text-foreground hover:opacity-80"
                  onClick={onBack}
                />
                <span className="font-extrabold text-foreground">
                  ETAPA 1, SECCIÓN 1
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-foreground">
                {subject.name}
              </h1>
            </div>
            <div>
              <button onClick={() => router.push(`/guia/${subject.id}`)} className="flex gap-4 font-bold py-2 px-4 rounded-sm w-full sm:w-auto shadow-[0_4px_0_#0003] border-2 border-border items-center">
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

      <div className="px-6 py-8 mt-32">
        <div className="max-w-xs mx-auto flex flex-col items-center">
          {units.map((unit, index) => {
            const unlocked = unit.unlocked;
            const isLocked = !unlocked;
            const isActive = activeUnit?.id === unit.id;

            const snakeClass =
              snakePathClasses[index % snakePathClasses.length];

            const zIndexClass = isActive ? "z-40" : "z-0";

            return (
              <div
                key={unit.id}
                className={`mb-8 last:mb-0 w-full flex justify-center ${snakeClass} transition-transform duration-300 ${zIndexClass}`}
              >
                <div
                  className="flex flex-col items-center relative"
                  ref={isActive ? containerRef : null}
                >
                  {unlocked && (
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
                        prev?.id === unit.id ? null : unit
                      )
                    }
                    disabled={isLocked}
                    completed={unit.completed}
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
                      unidad_id={unit.id}
                      level={unit.level}
                      title={unit.name}
                      description={unit.description}
                      exp={10}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
