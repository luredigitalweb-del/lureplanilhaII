import { useEffect, useCallback } from "react";

/**
 * Componente para etapas com opções de escolha (radio buttons).
 * Suporta layout "grid" e "stack" (horizontal).
 */
export default function ChoiceStep({ stepData, formData, onSelect, isActive }) {
  const selectedValue = formData[stepData.fieldName] || "";

  // Atalhos numéricos para selecionar opções
  useEffect(() => {
    if (!isActive) return;

    const handleKeyDown = (e) => {
      const numPressed = parseInt(e.key);
      if (!isNaN(numPressed) && numPressed >= 1 && numPressed <= stepData.options.length) {
        e.preventDefault();
        onSelect(stepData.fieldName, stepData.options[numPressed - 1].value);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isActive, stepData.fieldName, stepData.options, onSelect]);

  const handleSelect = useCallback(
    (value) => {
      onSelect(stepData.fieldName, value);
    },
    [onSelect, stepData.fieldName]
  );

  const isStack = stepData.layout === "stack";

  return (
    <>
      <div className="step-badge">{stepData.badge}</div>
      <h2 className="step-title">{stepData.title}</h2>
      <p className="step-desc">{stepData.desc}</p>

      <div className={isStack ? "choices-stack" : "choices-grid"}>
        {stepData.options.map((option, idx) => {
          const isSelected = selectedValue === option.value;

          if (isStack) {
            return (
              <label
                key={option.value}
                className={`choice-card-horizontal${isSelected ? " selected" : ""}`}
                onClick={() => handleSelect(option.value)}
              >
                <input
                  type="radio"
                  name={stepData.fieldName}
                  value={option.value}
                  checked={isSelected}
                  readOnly
                />
                <span className="choice-number">{idx + 1}</span>
                <div className="choice-content">
                  <span className="choice-title">{option.title}</span>
                  <span className="choice-sub">{option.sub}</span>
                </div>
                <span className="choice-indicator"></span>
              </label>
            );
          }

          return (
            <label
              key={option.value}
              className={`choice-card${isSelected ? " selected" : ""}`}
              onClick={() => handleSelect(option.value)}
            >
              <input
                type="radio"
                name={stepData.fieldName}
                value={option.value}
                checked={isSelected}
                readOnly
              />
              <span className="choice-number">{idx + 1}</span>
              <span className="choice-text">{option.label || option.title}</span>
              <span className="choice-indicator"></span>
            </label>
          );
        })}
      </div>

      <span className="keyboard-tip bottom">
        Escolha uma opção ou pressione o número correspondente{" "}
        <kbd>1</kbd> - <kbd>{stepData.options.length}</kbd>
      </span>
    </>
  );
}
