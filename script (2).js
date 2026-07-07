/**
 * DIAGNÓSTICO INTERATIVO PARA DONOS DE AGÊNCIA
 * Lure Growth - Formulário de Qualificação e Gargalos
 */

// CONFIGURAÇÕES DA EMPRESA
const CONFIG = {
    // Insira seu número de WhatsApp comercial com DDI (55) + DDD + Número. Apenas números.
    // Ex: "5511999999999" (São Paulo)
    whatsappNumber: "5585991387914",
    
    // Insira a URL do seu Webhook caso utilize n8n, Make ou ActiveCampaign
    // Se deixar vazio, o formulário apenas redirecionará para o WhatsApp no final.
    webhookUrl: "https://n8n.deverascompany.com.br/webhook/formulario-lure-leads"
};

// ESTADO DO FORMULÁRIO
const formState = {
    currentStep: 1,
    totalSteps: 7, // Etapas de perguntas ativas (excluindo loading e resultado)
    data: {
        nome_agencia: "",
        nome_dono: "",
        whatsapp_dono: "",
        faturamento: "",
        equipe: "",
        gargalo: "",
        dor_predominante: "",
        prontidao: ""
    }
};

// ELEMENTOS DOM (Definidos dinamicamente na inicialização)
let DOM = {};

// INICIALIZAÇÃO SEGURA
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
} else {
    init();
}

function init() {
    DOM = {
        form: document.getElementById("diagnostico-form"),
        steps: document.querySelectorAll(".form-step"),
        btnBack: document.getElementById("btn-back"),
        progressBar: document.getElementById("progress-bar"),
        progressText: document.getElementById("progress-text"),
        
        // Inputs de Texto
        inputAgencia: document.getElementById("nome-agencia"),
        inputDono: document.getElementById("nome-dono"),
        inputWhatsapp: document.getElementById("whatsapp-dono"),
        
        // Botões Próximo genéricos
        btnNext: document.querySelectorAll(".btn-next"),
        
        // Loading Screen
        loadingPercentage: document.getElementById("loading-percentage"),
        statusItems: {
            1: document.getElementById("status-1"),
            2: document.getElementById("status-2"),
            3: document.getElementById("status-3")
        },
        
        // Resultados
        resNomeAgencia: document.getElementById("res-nome-agencia"),
        resGargalo: document.getElementById("res-gargalo"),
        resDor: document.getElementById("res-dor"),
        resFat: document.getElementById("res-fat"),
        resEquipe: document.getElementById("res-equipe"),
        resDescricaoDiag: document.getElementById("res-descricao-diagnostico"),
        btnWhatsappCta: document.getElementById("btn-whatsapp-cta"),
        
        // Orbes
        orb1: document.getElementById("orb-1"),
        orb2: document.getElementById("orb-2"),
        orb3: document.getElementById("orb-3")
    };

    setupEventListeners();
    updateProgress();
    focusCurrentInput();
}

