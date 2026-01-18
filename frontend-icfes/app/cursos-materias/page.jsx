"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getCursosMateriasByProfesor } from "../../services/profesor/cursos-materias";

export default function CursosMateriaPage() {
  const [cursosMaterias, setCursosMaterias] = useState([]);
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  function handleSelect(item) {
    try {
      localStorage.setItem("asignacion_seleccionada", JSON.stringify(item));
    } catch (e) {
      console.error("Error saving to localStorage:", e);
    }
    router.push(`/dashboard/${item.asignacion_id}`);
  }

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const data = await getCursosMateriasByProfesor();
        setCursosMaterias(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching cursos y materias:", error);
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="loader mb-4"></div>
          <p>Cargando cursos y materias...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex px-4 flex-col gap-4">
      <div className="py-10 flex flex-col gap-7 justify-between h-full">
        <div>
          <h3 className=" text-2xl">Bienvenido,</h3>
          <h1 className=" text-2xl">Selecciona un grupo asignado:</h1>
          <div className="flex justify-center mt-6">
            <img
              src="https://res.cloudinary.com/dulrdwjul/image/upload/v1768347893/ChatGPT_Image_13_ene_2026_06_44_00_p_wftjvd.webp"
              alt=""
              className="w-full rounded-2xl"
            />
          </div>
        </div>

        <div className="w-full max-w-3xl">
          {cursosMaterias.map((item) => (
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
                <p className="text-sm text-muted-foreground">{item.colegio}</p>
              </div>
              <p className="text-xl opacity-80 text-foreground">{item.curso}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
