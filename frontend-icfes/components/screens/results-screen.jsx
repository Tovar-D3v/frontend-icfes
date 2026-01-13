"use client";

export function ResultsScreen({ results, onContinue }) {
  const hasResumen = !!results?.resumen;
  const correct = Number(
    results?.resumen?.correctas ??
      results?.resumen?.correct ??
      results?.score ??
      results?.puntuacion ??
      0
  );
  const incorrect = Number(
    results?.resumen?.incorrectas ??
      results?.resumen?.incorrect ??
      results?.incorrect ??
      0
  );
  const totalQuestions =
    Number(
      results?.totalQuestions ??
        results?.total_questions ??
        (hasResumen ? correct + incorrect : 0)
    ) || 0;

  const percentage = totalQuestions
    ? ((correct / totalQuestions) * 100).toFixed(0)
    : results?.puntuacion != null
    ? Number(results.puntuacion).toFixed(0)
    : "0";

  const passed =
    results?.passed ?? results?.pasa_nivel ?? results?.pasaNivel ?? false;

  const requiredPercent =
    Number(results?.requiredPercent ?? results?.required_percent ?? 70) || 70;
  const requiredPoints =
    Number(
      results?.requiredPoints ??
        results?.required_points ??
        Math.ceil((totalQuestions || 1) * (requiredPercent / 100))
    ) || Math.ceil((totalQuestions || 1) * 0.7);

  const scoreLabel =
    totalQuestions > 0
      ? `${correct}/${totalQuestions}`
      : results?.puntuacion != null
      ? `${Number(results.puntuacion).toFixed(0)}%`
      : `${correct}/${totalQuestions || 0}`;

  return (
    <div className="max-w-xl mx-auto text-center min-h-screen px-3">
      <div
        className={`min-h-screen flex justify-between items-center py-14 flex-col ${
          passed ? "border-primary" : ""
        }`}
      >
        <div className="flex flex-col">
          <h2 className="text-3xl font-extrabold  mb-2">
            {passed ? "Nivel Completado!" : "Necesitas Repasar"}
          </h2>
        </div>

        <div className="flex flex-col">
          <div className=" my-6">
            <img src="" alt="imagen personaje saltando de " />
          </div>

          <div className="text-xl text-muted-foreground mb-8">
            {percentage}% Correcto
          </div>

          {!passed && (
            <div className=" mb-28">
              <p className=" text-3xl font-bold">
                Necesitas {requiredPoints} puntos mínimo.
              </p>
            </div>
          )}
        </div>

        <div className=" grid grid-cols-2 gap-6 mb-8 w-full">
          <div className="quiz-option-base w-full min-h-40">
            <div className="text-2xl font-bold mb-2">Puntuación</div>
            <div className="text-4xl font-extrabold">
              {results?.puntuacion ?? results?.puntuacion ?? 0}
            </div>
          </div>
          <div className="quiz-option-base w-full min-h-40">
            <div className="text-2xl font-bold mb-2">EXP total</div>
            <div className="text-4xl font-extrabold">
              {results?.exp_ganada ?? results?.exp_ganada ?? 0}
            </div>
          </div>
        </div>

        <button
          onClick={onContinue}
          className="w-full py-3 rounded-sm font-extrabold transition-all bg-[#93d333] active:scale-[0.98] border-b-4 border-t-2 border-x-2 border-[#79b933] text-card"
        >
          CONTINUAR
        </button>
      </div>
    </div>
  );
}
