import { Rate } from "antd";
import {
  BookOpen,
  Users,
  BarChart3,
  AlertTriangle,
  UserX,
  TrendingUp,
} from "lucide-react";

export function RendimientoCurso({ rendimientoCurso }) {
  if (!rendimientoCurso) return null;

  const {
    curso_nombre,
    materia_nombre,
    colegio_nombre,
    estadisticas_globales,
    ranking_estudiantes,
    puntos_criticos,
  } = rendimientoCurso;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-extrabold">
          Curso {curso_nombre} · {materia_nombre}
        </h2>
        <span className="text-sm text-muted-foreground">{colegio_nombre}</span>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card-base bg-card flex-col gap-3">
          <div className="flex items-center gap-2">
            <span>Promedio del curso</span>
          </div>
          <span className="text-3xl">
            {estadisticas_globales.promedio_general_curso}
          </span>
          <Rate
            disabled
            allowHalf
            value={estadisticas_globales.promedio_general_curso / 20}
          />
        </div>

        <div className="card-base bg-card flex-col gap-3">
          <div className="flex items-center gap-2">
            <span>Estudiantes</span>
          </div>
          <span className="text-3xl">
            {estadisticas_globales.total_estudiantes_en_curso}
          </span>
          <span className="text-sm text-muted-foreground">
            registrados en el curso
          </span>
        </div>

        <div className="card-base bg-card flex-col gap-3">
          <div className="flex items-center gap-2">
            <span>Intentos totales</span>
          </div>
          <span className="text-3xl">
            {estadisticas_globales.total_intentos_registrados}
          </span>
          <span className="text-sm text-muted-foreground">
            actividades realizadas
          </span>
        </div>
      </div>

      {/* Ranking */}
      <div className="card-base bg-card flex-col gap-4">
        <h3 className="text-lg flex items-center gap-2">
          Rendimiento por estudiante
        </h3>

        <div className="flex flex-col gap-3">
          {ranking_estudiantes.map((est, index) => (
            <div
              key={index}
              className="flex justify-between items-center border-b-2 border-[#d1d5db42] pb-2 last:border-none"
            >
              <div className="flex flex-col">
                <span>{est.nombre_completo || est.username}</span>
                <span className="text-sm text-muted-foreground">
                  {est.intentos_realizados} intentos
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-lg">{est.promedio}</span>
                
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Puntos críticos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card-base bg-card flex-col gap-3">
          <div className="flex items-center gap-2">
            <img src="https://d35aaqx5ub95lt.cloudfront.net/images/goals/62bb241121ae018b28240eebffb9fc4a.svg" alt="" className="h-8"/>
            <span>Pregunta más fallada</span>
          </div>

          <div
            className="text-sm text-muted-foreground leading-relaxed"
            dangerouslySetInnerHTML={{
              __html: puntos_criticos.pregunta_mas_fallada,
            }}
          />
          <button
            className="quiz-option-base quiz-option-regular "
            onClick={() => {
              const base = window.location.pathname.replace(/\/$/, "");
              window.location.href = `${base}/listado-preguntas`;
            }}
          >
            Revisar Preguntas
          </button>
        </div>

        <div className="card-base bg-card flex-col gap-3 justify-between">
          <div className="flex items-center gap-2 ">
            <img src="https://d35aaqx5ub95lt.cloudfront.net/images/practiceHub/593f4a57e5d843805c3190ec2c93ab29.svg" alt="" className="w-7" />
            <span>Tema más difícil</span>
          </div>

          <div className="">
            <span className="text-2xl">{puntos_criticos.tema_mas_dificil}</span>
          </div>

          <button className="quiz-option-base quiz-option-incorrect-selected">
            Crear Actividad de Refuerzo
          </button>
        </div>
      </div>
    </div>
  );
}
