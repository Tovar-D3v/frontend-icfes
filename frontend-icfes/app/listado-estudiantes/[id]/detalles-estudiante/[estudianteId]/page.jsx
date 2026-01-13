"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Flame, User, TrendingUp, Star } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { getInformacionEstudiante } from "../../../../../services/profesor/detalles-estudiante";
import { resume } from "react-dom/server";

export default function DetallesEstudiantePage() {
  const { id, estudianteId } = useParams();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id || !estudianteId) return;

    getInformacionEstudiante(id, estudianteId)
      .then((res) => {
        // Acomodar respuesta: puede venir como array u objeto; normalizar a la forma que usa la UI
        const result = Array.isArray(res) ? res[0] : res;
        console.log("Detalles estudiante (raw):", result);
        if (!result) {
          setError("No se encontró información del estudiante");
          return;
        }

        const estudiante = result.estudiante ?? {};
        const resumen = result.resumen_materia ?? {};

        const normalized = {
          // nombre completo lo guardamos en first_name para mantener compatibilidad
          usuario__first_name: estudiante.nombre ?? estudiante.first_name ?? "",
          usuario__last_name: "", // no viene separado
          usuario__username: estudiante.username ?? estudiante.user ?? "",
          promedio_materia: resumen.promedio_general ?? resumen.promedio ?? 0,
          nivel_app:
            resumen.niveles_intentados ?? resumen.niveles_intentados ?? "—",
          total_exp: estudiante.exp_total ?? estudiante.total_exp ?? 0,
          racha_actual: estudiante.racha_actual ?? estudiante.streak ?? 0,
          // mantener datos adicionales por si los necesitas en la vista
          debilidades_y_fortalezas: result.debilidades_y_fortalezas ?? [],
          ultimos_intentos: result.ultimos_intentos ?? [],
        };

        setData(normalized);
      })
      .catch((err) => {
        console.error("Detalles estudiante:", err);
        setError("Error al cargar información del estudiante");
      })
      .finally(() => setLoading(false));
  }, [id, estudianteId]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );

  if (error) return <div className="text-center text-destructive">{error}</div>;

  if (!data)
    return (
      <div className="text-center text-muted-foreground">
        No hay información del estudiante.
      </div>
    );

  const nombreCompleto =
    data.usuario__first_name || data.usuario__last_name
      ? `${data.usuario__first_name} ${data.usuario__last_name}`
      : data.usuario__username;

  const promedio = data.promedio_materia ?? 0;

  const chartData = [
    {
      name: "Estudiante",
      promedio: Number(promedio.toFixed(2)),
    },
  ];

  return (
    <div className="flex flex-col gap-6 mt-8 mb-24">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h2 className="text-3xl font-extrabold flex items-center gap-2">
          {nombreCompleto}
        </h2>
        <span className="text-xl text-muted-foreground">
          @{data.usuario__username}
        </span>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card-base bg-card flex-col gap-2">
          <div className="flex items-center gap-2">
            <img src="https://careers.duolingo.com/ee5b5a2e71a0b3c4c072.svg" alt="" className="w-8" />
            <span>Promedio materia</span>
          </div>
          <span className="text-3xl">{promedio.toFixed(2)}</span>
        </div>

        <div className="card-base bg-card flex-col gap-2">
          <div className="flex items-center gap-2">
            <img src="https://d35aaqx5ub95lt.cloudfront.net/images/hearts/8fdba477c56a8eeb23f0f7e67fdec6d9.svg" alt=""  />
            <span>Intentos</span>
          </div>
          <span className="text-3xl">{data.nivel_app}</span>
          <span className="text-sm text-muted-foreground">
            {data.total_exp} EXP acumulada
          </span>
        </div>

        <div className="card-base bg-card flex-col gap-2">
          <div className="flex items-center gap-2">
            <img
              src="https://d35aaqx5ub95lt.cloudfront.net/images/profile/8a6dca76019d059a81c4c7c1145aa7a4.svg"
              alt=""
              className="w-6"
            />
            <span>Racha actual</span>
          </div>
          <span className="text-3xl">{data.racha_actual}</span>
          <span className="text-sm text-muted-foreground">
            días consecutivos
          </span>
        </div>
      </div>

      {/* Gráfico */}
      <div className="card-base flex-col gap-4">
        <h3 className="text-lg font-bold">Desempeño frente a meta ICFES</h3>
        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <ReferenceLine
                y={60}
                stroke="var(--color-duolingo-green)"
                strokeDasharray="4 4"
                label="Meta"
              />
              <Bar
                dataKey="promedio"
                radius={[8, 8, 0, 0]}
                fill="var(--color-chart-2)"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <button className="quiz-option-base quiz-option-selected">
          Asignar actividad personalizada
        </button>
      </div>
    </div>
  );
}
