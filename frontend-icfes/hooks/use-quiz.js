"use client";

import { useState, useEffect } from "react";
import { getQuestionsByUnit } from "@/services/questionService";

export function useQuiz(loadUserProgress) {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // Asegurarse de que el código se ejecute solo en el cliente
    const storedUser = typeof window !== "undefined" ? localStorage.getItem("user") : null;
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUserId(parsedUser.id);
    }
  }, []);

  const [quizState, setQuizState] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [lives, setLives] = useState(5);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const startQuiz = async (subject, unit) => {
    try {
      const questions = await getQuestionsByUnit(unit.id);

      if (!questions || questions.length === 0) {
        alert("Esta unidad no tiene preguntas aún.");
        return false;
      }

      setQuizState({
        subjectId: subject.id,
        unitId: unit.id,
        unitName: unit.name,
        questions,
        currentQuestionIndex: 0,
        answers: [],
        startTime: Date.now(),
      });

      setLives(5);
      setSelectedAnswer(null);
      setShowFeedback(false);

      return true;
    } catch (error) {
      alert("Error cargando preguntas");
      return false;
    }
  };

  const finalizarQuiz = async ({ materiaId, unidadId, puntaje, vidasUsadas, totalPreguntas }) => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/quiz/finalizar/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId,
          materia_id: materiaId,
          unidad_id: unidadId,
          puntaje,
          vidas_usadas: vidasUsadas,
          total_preguntas: totalPreguntas
        })
      });
  
      const data = await response.json();
      console.log("➡️ Resultado de finalizar quiz:", data);
  
      return data;
    } catch (error) {
      console.error("❌ Error al finalizar quiz:", error);
    }
  };

  const selectAnswer = (answerIndex) => {
    if (showFeedback) return;
    setSelectedAnswer(answerIndex);
  };

  const checkAnswer = () => {
    if (selectedAnswer === null || showFeedback) return;
  
    const currentQuestion = quizState.questions[quizState.currentQuestionIndex];
  
    const correct = currentQuestion.opciones[selectedAnswer].es_correcta === 1;
  
    setIsCorrect(correct);
    setShowFeedback(true);
  
    if (!correct) {
      setLives((lives) => lives - 1);
    }
  };

  const continueQuiz = () => {
    const newAnswers = [...quizState.answers, selectedAnswer];
    const nextIndex = quizState.currentQuestionIndex + 1;

    setSelectedAnswer(null);
    setShowFeedback(false);

    if (nextIndex >= quizState.questions.length || lives <= 1) {
      finishQuiz(newAnswers);
    } else {
      setQuizState({
        ...quizState,
        currentQuestionIndex: nextIndex,
        answers: newAnswers,
      });
    }
  };

  const finishQuiz = async (answers) => {
    const { subjectId, unitId, questions } = quizState;
  
    // Calcular puntaje
    const score = answers.filter((selectedIndex, i) => {
      const correctOption = questions[i].opciones.find((o) => o.es_correcta === 1);
      return correctOption && questions[i].opciones[selectedIndex].id === correctOption.id;
    }).length;
  
    // Llamar API en Django
    const result = await finalizarQuiz({
      materiaId: subjectId,
      unidadId: unitId,
      puntaje: score,
      vidasUsadas: 5 - lives,
      totalPreguntas: questions.length,
    });
  
    console.log("API Finalizar Quiz:", result);
  
    setQuizState({
      ...quizState,
      finished: true,
      score,
      totalQuestions: questions.length,
      passed: score >= 7,
      reward: result,
    });
  };

  const exitQuiz = () => {
    setQuizState(null);
    setLives(5);
    setSelectedAnswer(null);
    setShowFeedback(false);
  };

  return {
    quizState,
    selectedAnswer,
    lives,
    showFeedback,
    isCorrect,
    startQuiz,
    onSelectAnswer: selectAnswer,
    onCheckAnswer: checkAnswer,
    onContinueQuiz: continueQuiz,
    onExitQuiz: exitQuiz,
    finalizarQuiz,
  };
}