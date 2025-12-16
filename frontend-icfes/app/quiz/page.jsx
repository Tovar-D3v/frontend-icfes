"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { QuizScreen } from "@/components/screens/quiz-screen";
import { getQuestionsByUnit } from "@/services/questionService";
import { ResultsScreen } from "@/components/screens/results-screen";

export default function QuizPage() {
  const searchParams = useSearchParams();
  const unidad_id = searchParams.get("unidad_id");
  const router = useRouter();

  const [questions, setQuestions] = useState([]);
  const [quizState, setQuizState] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [lives, setLives] = useState(3);

  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState(null);

  useEffect(() => {
    if (!unidad_id) return;

    function shuffleArray(arr) {
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    }

    const loadQuestions = async () => {
      try {
        const data = await getQuestionsByUnit(unidad_id);

        setQuestions(data);

        setQuizState({
          questions: shuffleArray([...data]),
          currentQuestionIndex: 0,
        });

        // resetear datos de intento
        setSelectedAnswer(null);
        setShowFeedback(false);
        setIsCorrect(false);
        setLives(3);
        setScore(0);
        setShowResults(false);
        setResults(null);
      } catch (error) {
        console.error("Error obteniendo preguntas:", error);
      }
    };

    loadQuestions();
  }, [unidad_id]);

  if (!quizState) return <div className="text-center py-20 min-h-screen flex justify-center flex-col">Cargando Nivel …</div>;

  const onSelectAnswer = (index) => {
    setSelectedAnswer(index);
  };

  const onCheckAnswer = () => {
    const question = quizState.questions[quizState.currentQuestionIndex];
    const option = question.opciones[selectedAnswer];

    const correct = option?.es_correcta;
    setIsCorrect(!!correct);
    setShowFeedback(true);

    if (correct) {
      setScore((s) => s + 1);
    } else {
      setLives((prev) => Math.max(prev - 1, 0));
    }
  };

  const finalizeResults = () => {
    const totalQuestions = quizState.questions.length;
    const requiredPercent = quizState.questions[0]?.requiredPercent ?? 70;
    const requiredPoints = Math.ceil(totalQuestions * (requiredPercent / 100));
    const passed = (score / totalQuestions) * 100 >= requiredPercent;
    const failed = totalQuestions - score;

    const resultObj = {
      score,
      totalQuestions,
      failed,
      passed,
      requiredPoints,
      requiredPercent,
      questions: quizState.questions,
    };

    setResults(resultObj);
    setShowResults(true);
  };

  const onContinueQuiz = () => {
    if (lives <= 0) {
      finalizeResults();
      return;
    }

    const nextIndex = quizState.currentQuestionIndex + 1;

    if (nextIndex >= quizState.questions.length) {
      finalizeResults();
      return;
    }

    setQuizState({
      ...quizState,
      currentQuestionIndex: nextIndex,
    });

    setSelectedAnswer(null);
    setShowFeedback(false);
    setIsCorrect(false);
  };

  const onExit = () => router.back();

  if (showResults && results) {
    return <ResultsScreen quizState={results} onContinue={() => router.back()} />;
  }

  return (
    <QuizScreen
      quizState={quizState}
      selectedAnswer={selectedAnswer}
      lives={lives}
      showFeedback={showFeedback}
      isCorrect={isCorrect}
      onSelectAnswer={onSelectAnswer}
      onCheckAnswer={onCheckAnswer}
      onContinueQuiz={onContinueQuiz}
      onExit={onExit}
    />
  );
}
