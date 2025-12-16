"use client";

import { BarraProgreso } from "@/components/quiz/barra-progreso";
import { Volume2 } from "lucide-react";
import { useSpeechSynthesis } from "react-speech-kit";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

// 🔹 Limpia HTML para lectura por voz
function stripHTML(html) {
  if (!html) return "";
  return html.replace(/<[^>]*>?/gm, "");
}

export function QuizScreen({
  quizState,
  selectedAnswer,
  lives,
  showFeedback,
  isCorrect,
  onSelectAnswer,
  onCheckAnswer,
  onContinueQuiz,
  onExit,
}) {
  const { speak, cancel, speaking } = useSpeechSynthesis();

  const activeQuiz = quizState;

  if (!activeQuiz || !activeQuiz.questions || activeQuiz.questions.length === 0) {
    return (
      <div className="text-center text-red-500">
        No hay preguntas disponibles. Por favor, intenta nuevamente.
      </div>
    );
  }

  const currentQuestion = activeQuiz.questions[activeQuiz.currentQuestionIndex];
  const progress =
    ((activeQuiz.currentQuestionIndex + 1) / activeQuiz.questions.length) * 100;

  if (!currentQuestion || !currentQuestion.opciones) {
    return (
      <div className="text-center text-red-500">
        Pregunta no válida. Por favor, intenta nuevamente.
      </div>
    );
  }

  const opcionCorrecta = currentQuestion.opciones.find((o) => o.es_correcta);
  const respuestaCorrecta = opcionCorrecta?.texto ?? "";

  const explicacion = !isCorrect
    ? `Tu respuesta no coincide con el significado correcto. "${respuestaCorrecta}" es la opción adecuada porque se ajusta al contexto de la pregunta.`
    : "";

  // 🔊 Función de lectura
  const leerPreguntaYOpciones = () => {
    cancel();

    const textoPregunta = stripHTML(currentQuestion.texto);

    const textoOpciones = currentQuestion.opciones
      .map((opcion, index) => `Opción ${index + 1}: ${opcion.texto}`)
      .join(". ");

    const textoCompleto = `${textoPregunta}. ${textoOpciones}`;

    speak({
      text: textoCompleto,
      lang: "es-ES",
      rate: 0.95,
    });
  };

  return (
    <div className="max-w-xl mx-auto min-h-screen flex flex-col justify-between gap-4">

      <BarraProgreso lives={lives} onExit={onExit} progress={progress} />

      <div className="flex-1 overflow-y-auto px-5">
        {currentQuestion.imagen_url && (
          <div className="mb-6 w-full flex justify-center items-center">
            <img
              src={currentQuestion.imagen_url}
              alt="Imagen relacionada con la pregunta"
              className="w-48 object-cover"
              onError={(e) => (e.currentTarget.src = "/backup-image.jpg")}
            />
          </div>
        )}

        <div className="flex items-start gap-2">
          <button
            onClick={leerPreguntaYOpciones}
            aria-label="Leer pregunta y opciones"
            className="rounded-2xl bg-[#49c0f8] border-[#3496c4] border-b-4 p-2 flex items-center justify-center active:scale-95"
          >
            <Volume2 className="text-background" />
          </button>

          <div
            className="prose prose-sm dark:prose-invert mb-6"
            dangerouslySetInnerHTML={{ __html: currentQuestion.texto }}
          />
        </div>

        <div className="space-y-3">
          {currentQuestion.opciones.map((opcion, index) => {
            const isSelected = selectedAnswer === index;
            const isCorrectOption = !!opcion.es_correcta;

            let stateClass = "";

            if (!showFeedback) {
              stateClass = isSelected
                ? "quiz-option-selected"
                : "quiz-option-default";
            } else {
              if (isCorrectOption) {
                stateClass = "quiz-option-correct";
              } else if (isSelected) {
                stateClass = "quiz-option-incorrect-selected";
              } else {
                stateClass = "quiz-option-disabled";
              }
            }

            return (
              <button
                type="button"
                key={opcion.id ?? index}
                onClick={() => !showFeedback && onSelectAnswer(index)}
                disabled={showFeedback}
                aria-pressed={isSelected}
                className={classNames("quiz-option-base", stateClass)}
              >
                {opcion.texto}
              </button>
            );
          })}
        </div>
      </div>

      <div
        className={`sticky bottom-0 rounded-t-sm ${
          showFeedback ? "bg-card" : "bg-background"
        } left-0 pt-3 pb-4 px-4 flex flex-col gap-4`}
      >
        {showFeedback && (
          <>
            {isCorrect ? (
              <div className="pt-3">
                <h4 className="font-bold text-xl">¡Buen trabajo!</h4>
              </div>
            ) : (
              <div>
                <p className="text-red-500 font-bold text-lg mb-1">
                  Solución correcta:
                </p>

                <div className="flex items-center gap-4">
                  <p className="text-red-400 text-md flex-1">
                    {explicacion}
                  </p>
                  <img
                    src="https://res.cloudinary.com/dulrdwjul/image/upload/v1765573355/Gemini_Generated_Image_t1nygwt1nygwt1ny_20251208130701_i2eqb4_nfonhm.webp"
                    className="w-28 h-28 object-contain rounded-md"
                  />
                </div>
              </div>
            )}
          </>
        )}

        <button
          onClick={showFeedback ? onContinueQuiz : onCheckAnswer}
          disabled={selectedAnswer === null && !showFeedback}
          className={`w-full py-3 rounded-sm font-bold transition-all ${
            selectedAnswer === null && !showFeedback
              ? "bg-gray-700 border-b-4 border-gray-800 text-gray-400"
              : showFeedback && !isCorrect
              ? "bg-duolingo-red border-b-4 border-[#d84848]"
              : "bg-[#93d333] border-b-4 border-[#79b933] text-card"
          }`}
        >
          <span className="font-extrabold">
            {showFeedback ? "CONTINUAR" : "COMPROBAR"}
          </span>
        </button>
      </div>
    </div>
  );
}