// EVENT LISTENERS
function setupEventListeners() {
    // Botões de "Avançar"
    DOM.btnNext.forEach(btn => {
        btn.addEventListener("click", () => {
            handleNextStep();
        });
    });
    
    // Botão de "Voltar"
    DOM.btnBack.addEventListener("click", () => {
        handlePrevStep();
    });
    
    // Máscara do WhatsApp (formatação brasileira)
    DOM.inputWhatsapp.addEventListener("input", (e) => {
        e.target.value = formatBrazilianPhone(e.target.value);
    });
    
    // Avanço Automático ao selecionar opções de rádio
    const radios = DOM.form.querySelectorAll('input[type="radio"]');
    radios.forEach(radio => {
        radio.addEventListener("change", (e) => {
            const stepEl = e.target.closest(".form-step");
            const stepNum = parseInt(stepEl.dataset.step);
            
            // Grava o valor no state
            const fieldName = e.target.name;
            formState.data[fieldName] = e.target.value;
            
            // Destaca visualmente a escolha antes de prosseguir
            setTimeout(() => {
                handleNextStep();
            }, 350); // Delay suave de 350ms para feedback visual
        });
    });
    
    // Navegação via teclado
    document.addEventListener("keydown", (e) => {
        const activeStepEl = document.querySelector(".form-step.active");
        if (!activeStepEl) return;
        
        const stepNum = parseInt(activeStepEl.dataset.step);
        const stepType = activeStepEl.dataset.type;
        
        // Pressionar ENTER para avançar em inputs de texto
        if (e.key === "Enter" && stepType === "input") {
            e.preventDefault();
            handleNextStep();
        }
        
        // Atalhos Numéricos (1, 2, 3, 4, 5) nas opções
        if (stepType === "choice" && !isNaN(e.key)) {
            const numPressed = parseInt(e.key);
            const visibleRadios = activeStepEl.querySelectorAll('input[type="radio"]');
            if (numPressed >= 1 && numPressed <= visibleRadios.length) {
                e.preventDefault();
                const targetRadio = visibleRadios[numPressed - 1];
                targetRadio.checked = true;
                
                // Dispara o evento de change para rodar a lógica de avanço automático
                const event = new Event("change", { bubbles: true });
                targetRadio.dispatchEvent(event);
            }
        }
    });
    
    // Limpar marcações de erro ao digitar
    const textInputs = [DOM.inputAgencia, DOM.inputDono, DOM.inputWhatsapp];
    textInputs.forEach(input => {
        input.addEventListener("input", () => {
            input.classList.remove("invalid-field");
            const errEl = input.parentNode.querySelector(".error-message");
            if (errEl) errEl.remove();
        });
    });
}

