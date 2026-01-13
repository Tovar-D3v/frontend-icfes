import React from "react";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function UnicaRespuesta({
  opciones = [],
  selectedAnswer,
  showFeedback,
  onSelectAnswer,
}) {
  return (
    <div className="space-y-3">
      {opciones.map((opcion, index) => {
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
            dangerouslySetInnerHTML={{ __html: opcion.texto }}
          />
        );
      })}
    </div>
  );
}