import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getCursosMateriasByProfesor } from "@/services/profesor/cursos-materias";

export default function CursosTopHeader() {
  const [cursosMaterias, setCursosMaterias] = useState([]);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [selectedAsignacionId, setSelectedAsignacionId] = useState(null);

  function handleSelect(item) {
    try {
      localStorage.setItem("asignacion_seleccionada", JSON.stringify(item));
      setSelectedAsignacionId(item.asignacion_id);
    } catch (e) {
      console.error("Error saving to localStorage:", e);
    }
    router.push(`/dashboard/${item.asignacion_id}`);
  }

  useEffect(() => {
    // leer selección guardada al montar
    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem("asignacion_seleccionada");
        if (raw) {
          const parsed = JSON.parse(raw);
          setSelectedAsignacionId(parsed?.asignacion_id ?? null);
        }
      } catch (e) {
        console.error("Error leyendo asignacion_seleccionada:", e);
      }
    }

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
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 py-10">
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
            className={
              "bg-card p-4 rounded-md shadow card-base items-center cursor-pointer flex- flex-col " +
              (item.asignacion_id === selectedAsignacionId ? " quiz-option-correct" : "")
            }
          >
            <h2 className="text-sm font-bold text-foreground">
              {item.materia}
            </h2>
            <p className="text-sm text-muted-foreground">{item.colegio}</p>
            <p className="text-sm opacity-80 text-foreground">{item.curso}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
