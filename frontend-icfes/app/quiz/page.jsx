"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { QuizScreen } from "../../components/screens/quiz-screen";
import { ResultsScreen } from "../../components/screens/results-screen";

import { iniciarNivel } from "../../services/estudiante/quiz/apiIniciarNivelService";
import { registrarInicioPregunta } from "../../services/estudiante/quiz/apiRegistrarInicioPreguntaService";
import { getPreguntasOpciones } from "../../services/estudiante/quiz/apiPreguntasOpcionesService";
import { validarRespuesta } from "../../services/estudiante/quiz/apiValidarRespuestaService";
import { finalizarNivel } from "../../services/estudiante/quiz/apiFinalizarNivelService";

import { playSound } from "../../public/sounds/useSounds";


export default function QuizPage() {
  const searchParams = useSearchParams();
  const nivelId = searchParams.get("unidad_id");
  const router = useRouter();

  const [intentoId, setIntentoId] = useState(null);
  const [quizState, setQuizState] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  console.log("selectedAnswer:", selectedAnswer);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [explicacion, setExplicacion] = useState("");
  const [videoExplicacion, setVideoExplicacion] = useState(null);
  const [lives, setLives] = useState(3);
  const [loading, setLoading] = useState(true);

  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState(null);

  const startQuestionTimer = useCallback(async (intento, preguntaId) => {
    try {
      await registrarInicioPregunta(intento, preguntaId);
    } catch (error) {
      console.error("Error iniciando cronómetro:", error);
    }
  }, []);

  useEffect(() => {
    if (!nivelId) return;

    const initGame = async () => {
      try {
        setLoading(true);
        const startData = await iniciarNivel(nivelId);
        setIntentoId(startData.intento_id);
        setLives(startData.vidas);

        const data = await getPreguntasOpciones(nivelId);
        
        const mappedQuestions = (data.preguntas || []).map((q) => ({
          id: q.id,
          tipo_pregunta: q.tipo,
          tema: q.tema_especifico,
          texto: q.enunciado,
          imagen_url: q.imagen_url ?? null,
          opciones: (q.opciones || [])
            .slice()
            .sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0))
            .map((o) => ({
              id: o.id,
              texto: o.contenido_html ?? o.texto ?? "",
              es_correcta: !!o.es_correcta,
            })),
        }));

        const initialState = {
          questions: mappedQuestions,
          currentQuestionIndex: 0,
        };

        setQuizState(initialState);

        if (mappedQuestions.length > 0) {
          await startQuestionTimer(startData.intento_id, mappedQuestions[0].id);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error inicializando juego:", error);
        router.back();
      }
    };

    initGame();
  }, [nivelId, router, startQuestionTimer]);

  // acepta tanto índice (única respuesta) como array de conexiones (relacion)
  const onSelectAnswer = useCallback((value) => {
    setSelectedAnswer(value);
  }, [setSelectedAnswer]);

  console.log("results:", results);
  const onCheckAnswer = async () => {
    if (selectedAnswer === null) return;

    const question = quizState.questions[quizState.currentQuestionIndex];

    try {
      let response;
      if (
        question.tipo_pregunta &&
        question.tipo_pregunta.toLowerCase().includes("relacion")
      ) {
        // selectedAnswer ahora es el array de conexiones desde <Relacion />
        response = await validarRespuesta(intentoId, question.id, selectedAnswer);
      } else {
        const option = question.opciones[selectedAnswer];
        if (!option) {
          console.error("Opción inválida/seleccionada:", selectedAnswer);
          return;
        }
        response = await validarRespuesta(intentoId, question.id, option.id);
      }

      setIsCorrect(response.es_correcta);
      setLives(response.vidas_restantes);
      setExplicacion(response.explicacion);
      setVideoExplicacion(response.video_url || null);
      setShowFeedback(true);

      if (response.es_correcta) {
        playSound("/sounds/correcto.mp3");
      } else {
        playSound("/sounds/incorrecto.mp3");
      }

      if (response.resultado === "GAME_OVER") {
        alert("¡Has perdido todas tus vidas!");
        router.back();
      }
    } catch (error) {
      console.error("Error validando respuesta:", error);
    }
  };

  const onContinueQuiz = async () => {
    const nextIndex = quizState.currentQuestionIndex + 1;

    if (nextIndex >= quizState.questions.length || lives <= 0) {
      try {
        const finalData = await finalizarNivel(intentoId);
    
        playSound("/sounds/nivel-completado.mp3");
    
        setResults(finalData);
        setShowResults(true);
      } catch (error) {
        console.error("Error al finalizar:", error);
      }
      return;
    }
    

    setQuizState(prev => ({ ...prev, currentQuestionIndex: nextIndex }));
    setSelectedAnswer(null);
    setShowFeedback(false);
    setExplicacion("");

    await startQuestionTimer(intentoId, quizState.questions[nextIndex].id);
  };

  const onExit = () => router.back();

  if (loading) return <div className="text-center py-20 min-h-screen flex justify-center flex-col">Cargando Nivel...</div>;

  if (showResults && results) {
    return <ResultsScreen results={results} onContinue={() => router.back()} />;
  }

  return (
    <QuizScreen
      quizState={quizState}
      selectedAnswer={selectedAnswer}
      lives={lives}
      showFeedback={showFeedback}
      isCorrect={isCorrect}
      explicacion={explicacion}
      videoExplicacion={videoExplicacion}
      onSelectAnswer={onSelectAnswer}
      onCheckAnswer={onCheckAnswer}
      onContinueQuiz={onContinueQuiz}
      onExit={onExit}
    />
  );
}