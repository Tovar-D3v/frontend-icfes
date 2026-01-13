"use client";

import React, { useState, useEffect } from "react";
import { BarraProgreso } from "@/components/quiz/barra-progreso";
import { Volume2 } from "lucide-react";
import { useSpeechSynthesis } from "react-speech-kit";
import UnicaRespuesta from "@/components/screens/tipos-preguntas/unica-respuesta";
import Relacion from "@/components/screens/tipos-preguntas/relacion";

function stripHTML(html) {
  if (!html) return "";
  return html.replace(/<[^>]*>?/gm, "");
}

function toEmbedUrl(url) {
  if (!url) return null;
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, "").toLowerCase();

    if (host === "youtu.be") {
      const id = u.pathname.slice(1);
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }

    if (host.includes("youtube.com")) {
      const v = u.searchParams.get("v");
      if (v) return `https://www.youtube.com/embed/${v}`;
      const parts = u.pathname.split("/").filter(Boolean);
      const id = parts.length ? parts[parts.length - 1] : null;
      if (parts.includes("embed") || parts.includes("shorts")) {
        return id ? `https://www.youtube.com/embed/${id}` : null;
      }
    }

    return url;
  } catch (e) {
    return null;
  }
}

export function QuizScreen({
  quizState,
  selectedAnswer,
  lives,
  showFeedback,
  isCorrect,
  explicacion,
  videoExplicacion,
  onSelectAnswer,
  onCheckAnswer,
  onContinueQuiz,
  onExit,
}) {
  const { speak, cancel } = useSpeechSynthesis();
  console.log("QuizScreen render with quizState:", quizState);
  const activeQuiz = quizState;

  const [relacionComplete, setRelacionComplete] = useState(false);

  useEffect(() => {
    setRelacionComplete(false);
  }, [activeQuiz?.currentQuestionIndex]);

  if (!activeQuiz || !activeQuiz.questions || activeQuiz.questions.length === 0) {
    return (
      <div className="text-center text-red-500 min-h-screen flex items-center justify-center">
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

  const generatedExplicacion = !isCorrect
    ? `Tu respuesta no coincide con el significado correcto. "${respuestaCorrecta}" es la opción adecuada porque se ajusta al contexto de la pregunta.`
    : "";

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
        <div className=" col-start-1"></div>
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

        {currentQuestion.tipo_pregunta &&
        currentQuestion.tipo_pregunta.toLowerCase().includes("relacion") ? (
          <Relacion
            opciones={currentQuestion.opciones}
            selectedAnswer={selectedAnswer}
            showFeedback={showFeedback}
            onSelectAnswer={onSelectAnswer}
            onPairsChange={setRelacionComplete}
          />
        ) : (
          <UnicaRespuesta
            opciones={currentQuestion.opciones}
            selectedAnswer={selectedAnswer}
            showFeedback={showFeedback}
            onSelectAnswer={onSelectAnswer}
          />
        )}
      </div>

      <div
        className={`sticky bottom-0 rounded-t-sm z-50 ${
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
                  Solución correcta: {}
                </p>

                <div className="flex items-center gap-4 flex-col max-h-72 overflow-y-auto custom-scroll">
                  <div dangerouslySetInnerHTML={{ __html: explicacion || generatedExplicacion }} />
                  {videoExplicacion && (
                    <div className=" w-full min-h-60 flex justify-center items-center">
                      <iframe
                        src={toEmbedUrl(videoExplicacion)}
                        title="Video Explicación"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className=" w-full min-h-60 rounded-sm"
                      ></iframe>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}

        <button
          onClick={showFeedback ? onContinueQuiz : onCheckAnswer}
          disabled={
            !showFeedback &&
            (currentQuestion.tipo_pregunta &&
            currentQuestion.tipo_pregunta.toLowerCase().includes("relacion")
              ? !relacionComplete
              : selectedAnswer === null)
          }
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
