/**
 * Dados de todas as etapas do formulário de diagnóstico.
 * Cada etapa define seu tipo (input, choice, loading, result),
 * seus campos e opções.
 */

export const STEPS = [
  // STEP 1: Nome da Agência
  {
    step: 1,
    type: "input",
    badge: "Etapa 1: Identificação",
    title: (
      <>
        Para começarmos, qual é o <span className="text-gradient">nome da sua agência</span>?
      </>
    ),
    desc: "Queremos entender seu negócio. Digite o nome comercial ou da sua marca.",
    fields: [
      {
        name: "nome_agencia",
        type: "text",
        placeholder: "Ex: Alfa Digital",
        required: true,
        autoComplete: "off"
      }
    ]
  },

  // STEP 2: Nome & WhatsApp
  {
    step: 2,
    type: "input",
    badge: "Etapa 2: Contato",
    title: (
      <>
        Qual é o seu <span className="text-gradient">nome</span> e o seu{" "}
        <span className="text-gradient">WhatsApp</span> pessoal?
      </>
    ),
    desc: "Seu WhatsApp será usado para enviarmos o resultado do seu diagnóstico.",
    fields: [
      {
        name: "nome_dono",
        type: "text",
        label: "Seu Nome",
        placeholder: "Ex: Felipe",
        required: true,
        autoComplete: "name"
      },
      {
        name: "whatsapp_dono",
        type: "tel",
        label: "Seu WhatsApp",
        placeholder: "(00) 00000-0000",
        required: true,
        autoComplete: "tel"
      }
    ]
  },

  // STEP 3: Faturamento Mensal
  {
    step: 3,
    type: "choice",
    layout: "grid",
    badge: "Etapa 3: Faturamento",
    title: (
      <>
        Qual o <span className="text-gradient">faturamento mensal atual</span> da sua agência?
      </>
    ),
    desc: "Seja sincero. Esta informação é fundamental para traçar a sua rota até os R$ 100k.",
    fieldName: "faturamento",
    options: [
      { value: "Até R$ 10.000", label: "Até R$ 10.000 / mês" },
      { value: "R$ 10.000 a R$ 30.000", label: "De R$ 10.000 a R$ 30.000 / mês" },
      { value: "R$ 30.000 a R$ 50.000", label: "De R$ 30.000 a R$ 50.000 / mês" },
      { value: "R$ 50.000 a R$ 100.000", label: "De R$ 50.000 a R$ 100.000 / mês" },
      { value: "Mais de R$ 100.000", label: "Já faturamos mais de R$ 100.000 / mês" }
    ]
  },

  // STEP 4: Tamanho da Equipe
  {
    step: 4,
    type: "choice",
    layout: "grid",
    badge: "Etapa 4: Operação",
    title: (
      <>
        Como está estruturada a sua <span className="text-gradient">equipe hoje</span>?
      </>
    ),
    desc: "Precisamos entender seu nível de delegabilidade e gargalo na entrega.",
    fieldName: "equipe",
    options: [
      { value: "Eu sozinho", label: "Eu sozinho (Eu-gência)" },
      { value: "2 a 5 pessoas", label: "2 a 5 pessoas (freelancers recorrentes ou parceiros)" },
      { value: "6 a 15 colaboradores", label: "6 a 15 colaboradores fixos" },
      { value: "Mais de 15 colaboradores", label: "Mais de 15 colaboradores" }
    ]
  },

  // STEP 5: Maior Impedimento
  {
    step: 5,
    type: "choice",
    layout: "stack",
    badge: "Etapa 5: Gargalos",
    title: (
      <>
        Qual é o <span className="text-gradient">principal impedimento</span> que te impede de bater
        os R$ 100k/mês?
      </>
    ),
    desc: "Selecione a opção que melhor descreve o seu maior gargalo atual.",
    fieldName: "gargalo",
    options: [
      {
        value: "Falta de Comercial Previsível",
        title: "Falta de Comercial Previsível",
        sub: "Tenho dificuldade em prospectar e fechar novos clientes de alto ticket recorrentemente."
      },
      {
        value: "Operacional Travado no Dono",
        title: "Operação Dependente de Mim (Gargalo do Dono)",
        sub: "Centralizo tudo de entrega, suporte e financeiro. Sem tempo para o comercial."
      },
      {
        value: "Retenção Baixa e Churn Alto",
        title: "Churn Alto / Baixa Retenção",
        sub: "Os clientes saem rápido demais (churn), fazendo com que eu tenha que correr para empatar."
      },
      {
        value: "Subprecificação de Serviços",
        title: "Subprecificação e Falta de Posicionamento",
        sub: "Cobramos muito barato pelos serviços e competimos por preço com concorrentes amadores."
      }
    ]
  },

  // STEP 6: Sentimento / Dor
  {
    step: 6,
    type: "choice",
    layout: "grid",
    badge: "Etapa 6: Diagnóstico Humano",
    title: (
      <>
        Como dono, qual o seu <span className="text-gradient">sentimento predominante</span> hoje?
      </>
    ),
    desc: "O crescimento do seu negócio está totalmente ligado ao seu estado mental e foco diário.",
    fieldName: "dor_predominante",
    options: [
      {
        value: "Extrema Sobrecarga",
        label: (
          <>
            <strong>Extrema Sobrecarga</strong> (trabalhando 12h+ e sem tempo para gerir)
          </>
        )
      },
      {
        value: "Insegurança Financeira",
        label: (
          <>
            <strong>Insegurança</strong> (medo constante de perder clientes grandes e quebrar)
          </>
        )
      },
      {
        value: "Sensação de Estagnação",
        label: (
          <>
            <strong>Estagnação</strong> (preso no mesmo patamar de receita há meses/anos)
          </>
        )
      },
      {
        value: "Frustração com Margem",
        label: (
          <>
            <strong>Frustração</strong> (trabalho duro, faturamento OK, mas lucro líquido zerado)
          </>
        )
      }
    ]
  },

  // STEP 7: Prontidão Comercial
  {
    step: 7,
    type: "choice",
    layout: "stack",
    badge: "Etapa 7: Próximo Passo",
    title: (
      <>
        Você estaria pronto para{" "}
        <span className="text-gradient">investir financeiramente</span> em mentoria para estruturar
        seus processos comerciais e operacionais?
      </>
    ),
    desc: "Seja sincero sobre o seu momento de mercado e prioridades.",
    fieldName: "prontidao",
    options: [
      {
        value: "Sim, buscando ajuda ativa",
        title: "Sim, estou buscando ajuda ativa agora",
        sub: "Estou comprometido em investir para acelerar o crescimento e delegar a entrega."
      },
      {
        value: "Quero entender como funciona primeiro",
        title: "Quero entender o funcionamento antes",
        sub: "Tenho interesse, mas preciso ver as condições de acompanhamento primeiro."
      },
      {
        value: "Não tenho orçamento no momento",
        title: "No momento não tenho orçamento",
        sub: "Estou buscando apenas conteúdo gratuito para tentar sozinho por enquanto."
      }
    ]
  },

  // STEP 8: Loading
  {
    step: 8,
    type: "loading"
  },

  // STEP 9: Result
  {
    step: 9,
    type: "result"
  }
];

export const TOTAL_QUESTION_STEPS = 7;
