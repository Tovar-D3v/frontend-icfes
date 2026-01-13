"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { CheckCircle2, XCircle, Search, ArrowLeft } from "lucide-react";
import { getPreguntasFallidas } from "../../../../services/profesor/preguntas-fallidas";

function stripHtml(html) {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, "").toLowerCase();
}

export default function ListadoPreguntasPage() {
  const { id } = useParams();
  const router = useRouter();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!id) return;

    getPreguntasFallidas(id)
      .then((res) => setData(res))
      .catch(() => setError("Error al cargar las preguntas"))
      .finally(() => setLoading(false));
  }, [id]);

  const preguntasFiltradas = useMemo(() => {
    if (!data || !search.trim()) return data?.preguntas || [];

    return data.preguntas.filter((p) =>
      stripHtml(p.enunciado_html).includes(search.toLowerCase())
    );
  }, [data, search]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );

  if (error) return <div className="text-center text-destructive">{error}</div>;

  if (!data) return <div>No hay preguntas fallidas.</div>;

  return (
    <div className="flex flex-col gap-6 mb-24 mt-4">
      {/* Header */}
      <div className="flex flex-col gap-3">
        <div className="flex ">
          <div className="flex gap-2 ">
            <button
              onClick={() => router.push(`/dashboard/${id}`)}
              className="flex items-center gap-2 px-2 py-1 border-[#d1d5db42] border-card rounded-md h-fit cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="flex flex-col">
              <h2 className="text-xl font-extrabold">
                Preguntas con mayor dificultad · {data.materia}
              </h2>
              <span className="text-sm text-muted-foreground">
                Curso {data.curso}
              </span>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="card-base bg-card flex items-center gap-3">
          <Search className="w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar por texto de la pregunta..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent outline-none text-sm"
          />
        </div>
      </div>

      {/* Listado */}
      <div className="flex flex-col gap-6">
        {preguntasFiltradas.length === 0 && (
          <div className="text-muted-foreground text-sm">
            No se encontraron preguntas con ese criterio.
          </div>
        )}

        {preguntasFiltradas.map((pregunta) => {
          const porcentajeError = Math.round(
            (pregunta.total_fallos / pregunta.total_intentos) * 100
          );

          return (
            <div
              key={pregunta.pregunta_id}
              className="card-base bg-card flex-col gap-4"
            >
              {/* Enunciado */}
              <div className="flex justify-between gap-4">
                <div
                  className="text-sm leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: pregunta.enunciado_html,
                  }}
                />

                <div className="flex flex-col items-end">
                  <span className="text-2xl">{porcentajeError}%</span>
                  <span className="text-xs text-muted-foreground">
                    {pregunta.total_fallos} / {pregunta.total_intentos}
                  </span>
                </div>
              </div>

              {/* Opciones */}
              <div className="flex flex-col gap-3">
                {pregunta.opciones.map((opcion) => {
                  const esDistractorFuerte =
                    !opcion.es_correcta &&
                    opcion.veces_seleccionada_en_fallo > 0;

                  let optionClass = "quiz-option-base card-base";
                  let Icon = null;

                  if (opcion.es_correcta) {
                    optionClass = "quiz-option-base quiz-option-correct";
                    Icon = CheckCircle2;
                  } else if (esDistractorFuerte) {
                    optionClass =
                      "quiz-option-base quiz-option-incorrect-selected";
                    Icon = XCircle;
                  }

                  return (
                    <div key={opcion.id} className={optionClass}>
                      <div
                        className="flex-1 text-sm"
                        dangerouslySetInnerHTML={{
                          __html: opcion.contenido_html,
                        }}
                      />
                      {Icon && <Icon className=" opacity-70" />}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
