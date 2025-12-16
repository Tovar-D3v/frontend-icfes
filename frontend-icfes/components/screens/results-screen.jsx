"use client";

import { CheckCircle2, X } from "lucide-react";

export function ResultsScreen({ quizState, onContinue }) {
  const percentage = ((quizState.score / quizState.totalQuestions) * 100).toFixed(0);
  const requiredPoints = quizState.requiredPoints ?? Math.ceil(quizState.totalQuestions * 0.7);

  return (
    <div className="max-w-xl mx-auto text-center min-h-screen px-3">
      <div
        className={`min-h-screen flex justify-between items-center py-14 flex-col ${quizState.passed ? "border-primary" : ""
          }`}
      >
        <div className="flex flex-col">
          <h2 className="text-3xl font-extrabold  mb-2">
            {quizState.passed ? "¡Unidad Completada!" : "Necesitas Repasar"}
          </h2>
        </div>

        <div className="flex flex-col">
          <div className="text-6xl font-bold text-foreground my-6">
            {quizState.score}/{quizState.totalQuestions}
          </div>

          <div className="text-xl text-muted-foreground mb-8">{percentage}% Correcto</div>

          {quizState.passed ? (
            <div className="mb-28">
              <p className="text-3xl font-bold">
                ¡Excelente trabajo! Has desbloqueado la siguiente unidad.
              </p>
            </div>
          ) : (
            <div className=" mb-28">
              <p className=" text-3xl font-bold">
                Necesitas {requiredPoints} puntos mínimo ({quizState.requiredPercent ?? 70}%).
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