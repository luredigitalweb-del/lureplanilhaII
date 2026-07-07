import { useMemo } from "react";
import { getDiagnosticDescription, buildWhatsAppUrl } from "../utils";
import CONFIG from "../config";

/**
 * Componente de resultado final do diagnóstico (Step 9).
 * Mostra resumo das respostas e CTA para WhatsApp.
 */
export default function ResultStep({ formData }) {
  const diagnosticDescription = useMemo(
    () => getDiagnosticDescription(formData.gargalo || ""),
    [formData.gargalo]
  );

  const whatsappUrl = useMemo(
    () => buildWhatsAppUrl(CONFIG.whatsappNumber, formData),
    [formData]
  );

  return (
    <div className="result-card">
      <div className="result-badge">Diagnóstico Concluído</div>

      <h2 className="result-title">Obrigado por fazer parte do nosso formulário!</h2>
      <p className="result-subtitle">Em breve você vai receber seu presente.</p>

      <div className="diagnostic-summary">
        <div className="diagnostic-pill">
          <span className="pill-label">Agência:</span>
          <span className="pill-value">{formData.nome_agencia || "..."}</span>
        </div>
        <div className="diagnostic-pill">
          <span className="pill-label">Gargalo Principal:</span>
          <span className="pill-value">{formData.gargalo || "..."}</span>
        </div>
        <div className="diagnostic-pill">
          <span className="pill-label">Sentimento:</span>
          <span className="pill-value">{formData.dor_predominante || "..."}</span>
        </div>
      </div>

      <div className="diagnostic-text-box">
        <p className="diagnostic-intro">
          Com base nos seus dados de faturamento (
          <strong>{formData.faturamento || "..."}</strong>) e no tamanho da equipe (
          <strong>{formData.equipe || "..."}</strong>), o teto de crescimento da sua agência foi
          atingido devido à {diagnosticDescription}
        </p>
        <p className="diagnostic-analysis">
          Donos de agência na sua faixa de faturamento costumam ficar presos no operacional por medo
          de que a qualidade caia ou por falta de processos claros. A boa notícia é que com a
          metodologia da <strong>Lure Growth</strong> você pode estruturar sua agência e alcançar os
          R$ 100 mil recorrentes sem se tornar escravo dela.
        </p>
      </div>

      <div className="result-cta-section">
        <h3>Aproveite Enquanto Seu Presente Chega:</h3>
        <p>
          Liberamos uma <strong>Sessão Estratégica Individual Gratuita</strong> com um dos nossos
          consultores para desenhar o plano de crescimento sob medida da sua agência para faturar R$
          100k/mês. Clique abaixo para resgatar o presente e iniciar a sessão.
        </p>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-cta-whatsapp"
          id="btn-whatsapp-cta"
        >
          <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M16 31C23.732 31 30 24.732 30 17C30 9.26801 23.732 3 16 3C8.26801 3 2 9.26801 2 17C2 19.5109 2.661 21.8674 3.82249 23.9039L2 31L9.33781 29.2604C11.3114 30.3862 13.5836 31 16 31Z" fill="#25D366"/>
            <path fillRule="evenodd" clipRule="evenodd" d="M16 28.7C22.4065 28.7 27.6 23.5065 27.6 17.1C27.6 10.6935 22.4065 5.5 16 5.5C9.5935 5.5 4.4 10.6935 4.4 17.1C4.4 19.3349 5.05653 21.4137 6.19346 23.1584L4.8 28.2L10.0141 26.8723C11.7086 27.9442 13.7781 28.7 16 28.7Z" fill="white"/>
            <path d="M12.7 10.2C12.4 9.6 12.1 9.6 11.8 9.5C11.6 9.5 11.3 9.5 11 9.5C10.7 9.5 10.3 9.6 9.9 10C9.5 10.4 8.5 11.3 8.5 13.2C8.5 15.1 9.9 16.9 10.1 17.2C10.3 17.5 12.8 21.4 16.7 23C17.7 23.4 18.5 23.6 19.1 23.8C20.1 24.1 21 24 21.7 23.9C22.5 23.8 24 23 24.3 22.2C24.7 21.3 24.7 20.6 24.6 20.4C24.5 20.3 24.2 20.2 23.8 20C23.4 19.8 21.5 18.9 21.1 18.7C20.8 18.6 20.5 18.5 20.2 18.9C19.9 19.3 19.2 20.2 19 20.4C18.8 20.7 18.5 20.7 18.2 20.6C17.8 20.4 16.5 19.9 15 18.6C13.8 17.5 13 16.2 12.8 15.8C12.6 15.4 12.8 15.2 13 15C13.2 14.8 13.4 14.6 13.5 14.4C13.7 14.2 13.7 14 13.8 13.8C13.9 13.5 13.8 13.3 13.7 13.1C13.6 12.9 12.8 11 12.7 10.2Z" fill="#25D366"/>
          </svg>
          <span>Resgatar Presente + Iniciar Sessão</span>
        </a>
        <p className="cta-footnote">Sessões limitadas para donos de agência comprometidos.</p>
      </div>
    </div>
  );
}