// FORMATAR WHATSAPP (MÁSCARA BRASILEIRA)
function formatBrazilianPhone(value) {
    if (!value) return value;
    const phone = value.replace(/[^\d]/g, '');
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

// NAVEGAÇÃO ENTRE PASSOS (Avançar)
function handleNextStep() {
    const currentStepEl = document.querySelector(`.form-step[data-step="${formState.currentStep}"]`);
    if (!currentStepEl) return;
    
    // Validar etapa atual
    if (!validateStep(formState.currentStep)) {
        shakeElement(currentStepEl);
        return;
    }
    
    // Salvar dados de inputs manuais
    saveCurrentStepData(formState.currentStep);
    
    // Transição de Saída
    currentStepEl.classList.add("exit");
    
    setTimeout(() => {
        currentStepEl.classList.remove("active", "exit");
        
        // Incrementa o passo
        formState.currentStep++;
        
        const nextStepEl = document.querySelector(`.form-step[data-step="${formState.currentStep}"]`);
        if (nextStepEl) {
            nextStepEl.classList.add("active");
            updateProgress();
            focusCurrentInput();
            
            // Se for o passo de loading (8), inicia simulação
            if (nextStepEl.dataset.type === "loading") {
                startLoadingSimulation();
            }
        }
    }, 300); // Sincronizado com o tempo de fade-out do CSS
}

// NAVEGAÇÃO ENTRE PASSOS (Voltar)
function handlePrevStep() {
    // Não permite voltar no loading ou resultado
    if (formState.currentStep > formState.totalSteps) return;
    if (formState.currentStep === 1) return;
    
    const currentStepEl = document.querySelector(`.form-step[data-step="${formState.currentStep}"]`);
    if (!currentStepEl) return;
    
    currentStepEl.classList.add("exit");
    
    setTimeout(() => {
        currentStepEl.classList.remove("active", "exit");
        
        formState.currentStep--;
        
        const prevStepEl = document.querySelector(`.form-step[data-step="${formState.currentStep}"]`);
        if (prevStepEl) {
            prevStepEl.classList.add("active");
            updateProgress();
            focusCurrentInput();
        }
    }, 300);
}

// VALIDAR RESPOSTAS
function validateStep(stepNum) {
    let isValid = true;
    
    if (stepNum === 1) {
        if (!DOM.inputAgencia.value.trim()) {
            showInputError(DOM.inputAgencia, "Por favor, preencha o nome da sua agência.");
            isValid = false;
        }
    } else if (stepNum === 2) {
        if (!DOM.inputDono.value.trim()) {
            showInputError(DOM.inputDono, "Por favor, digite seu nome.");
            isValid = false;
        }
        
        const cleanPhone = DOM.inputWhatsapp.value.replace(/[^\d]/g, '');
        if (cleanPhone.length < 10) {
            showInputError(DOM.inputWhatsapp, "Por favor, insira um WhatsApp válido.");
            isValid = false;
        }
    } else {
        // Para etapas de escolha, verifica se há alguma marcada
        const currentStepEl = document.querySelector(`.form-step[data-step="${stepNum}"]`);
        const checkedRadio = currentStepEl.querySelector('input[type="radio"]:checked');
        if (!checkedRadio) {
            isValid = false;
        }
    }
    
    return isValid;
}

// SALVAR DADOS
function saveCurrentStepData(stepNum) {
    if (stepNum === 1) {
        formState.data.nome_agencia = DOM.inputAgencia.value.trim();
    } else if (stepNum === 2) {
        formState.data.nome_dono = DOM.inputDono.value.trim();
        formState.data.whatsapp_dono = DOM.inputWhatsapp.value.trim();
    }
    // Para escolhas de rádio, os valores são atualizados diretamente no evento "change"
}

// EXIBIR ERRO NO INPUT
function showInputError(inputEl, message) {
    inputEl.classList.add("invalid-field");
    
    // Verifica se já tem erro desenhado
    const parent = inputEl.parentNode;
    let errEl = parent.querySelector(".error-message");
    
    if (!errEl) {
        errEl = document.createElement("span");
        errEl.className = "error-message";
        errEl.style.color = "#FF4B4B";
        errEl.style.fontSize = "0.75rem";
        errEl.style.fontWeight = "600";
        errEl.style.marginTop = "6px";
        errEl.style.display = "block";
        errEl.innerText = message;
        parent.appendChild(errEl);
    }
}

// EFEITO DE TREMULAÇÃO (Quando falha a validação)
function shakeElement(element) {
    element.style.animation = "none";
    // Forçar reflow do browser
    void element.offsetWidth; 
    element.style.animation = "stepShake 0.4s ease-in-out";
    
    // Adiciona o estilo de shake dinamicamente se não estiver no CSS
    if (!document.getElementById("shake-keyframes")) {
        const style = document.createElement("style");
        style.id = "shake-keyframes";
        style.innerHTML = `
            @keyframes stepShake {
                0%, 100% { transform: translateX(0); }
                20%, 60% { transform: translateX(-8px); }
                40%, 80% { transform: translateX(8px); }
            }
        `;
        document.head.appendChild(style);
    }
}

// AUTO-FOCUS NO INPUT ATIVO
function focusCurrentInput() {
    const activeStepEl = document.querySelector(".form-step.active");
    if (!activeStepEl) return;
    
    const textInput = activeStepEl.querySelector('input[type="text"], input[type="tel"]');
    if (textInput) {
        textInput.focus();
    }
}

// ATUALIZAR BARRA DE PROGRESSO & CORES DAS ORBES
function updateProgress() {
    const total = formState.totalSteps;
    const current = Math.min(formState.currentStep, total);
    
    // Percentual da barra
    const percentage = Math.round(((current - 1) / (total - 1)) * 100);
    DOM.progressBar.style.width = `${percentage}%`;
    
    // Texto de progresso
    if (formState.currentStep <= total) {
        DOM.progressText.innerText = `Passo ${current} de ${total}`;
        DOM.btnBack.classList.toggle("visible", formState.currentStep > 1);
    } else {
        // Etapa de loading ou resultado final
        DOM.progressText.innerText = "Conclusão";
        DOM.btnBack.classList.remove("visible");
    }
    
    // Mudar posições das orbes interativamente conforme avança para dar dinamismo
    if (DOM.orb1 && DOM.orb2) {
        const offset = (formState.currentStep - 1) * 30;
        DOM.orb1.style.transform = `translate(${offset}px, ${-offset}px) scale(${1 + (offset/300)})`;
        DOM.orb2.style.transform = `translate(${-offset}px, ${offset}px) scale(${1 - (offset/400)})`;
    }
}

// SIMULAÇÃO DO CARREGAMENTO DO DIAGNÓSTICO (Passo 8)
function startLoadingSimulation() {
    let progress = 0;
    const intervalTime = 30; // 30ms por ciclo
    const duration = 3000; // 3 segundos de carregamento
    const steps = duration / intervalTime;
    const increment = 100 / steps;
    
    const interval = setInterval(() => {
        progress += increment;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            
            // Dispara envio de dados (Webhook se configurado) e carrega a tela de resultados
            finishDiagnostic();
        }
        
        DOM.loadingPercentage.innerText = `${Math.floor(progress)}%`;
        
        // Transições das mensagens de status na tela
        if (progress >= 30) {
            DOM.statusItems[1].classList.remove("active");
            DOM.statusItems[1].classList.add("completed");
            DOM.statusItems[2].classList.add("active");
        }
        if (progress >= 70) {
            DOM.statusItems[2].classList.remove("active");
            DOM.statusItems[2].classList.add("completed");
            DOM.statusItems[3].classList.add("active");
        }
    }, intervalTime);
}

