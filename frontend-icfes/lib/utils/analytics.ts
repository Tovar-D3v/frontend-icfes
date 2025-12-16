export function calculateAnalytics(userResults: any[]) {
  if (userResults.length === 0) {
    return {
      totalAttempts: 0,
      accuracy: 0,
      weakestTopic: "N/A",
      advice: "Comienza tu primer simulacro para ver tus estadísticas",
    }
  }

  const totalCorrect = userResults.reduce((sum, r) => sum + r.score, 0)
  const totalQuestions = userResults.reduce((sum, r) => sum + r.totalQuestions, 0)
  const accuracy = totalQuestions > 0 ? ((totalCorrect / totalQuestions) * 100).toFixed(1) : 0

  // Find weakest topic
  const topicScores: Record<string, { correct: number; total: number }> = {}
  userResults.forEach((r) => {
    if (r.details) {
      r.details.forEach((d: any) => {
        if (!topicScores[d.topic]) {
          topicScores[d.topic] = { correct: 0, total: 0 }
        }
        topicScores[d.topic].total++
        if (d.correct) topicScores[d.topic].correct++
      })
    }
  })

  let weakestTopic = "N/A"
  let lowestTopicAccuracy = 100
  Object.entries(topicScores).forEach(([topic, data]) => {
    const acc = (data.correct / data.total) * 100
    if (acc < lowestTopicAccuracy) {
      lowestTopicAccuracy = acc
      weakestTopic = topic
    }
  })

  const advice =
    Number(accuracy) < 60
      ? `Concéntrate en ${weakestTopic}. Practica más ejercicios de este tema.`
      : Number(accuracy) < 80
        ? `Buen progreso! Refuerza ${weakestTopic} para mejorar tu puntaje.`
        : "¡Excelente! Mantén tu ritmo de estudio constante."

  return {
    totalAttempts: userResults.length,
    accuracy,
    weakestTopic,
    advice,
  }
}
