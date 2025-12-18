"use client";

import { CheckCircle2, X } from "lucide-react";

export function ResultsScreen({ quizState, onContinue }) {
  // Mapear ambas formas de DTO (inglés / español) y proteger divisiones por cero.
  const hasResumen = !!quizState?.resumen;
  const correct = Number(
    quizState?.resumen?.correctas ??
      quizState?.resumen?.correct ??
      quizState?.score ??
      quizState?.puntuacion ??
      0
  );
  const incorrect = Number(
    quizState?.resumen?.incorrectas ??
      quizState?.resumen?.incorrect ??
      quizState?.incorrect ??
      0
  );
  const totalQuestions =
    Number(
      quizState?.totalQuestions ??
        quizState?.total_questions ??
        (hasResumen ? correct + incorrect : 0)
    ) || 0;

  // porcentaje: si tenemos total lo calculamos; si no, usamos 'puntuacion' si viene como porcentaje.
  const percentage = totalQuestions
    ? ((correct / totalQuestions) * 100).toFixed(0)
    : quizState?.puntuacion != null
    ? Number(quizState.puntuacion).toFixed(0)
    : "0";

  const passed =
    quizState?.passed ?? quizState?.pasa_nivel ?? quizState?.pasaNivel ?? false;

  const requiredPercent =
    Number(quizState?.requiredPercent ?? quizState?.required_percent ?? 70) || 70;
  const requiredPoints =
    Number(
      quizState?.requiredPoints ??
        quizState?.required_points ??
        Math.ceil((totalQuestions || 1) * (requiredPercent / 100))
    ) || Math.ceil((totalQuestions || 1) * 0.7);

  // etiqueta para mostrar el score (si no hay total mostramos el porcentaje si viene)
  const scoreLabel =
    totalQuestions > 0 ? `${correct}/${totalQuestions}` : quizState?.puntuacion != null ? `${Number(quizState.puntuacion).toFixed(0)}%` : `${correct}/${totalQuestions || 0}`;

  return (
    <div className="max-w-xl mx-auto text-center min-h-screen px-3">
      <div
        className={`min-h-screen flex justify-between items-center py-14 flex-col ${passed ? "border-primary" : ""
          }`}
      >
        <div className="flex flex-col">
          <h2 className="text-3xl font-extrabold  mb-2">
            {passed ? "¡Unidad Completada!" : "Necesitas Repasar"}
          </h2>
        </div>

        <div className="flex flex-col">
          <div className="text-6xl font-bold text-foreground my-6">
            {scoreLabel}
          </div>

          <div className="text-xl text-muted-foreground mb-8">{percentage}% Correcto</div>

          {passed ? (
            <div className="mb-28">
              <p className="text-3xl font-bold">
                ¡Excelente trabajo! Has desbloqueado la siguiente unidad.
              </p>
            </div>
          ) : (
            <div className=" mb-28">
              <p className=" text-3xl font-bold">
                Necesitas {requiredPoints} puntos mínimo ({requiredPercent}%).
              </p>
            </div>
          )}
        </div>

        <button
          onClick={onContinue}
          className="w-full py-3 rounded-sm font-bold transition-all bg-[#93d333] active:scale-[0.98] border-b-4 border-t-2 border-x-2 border-[#79b933] text-card"
        >
          Continuar
        </button>
      </div>
    </div>
  );
}