/**
 * Utilitários do formulário Lure Growth
 */

// Formata telefone no padrão brasileiro (XX) XXXXX-XXXX
export function formatBrazilianPhone(value) {
  if (!value) return value;
  const phone = value.replace(/[^\d]/g, "");
  const len = phone.length;

  if (len < 3) return phone;
  if (len < 7) {
    return `(${phone.slice(0, 2)}) ${phone.slice(2)}`;
  }
  if (len < 11) {
    return `(${phone.slice(0, 2)}) ${phone.slice(2, 6)}-${phone.slice(6)}`;
  }
  return `(${phone.slice(0, 2)}) ${phone.slice(2, 7)}-${phone.slice(7, 11)}`;
}

// Gera a descrição do diagnóstico com base no gargalo selecionado
export function getDiagnosticDescription(gargalo) {
  if (gargalo.includes("Comercial")) {
    return "falta de previsibilidade de vendas e captação ineficiente de clientes de alto ticket. Sem um comercial estruturado, sua agência fica exposta à instabilidade financeira.";
  } else if (gargalo.includes("Operacional")) {
    return "centralização extrema de atividades na sua figura (dono). A entrega operacional consome seu tempo estratégico, impedindo você de focar em prospecção e crescimento.";
  } else if (gargalo.includes("Retenção")) {
    return "alto índice de cancelamento (churn) dos clientes. Você gasta energia para trazer novas contas, mas elas saem rápido demais devido à falta de alinhamento de expectativas ou entrega fraca.";
  } else {
    return "cobrança abaixo da média de mercado (subprecificação). Para escalar até os R$ 100k você precisa de dezenas de clientes pequenos, o que satura sua estrutura de entrega operacional.";
  }
}

// Monta a URL do WhatsApp com a mensagem formatada
export function buildWhatsAppUrl(whatsappNumber, data) {
  const message = `Olá! Participei do formulário no site e gostaria de resgatar meu *presente* + liberar meu diagnóstico da minha agência. Aqui estão minhas respostas:

*DADOS DA AGÊNCIA*
🏢 Agência: ${data.nome_agencia}
👤 Dono(a): ${data.nome_dono}
📱 WhatsApp: ${data.whatsapp_dono}

*DIAGNÓSTICO*
💰 Faturamento Atual: ${data.faturamento}
👥 Estrutura do Time: ${data.equipe}
🚨 Gargalo Principal: ${data.gargalo}
🧠 Sentimento Dominante: ${data.dor_predominante}
🎯 Quer Mentoria? ${data.prontidao}

Gostaria de resgatar o presente e agendar a minha *Sessão Estratégica Gratuita*!`;

  return `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodeURIComponent(message)}`;
}

// Envia dados para webhook
export async function sendWebhookData(webhookUrl, data) {
  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        origem: "LP React",
        data_envio: new Date().toISOString(),
        ...data
      })
    });
    console.log("Webhook enviado com sucesso:", response.status);
  } catch (error) {
    console.error("Erro ao enviar webhook:", error);
  }
}
