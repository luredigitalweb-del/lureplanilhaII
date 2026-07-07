import { useRef, useEffect, useCallback } from "react";
import { formatBrazilianPhone } from "../utils";

/**
 * Componente para etapas com campos de texto (Steps 1 e 2).
 */
export default function InputStep({ stepData, formData, onUpdateField, onNext, isActive, errors }) {
  const firstInputRef = useRef(null);

  // Auto-focus no primeiro input quando a step ficar ativa
  useEffect(() => {
    if (isActive && firstInputRef.current) {
      const timer = setTimeout(() => {
        firstInputRef.current.focus();
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [isActive]);

  const handleInputChange = useCallback((fieldName, value, fieldType) => {
    // Aplica máscara de telefone
    if (fieldType === "tel") {
      value = formatBrazilianPhone(value);
    }
    onUpdateField(fieldName, value);
  }, [onUpdateField]);

  const isDoubleInput = stepData.fields.length > 1;

  return (
    <>
      <div className="step-badge">{stepData.badge}</div>
      <h2 className="step-title">{stepData.title}</h2>
      <p className="step-desc">{stepData.desc}</p>

      <div className={`input-group${isDoubleInput ? " double-input" : ""}`}>
        {stepData.fields.map((field, idx) => {
          const value = formData[field.name] || "";
          const error = errors[field.name];

          if (isDoubleInput) {
            return (
              <div className="input-subgroup" key={field.name}>
                {field.label && <label htmlFor={field.name}>{field.label}</label>}
                <input
                  ref={idx === 0 ? firstInputRef : null}
                  type={field.type}
                  id={field.name}
                  name={field.name}
                  placeholder={field.placeholder}
                  autoComplete={field.autoComplete}
                  value={value}
                  className={error ? "invalid-field" : ""}
                  onChange={(e) => handleInputChange(field.name, e.target.value, field.type)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      onNext();
                    }
                  }}
                />
                <span className="input-border"></span>
                {error && <span className="error-message">{error}</span>}
              </div>
            );
          }

          return (
            <div key={field.name}>
              <input
                ref={firstInputRef}
                type={field.type}
                id={field.name}
                name={field.name}
                placeholder={field.placeholder}
                autoComplete={field.autoComplete}
                value={value}
                className={error ? "invalid-field" : ""}
                onChange={(e) => handleInputChange(field.name, e.target.value, field.type)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    onNext();
                  }
                }}
              />
              <span className="input-border"></span>
              {error && <span className="error-message">{error}</span>}
            </div>
          );
        })}
      </div>

      <div className="step-actions">
        <button type="button" className="btn-next" onClick={onNext}>
          <span>Avançar</span>
          <svg
            className="icon-arrow"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </button>
        <span className="keyboard-tip">
          Pressione <kbd>Enter ↵</kbd>
        </span>
      </div>
    </>
  );
}