// CONCLUSÃO & GERAÇÃO DE RESULTADOS (Passo 9)
function finishDiagnostic() {
    // 1. Preparar diagnósticos baseados nas respostas
    prepareResultContent();
    
    // 2. Enviar Webhook de forma assíncrona (se configurado)
    if (CONFIG.webhookUrl) {
        sendWebhookData();
    }
    
    // 3. Salvar localmente por segurança
    localStorage.setItem("lure_lead_diagnostico", JSON.stringify(formState.data));
    
    // 4. Mudar para tela final
    const currentStepEl = document.querySelector(".form-step.active"); // Passo 8 (loading)
    currentStepEl.classList.add("exit");
    
    setTimeout(() => {
        currentStepEl.classList.remove("active", "exit");
        
        formState.currentStep = 9;
        const resultStepEl = document.querySelector(`.form-step[data-step="9"]`);
        resultStepEl.classList.add("active");
        updateProgress();
    }, 300);
}

// PREPARAR TEXTO DO DIAGNÓSTICO E LINK DO WHATSAPP
function prepareResultContent() {
    const data = formState.data;
    
    // Preenche dados simples na tela
    DOM.resNomeAgencia.innerText = data.nome_agencia;
    DOM.resFat.innerText = data.faturamento;
    DOM.resEquipe.innerText = data.equipe;
    DOM.resGargalo.innerText = data.gargalo;
    DOM.resDor.innerText = data.dor_predominante;
    
    // Customizar a descrição do diagnóstico com base no gargalo
    let descDiagnostico = "";
    if (data.gargalo.includes("Comercial")) {
        descDiagnostico = "falta de previsibilidade de vendas e captação ineficiente de clientes de alto ticket. Sem um comercial estruturado, sua agência fica exposta à instabilidade financeira.";
    } else if (data.gargalo.includes("Operacional")) {
        descDiagnostico = "centralização extrema de atividades na sua figura (dono). A entrega operacional consome seu tempo estratégico, impedindo você de focar em prospecção e crescimento.";
    } else if (data.gargalo.includes("Retenção")) {
        descDiagnostico = "alto índice de cancelamento (churn) dos clientes. Você gasta energia para trazer novas contas, mas elas saem rápido demais devido à falta de alinhamento de expectativas ou entrega fraca.";
    } else {
        descDiagnostico = "cobrança abaixo da média de mercado (subprecificação). Para escalar até os R$ 100k você precisa de dezenas de clientes pequenos, o que satura sua estrutura de entrega operacional.";
    }
    DOM.resDescricaoDiag.innerHTML = descDiagnostico;
    
    // Montagem da mensagem do WhatsApp
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

    // Configura o link de direcionamento final
    const encodedMessage = encodeURIComponent(message);
    DOM.btnWhatsappCta.href = `https://api.whatsapp.com/send?phone=${CONFIG.whatsappNumber}&text=${encodedMessage}`;
}

// INTEGRAR WEBHOOK
function sendWebhookData() {
    fetch(CONFIG.webhookUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            origem: "LP HTML",
            data_envio: new Date().toISOString(),
            ...formState.data
        })
    })
    .then(response => {
        console.log("Webhook enviado com sucesso:", response.status);
    })
    .catch(error => {
        console.error("Erro ao enviar webhook:", error);
    });
}
