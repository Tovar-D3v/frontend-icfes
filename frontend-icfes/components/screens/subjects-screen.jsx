"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getMaterias } from "@/services/estudiante/apiMateriasService";

export function SubjectsScreen() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function load() {
      try {
        const data = await getMaterias();
        const formatted = data.map((m) => ({
          id: m.id,
          name: m.nombre,
          imagen: m.url_imagen_ilustrativa,
        }));

        setSubjects(formatted);
      } catch (error) {
        console.error("Error loading subjects:", error);
      }
      setLoading(false);
    }

    load();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-10">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  return (
    <div className="px-3 pb-24 py-6">
      <h2 className="text-2xl font-bold text-foreground mb-1">Elige una asignatura para empezar a practicar</h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
        {subjects.map((subject) => (
          <button
            key={subject.id}
            onClick={() => router.push(`/home/${subject.id}`,)}
            className={`transform transition-all duration-200 ease-in-out hover:translate-y-1 hover:shadow-sm active:translate-y-2 active:scale-95 active:shadow-none active:border-b-[3px] flex flex-row sm:flex-col gap-5 sm:gap-0 w-full items-center bg-background text-blue-400 font-bold py-4 px-4 rounded-sm border-b-[7px] border-t-2 border-x-2 border-border-secundary text-lg`}
          >
            {subject.imagen && (
              <img className="w-40 rounded-sm p-2 bg-blue-100" src={subject.imagen}/>
            )}
            <div className="flex-1 text-left sm:text-center py-4">
              <h3 className="text-lg font-bold text-white">{subject.name}</h3>
              <p className="text-sm text-muted-foreground">Comienza tu práctica</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
