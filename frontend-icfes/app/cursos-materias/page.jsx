"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getCursosMateriasByProfesor } from "../../services/profesor/cursos-materias";

export default function CursosMateriaPage() {
  const [cursosMaterias, setCursosMaterias] = useState([]);
  const router = useRouter();

  function handleSelect(item) {
    try {
      localStorage.setItem("asignacion_seleccionada", JSON.stringify(item));
    } catch (e) {
      console.error("Error saving to localStorage:", e);
    }
    router.push(`/dashboard/${item.asignacion_id}`);
  }

  useEffect(() => {Rendimiento
    async function fetchData() {
      try {
        const data = await getCursosMateriasByProfesor();
        setCursosMaterias(data);
      } catch (error) {
        console.error("Error fetching cursos y materias:", error);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="min-h-screen flex px-4 flex-col gap-4">
      <div className="py-10 flex flex-col gap-7">
        <div>
          <h3 className=" text-2xl">Bienvenido,</h3>
          <h1 className=" text-2xl">Selecciona un grupo asignado:</h1>
          <div className="flex justify-center mt-6">
            <img
              src="https://res.cloudinary.com/dulrdwjul/image/upload/v1765248591/Gemini_Generated_Image_cc0dxmcc0dxmcc0d_20251208130956_ltd2rx.png"
              alt=""
              className="w-48"
            />
          </div>
        </div>

        <div className="w-full max-w-3xl">
          {cursosMaterias.length === 0 ? (
            <div className="text-center text-sm opacity-80">
              No hay asignaciones
            </div>
          ) : (
            cursosMaterias.map((item) => (
              <div
                key={item.asignacion_id}
                onClick={() => handleSelect(item)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    handleSelect(item);
                  }
                }}
                className="bg-card p-4 rounded-md shadow mb-4 card-base justify-between items-center cursor-pointer"
              >
                <div>
                  <h2 className="text-lg font-bold text-foreground">
                    {item.materia}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {item.colegio}
                  </p>
                </div>
                <p className="text-xl opacity-80 text-foreground">
                  {item.curso}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
