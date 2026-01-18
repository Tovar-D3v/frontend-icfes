import React from "react";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function UnicaRespuesta({
  opciones = [],
  selectedAnswer,
  showFeedback,
  onSelectAnswer,
  isCorrect,
}) {
  return (
    <div className="space-y-3">
      {opciones.map((opcion, index) => {
        const isSelected = selectedAnswer === index;

        // decidir clases:
        // - cuando no hay feedback: marcar solo la seleccionada
        // - cuando hay feedback: marcar la seleccionada como correcta/incorrecta según isCorrect,
        //   y no usar isCorrect global para marcar todas las opciones.
        let stateClass = "";
        if (!showFeedback) {
          stateClass = isSelected ? "quiz-option-selected" : "quiz-option-default";
        } else {
          if (isSelected) {
            // la opción que eligió el usuario: mostrar si fue correcta o incorrecta
            stateClass = isCorrect ? "quiz-option-selected" : "quiz-option-incorrect-selected";
          } else {
            // para las demás opciones, si el backend marca explícitamente la opción correcta
            // con opcion.es_correcta la resaltamos como correcta; si no, se desactivan.
            stateClass = opcion.es_correcta ? "quiz-option-correct" : "quiz-option-disabled";
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
            dangerouslySetInnerHTML={{ __html: opcion.texto }}
          />
        );
      })}
    </div>
  );
}