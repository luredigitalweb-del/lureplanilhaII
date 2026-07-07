import { useState, useCallback, useRef, useEffect } from "react";
import { STEPS, TOTAL_QUESTION_STEPS } from "./data/steps";
import { sendWebhookData } from "./utils";
import CONFIG from "./config";

import InputStep from "./components/InputStep";
import ChoiceStep from "./components/ChoiceStep";
import LoadingStep from "./components/LoadingStep";
import ResultStep from "./components/ResultStep";

const INITIAL_FORM_DATA = {
  nome_agencia: "",
  nome_dono: "",
  whatsapp_dono: "",
  faturamento: "",
  equipe: "",
  gargalo: "",
  dor_predominante: "",
  prontidao: ""
};

export default function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState({});
  const [animationState, setAnimationState] = useState("enter"); // 'enter' | 'exit'
  const [isTransitioning, setIsTransitioning] = useState(false);
  const stepRef = useRef(null);

  // Calcular progresso
  const progressPercentage =
    currentStep <= TOTAL_QUESTION_STEPS
      ? Math.round(((Math.min(currentStep, TOTAL_QUESTION_STEPS) - 1) / (TOTAL_QUESTION_STEPS - 1)) * 100)
      : 100;

  const progressText =
    currentStep <= TOTAL_QUESTION_STEPS
      ? `Passo ${currentStep} de ${TOTAL_QUESTION_STEPS}`
      : "Conclusão";

  const showBackButton = currentStep > 1 && currentStep <= TOTAL_QUESTION_STEPS;

  // Offset das orbes para dinamismo visual
  const orbOffset = (currentStep - 1) * 30;

  // Atualizar campo do formulário
  const updateField = useCallback((fieldName, value) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[fieldName];
      return next;
    });
  }, []);

  // Validação da etapa atual
  const validateStep = useCallback(
    (stepNum) => {
      const newErrors = {};

      if (stepNum === 1) {
        if (!formData.nome_agencia.trim()) {
          newErrors.nome_agencia = "Por favor, preencha o nome da sua agência.";
        }
      } else if (stepNum === 2) {
        if (!formData.nome_dono.trim()) {
          newErrors.nome_dono = "Por favor, digite seu nome.";
        }
        const cleanPhone = (formData.whatsapp_dono || "").replace(/[^\d]/g, "");
        if (cleanPhone.length < 10) {
          newErrors.whatsapp_dono = "Por favor, insira um WhatsApp válido.";
        }
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    },
    [formData]
  );

  // Efeito de shake na validação
  const triggerShake = useCallback(() => {
    if (stepRef.current) {
      stepRef.current.classList.remove("shake");
      void stepRef.current.offsetWidth; // force reflow
      stepRef.current.classList.add("shake");
    }
  }, []);

  // Transição animada entre passos
  const transitionToStep = useCallback((nextStep) => {
    setIsTransitioning(true);
    setAnimationState("exit");

    setTimeout(() => {
      setCurrentStep(nextStep);
      setAnimationState("enter");
      setIsTransitioning(false);
    }, 300);
  }, []);

  // Avançar etapa
  const handleNext = useCallback(() => {
    if (isTransitioning) return;

    // Validar
    const stepData = STEPS.find((s) => s.step === currentStep);
    if (stepData && stepData.type === "input") {
      if (!validateStep(currentStep)) {
        triggerShake();
        return;
      }
    }

    transitionToStep(currentStep + 1);
  }, [currentStep, isTransitioning, validateStep, triggerShake, transitionToStep]);

  // Voltar etapa
  const handleBack = useCallback(() => {
    if (isTransitioning) return;
    if (currentStep <= 1 || currentStep > TOTAL_QUESTION_STEPS) return;

    transitionToStep(currentStep - 1);
  }, [currentStep, isTransitioning, transitionToStep]);

  // Seleção de opção com auto-avanço
  const handleSelect = useCallback(
    (fieldName, value) => {
      if (isTransitioning) return;

      setFormData((prev) => ({ ...prev, [fieldName]: value }));

      // Delay visual antes de avançar
      setTimeout(() => {
        transitionToStep(currentStep + 1);
      }, 350);
    },
    [currentStep, isTransitioning, transitionToStep]
  );

  // Loading completo -> mostrar resultado
  const handleLoadingComplete = useCallback(() => {
    // Salvar dados localmente
    localStorage.setItem("lure_lead_diagnostico", JSON.stringify(formData));

    // Enviar webhook se configurado
    if (CONFIG.webhookUrl) {
      sendWebhookData(CONFIG.webhookUrl, formData);
    }

    transitionToStep(9);
  }, [formData, transitionToStep]);

  // Obter dados da etapa atual
  const currentStepData = STEPS.find((s) => s.step === currentStep);

  // Determinar classes de animação
  const stepClasses = [
    "form-step",
    "active",
    animationState === "exit" ? "exit" : ""
  ]
    .filter(Boolean)
    .join(" ");

  // Adicionar classes específicas para loading/result
  const extraStepClass =
    currentStepData?.type === "loading"
      ? " step-loading"
      : currentStepData?.type === "result"
      ? " step-result"
      : "";

  // Renderizar conteúdo da etapa atual
  const renderStepContent = () => {
    if (!currentStepData) return null;

    switch (currentStepData.type) {
      case "input":
        return (
          <InputStep
            stepData={currentStepData}
            formData={formData}
            onUpdateField={updateField}
            onNext={handleNext}
            isActive={animationState === "enter"}
            errors={errors}
          />
        );
      case "choice":
        return (
          <ChoiceStep
            stepData={currentStepData}
            formData={formData}
            onSelect={handleSelect}
            isActive={animationState === "enter"}
          />
        );
      case "loading":
        return <LoadingStep onComplete={handleLoadingComplete} />;
      case "result":
        return <ResultStep formData={formData} />;
      default:
        return null;
    }
  };

  return (
    <>
      {/* Ambient Glow Orbs */}
      <div
        className="orb orb-1"
        style={{
          transform: `translate(${orbOffset}px, ${-orbOffset}px) scale(${1 + orbOffset / 300})`
        }}
      />
      <div
        className="orb orb-2"
        style={{
          transform: `translate(${-orbOffset}px, ${orbOffset}px) scale(${1 - orbOffset / 400})`
        }}
      />
      <div className="orb orb-3" />

      <div className="form-container">
        {/* Header com Progresso */}
        <header className="form-header">
          <div className="header-top">
            <a href="../index.html" className="logo-wrap">
              <div className="logo-mark">L</div>
              <span className="logo-text">Lure Growth</span>
            </a>
            <button
              type="button"
              className={`btn-back${showBackButton ? " visible" : ""}`}
              onClick={handleBack}
              aria-label="Voltar para a pergunta anterior"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
              <span>Voltar</span>
            </button>
          </div>

          <div className="progress-bar-container">
            <div className="progress-bar" style={{ width: `${progressPercentage}%` }} />
          </div>
          <div className="progress-text">{progressText}</div>
        </header>

        {/* Área Principal do Formulário */}
        <main className="form-main">
          <form id="diagnostico-form" noValidate onSubmit={(e) => e.preventDefault()}>
            <div
              ref={stepRef}
              className={stepClasses + extraStepClass}
              data-step={currentStep}
              data-type={currentStepData?.type}
              key={currentStep}
            >
              {renderStepContent()}
            </div>
          </form>
        </main>
      </div>
    </>
  );
}
