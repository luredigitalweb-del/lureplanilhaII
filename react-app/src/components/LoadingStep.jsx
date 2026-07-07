import { useState, useEffect, useRef } from "react";

/**
 * Tela de carregamento animada (Step 8).
 * Simula uma análise de diagnóstico com barra de progresso e status.
 */
export default function LoadingStep({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [statusStates, setStatusStates] = useState({
    1: "active",
    2: "",
    3: ""
  });
  const intervalRef = useRef(null);

  useEffect(() => {
    const duration = 3000;
    const intervalTime = 30;
    const steps = duration / intervalTime;
    const increment = 100 / steps;

    let currentProgress = 0;

    intervalRef.current = setInterval(() => {
      currentProgress += increment;

      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(intervalRef.current);

        // Pequeno delay antes de mostrar resultado
        setTimeout(() => {
          onComplete();
        }, 400);
      }

      setProgress(currentProgress);

      // Atualizar status items
      if (currentProgress >= 30 && currentProgress < 70) {
        setStatusStates({ 1: "completed", 2: "active", 3: "" });
      } else if (currentProgress >= 70) {
        setStatusStates({ 1: "completed", 2: "completed", 3: "active" });
      }
    }, intervalTime);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [onComplete]);

  const statusItems = [
    { id: 1, label: "Analisando faturamento e estrutura operacional..." },
    { id: 2, label: "Cruzando dados de gargalos com o teto de R$ 100k/mês..." },
    { id: 3, label: "Identificando soluções no ecossistema Lure Growth..." }
  ];

  return (
    <div className="loading-wrapper">
      <div className="loading-spinner-outer">
        <div className="loading-spinner-inner"></div>
        <div className="loading-percentage">{Math.floor(progress)}%</div>
      </div>
      <h2 className="loading-title">Gerando Diagnóstico de Crescimento...</h2>
      <div className="loading-status-list">
        {statusItems.map((item) => (
          <div key={item.id} className={`status-item ${statusStates[item.id]}`}>
            <span className="status-dot"></span>
            <span className="status-label">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
