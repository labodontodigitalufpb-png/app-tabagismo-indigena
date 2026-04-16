import { useEffect, useMemo, useState } from "react";
import "./index.css";

const HEADER_PARTNERSHIP =
  "Parceria PET Saúde Digital Unifal e UFAM / UNESP SJC Odontologia / LABODIGIT UFPB";

const STORAGE_KEY = "app_tabagismo_casos_v6";
const MAX_SCORE_USO = 10;
const MAX_SCORE_FAGERSTROM = 10;
const MAX_SCORE_CULTURAL = 30;
const MAX_SCORE_AUDIT = 40;
const MAX_SCORE_TOTAL =
  MAX_SCORE_USO + MAX_SCORE_FAGERSTROM + MAX_SCORE_CULTURAL + MAX_SCORE_AUDIT;

const GOOGLE_SCRIPT_URL = (import.meta.env.VITE_GOOGLE_SCRIPT_URL || "").trim();
const GOOGLE_SCRIPT_NOT_CONFIGURED_MESSAGE =
  "Configure a URL do Apps Script do laboratório para habilitar o envio ao Google Sheets.";

const RELIGIOES_OPTIONS = [
  "religião/tradição indígena da comunidade",
  "catolicismo",
  "religião evangélica/protestante",
  "espiritismo",
  "religiões de matriz africana",
  "outra espiritualidade/religiosidade",
  "não segue religião ou espiritualidade específica",
  "prefere não responder",
  "outro",
];

const CONTEXTOS_ENVOLVEM_USO = [
  "ritual",
  "cerimônia espiritual",
  "cura/tratamento tradicional",
  "uso como medicamento tradicional",
  "benzimentos/rezas",
  "luto/cerimônia",
  "rodas de conversa",
  "reuniões comunitárias",
  "festas ou celebrações",
  "trabalho/roça/caça/pesca",
  "outro",
];

const PRODUTOS_SUBSTANCIAS = [
  "cigarro industrializado",
  "fumo de rolo",
  "cigarro de palha/artesanal",
  "rapé",
  "cachimbo",
  "charuto",
  "cigarro eletrônico",
  "narguilé",
  "tabaco ritual/tradicional",
  "outra planta para fumar",
  "outros",
];

const CONTEXTOS_UTILIZA = [
  "ritual",
  "cotidiano",
  "social",
  "trabalho",
  "festas",
  "luto/cerimônia",
  "cura/tratamento tradicional",
  "uso como medicamento tradicional",
  "rodas de conversa",
  "reuniões comunitárias",
  "quando está sozinho",
  "outro",
];

const FINALIDADES_USO = [
  "ritual/espiritual",
  "socialização",
  "alívio emocional",
  "alívio da vontade de fumar",
  "costume diário",
  "pressão social",
  "tradição familiar",
  "cura/tratamento tradicional",
  "medicamento tradicional",
  "participação em rodas de conversa",
  "relaxamento",
  "outro",
];

const BINARIO_OPTIONS = [
  { value: "sim", label: "Sim" },
  { value: "nao", label: "Não" },
  { value: "nao_sabe_informar", label: "Não sabe informar" },
];

const BINARIO_COM_PREFERE_OPTIONS = [
  { value: "sim", label: "Sim" },
  { value: "nao", label: "Não" },
  { value: "nao_sabe_informar", label: "Não sabe informar" },
  { value: "prefere_nao_responder", label: "Prefere não responder" },
];

const QUEM_INFLUENCIOU_OPTIONS = [
  { value: "familia", label: "Família" },
  { value: "amigos", label: "Amigos" },
  { value: "lideranca_indigena", label: "Liderança indígena" },
  { value: "paje_rezador_curador", label: "Pajé/rezador/curador tradicional" },
  { value: "comunidade", label: "Comunidade" },
  { value: "comercio_propaganda", label: "Comércio/propaganda" },
  { value: "internet_redes_sociais", label: "Internet/redes sociais" },
  { value: "ninguem_influenciou", label: "Ninguém influenciou" },
  { value: "outro", label: "Outro" },
];

const INICIO_CONTEXTO_RITUAL_OPTIONS = [
  { value: "sim", label: "Sim" },
  { value: "nao", label: "Não" },
  { value: "parcialmente", label: "Parcialmente" },
  { value: "nao_sabe_informar", label: "Não sabe informar" },
];

const IDADE_PRIMEIRA_PARTICIPACAO_OPTIONS = [
  { value: "nunca_participei", label: "Nunca participei" },
  { value: "menos_de_10", label: "Menos de 10 anos" },
  { value: "10_a_14", label: "10 a 14 anos" },
  { value: "15_a_17", label: "15 a 17 anos" },
  { value: "18_a_24", label: "18 a 24 anos" },
  { value: "25_ou_mais", label: "25 anos ou mais" },
  { value: "nao_sabe_informar", label: "Não sabe informar" },
  { value: "prefere_nao_responder", label: "Prefere não responder" },
];

const IDADE_INICIO_USO_RITUAL_OPTIONS = [
  { value: "nunca_usei", label: "Nunca usei" },
  { value: "menos_de_10", label: "Menos de 10 anos" },
  { value: "10_a_14", label: "10 a 14 anos" },
  { value: "15_a_17", label: "15 a 17 anos" },
  { value: "18_a_24", label: "18 a 24 anos" },
  { value: "25_ou_mais", label: "25 anos ou mais" },
  { value: "nao_sabe_informar", label: "Não sabe informar" },
  { value: "prefere_nao_responder", label: "Prefere não responder" },
];

const PERCEPCAO_COMUNIDADE_OPTIONS = [
  { value: "pratica_tradicional_respeitada", label: "Como prática tradicional respeitada" },
  { value: "habito_cotidiano_comum", label: "Como hábito cotidiano comum" },
  { value: "problema_de_saude", label: "Como problema de saúde" },
  { value: "pratica_social_convivencia", label: "Como prática social/de convivência" },
  { value: "restrito_a_pessoas_ou_momentos", label: "Como algo restrito a determinadas pessoas ou momentos" },
  { value: "ha_opinioes_diferentes", label: "Há opiniões diferentes na comunidade" },
  { value: "nao_sabe_informar", label: "Não sabe informar" },
  { value: "outro", label: "Outro" },
];

const PRODUTO_PRINCIPAL_ORIGEM_OPTIONS = [
  { value: "produzido_preparado_na_comunidade", label: "Produzido/preparado na comunidade" },
  { value: "comprado_em_comercio", label: "Comprado em comércio" },
  { value: "recebido_de_familiares_ou_comunidade", label: "Recebido de familiares ou membros da comunidade" },
  { value: "recebido_em_contexto_ritual_tradicional", label: "Recebido em contexto ritual/tradicional" },
  { value: "nao_sabe_informar", label: "Não sabe informar" },
  { value: "outro", label: "Outro" },
];

const FORMA_PRINCIPAL_CONSUMO_OPTIONS = [
  { value: "cigarro_industrializado", label: "Cigarro industrializado" },
  { value: "cigarro_artesanal_palha", label: "Cigarro artesanal/de palha" },
  { value: "cachimbo", label: "Cachimbo" },
  { value: "rape", label: "Rapé" },
  { value: "mascado", label: "Mascado" },
  { value: "charuto", label: "Charuto" },
  { value: "cigarro_eletronico", label: "Cigarro eletrônico" },
  { value: "narguile", label: "Narguilé" },
  { value: "outra", label: "Outra" },
];

const USO_OCORRE_FREQUENTEMENTE_OPTIONS = [
  { value: "apenas_rituais_tradicoes", label: "Apenas em rituais/tradições" },
  { value: "rituais_e_cotidiano", label: "Em rituais e também no cotidiano" },
  { value: "principalmente_cotidiano", label: "Principalmente no cotidiano" },
  { value: "principalmente_social", label: "Principalmente em situações sociais" },
  { value: "principalmente_rodas_conversa", label: "Principalmente em rodas de conversa" },
  { value: "principalmente_cura_tratamento_tradicional", label: "Principalmente para cura/tratamento tradicional" },
  { value: "principalmente_vontade_necessidade", label: "Principalmente quando sente vontade/necessidade" },
  { value: "nao_sabe_informar", label: "Não sabe informar" },
];

const AUDIT_Q1_OPTIONS = [
  { label: "Nunca", value: "0" },
  { label: "Mensalmente ou menos", value: "1" },
  { label: "2 a 4 vezes por mês", value: "2" },
  { label: "2 a 3 vezes por semana", value: "3" },
  { label: "4 ou mais vezes por semana", value: "4" },
];

const AUDIT_Q2_OPTIONS = [
  { label: "1 ou 2 doses", value: "0" },
  { label: "3 ou 4 doses", value: "1" },
  { label: "5 ou 6 doses", value: "2" },
  { label: "7 a 9 doses", value: "3" },
  { label: "10 ou mais doses", value: "4" },
];

const AUDIT_Q3_OPTIONS = [
  { label: "Nunca", value: "0" },
  { label: "Menos de uma vez por mês", value: "1" },
  { label: "Mensalmente", value: "2" },
  { label: "Semanalmente", value: "3" },
  { label: "Diariamente ou quase diariamente", value: "4" },
];

const AUDIT_Q4_TO_Q8_OPTIONS = [
  { label: "Nunca", value: "0" },
  { label: "Menos de uma vez por mês", value: "1" },
  { label: "Mensalmente", value: "2" },
  { label: "Semanalmente", value: "3" },
  { label: "Diariamente ou quase diariamente", value: "4" },
];

const AUDIT_Q9_Q10_OPTIONS = [
  { label: "Não", value: "0" },
  { label: "Sim, mas não no último ano", value: "2" },
  { label: "Sim, durante o último ano", value: "4" },
];

const INITIAL_FAGERSTROM = {
  tipoUsuario: "",
  primeiroCigarro: "",
  dificuldadeLocais: "",
  cigarroMaisDificil: "",
  cigarrosDia: "",
  fumaMaisManha: "",
  fumaDoente: "",
  despertaNoiteFumar: "",
  sintomasAbstinencia: "",
  tentativasSemSucesso: "",
};

const initialState = {
  participante: {
    identificacao: "",
    telefone: "",
    idade: "",
    sexo: "",
    aldeia: "",
    municipio: "",
    estado: "",
    etnia: "",
    entrevistador: "",
    data: "",
    idioma: "",
    localResidencia: "",
    recebeVisitaSaude: "",
    circulaCidadeAldeia: "",
  },
  uso: {
    usoAtual: "",
    frequencia: "",
    idadeInicioRitual: "",
    idadeInicioRegular: "",
    produtoPrincipal: [],
    produtoOutros: "",
    cigarrosDia: "",
    exposicaoDomiciliar: "",
    exposicaoTrabalhoEscola: "",
    tentativaParar: "",
    vezesTentou: "",
    motivoRecaida: "",
    apoioPrevio: "",
    interesseParar: "",
    estagioMotivacional: "",
    encaminhamentoNecessario: "",
    formaObtencao: "",
    cultivoLocal: "",
    observacoes: "",
  },
  fagerstrom: { ...INITIAL_FAGERSTROM },
  cultural: {
    religioes: [],
    religioesOutro: "",
    usoTradicionalExiste: [],
    participouRitualTabaco: [],
    contextosEnvolvemUso: [],
    contextosEnvolvemUsoOutro: "",
    quemInfluenciou: [],
    quemInfluenciouOutro: "",
    inicioEmContextoRitualTradicional: [],
    houveEscolha: [],
    idadePrimeiraParticipacaoRitual: [],
    idadeInicioUsoRitual: [],
    percepcaoComunidade: [],
    percepcaoComunidadeOutro: "",
    diferencaTradicionalComercial: [],
    diferencaPrincipal: "",
    produtoSubstanciaUtilizada: [],
    produtoSubstanciaUtilizadaOutros: "",
    produtoPrincipalOrigem: [],
    produtoPrincipalOrigemOutro: "",
    contextosUtiliza: [],
    contextosUtilizaOutro: "",
    finalidadeUso: [],
    finalidadeUsoOutro: "",
    formaPrincipalConsumo: [],
    formaPrincipalConsumoOutra: "",
    usoOcorreMaisFrequentemente: [],
    usoMedicamentoCuraPessoal: [],
    usoRodasConversaPessoal: [],
    usoRitualBebidasAlcoolicas: [],
    sintomasDuranteUsoRitual: [],
  },
  audit: {
    q1: "",
    q2: "",
    q3: "",
    q4: "",
    q5: "",
    q6: "",
    q7: "",
    q8: "",
    q9: "",
    q10: "",
  },
};

function toggleArray(arr, value) {
  return arr.includes(value)
    ? arr.filter((item) => item !== value)
    : [...arr, value];
}

function scoreFagerstrom(f) {
  if (f.tipoUsuario !== "cigarro_industrializado") return 0;

  let score = 0;

  if (f.primeiroCigarro === "5") score += 3;
  else if (f.primeiroCigarro === "30") score += 2;
  else if (f.primeiroCigarro === "60") score += 1;

  if (f.dificuldadeLocais === "sim") score += 1;
  if (f.cigarroMaisDificil === "primeiro") score += 1;

  if (f.cigarrosDia === "20") score += 1;
  else if (f.cigarrosDia === "30") score += 2;
  else if (f.cigarrosDia === "31+") score += 3;

  if (f.fumaMaisManha === "sim") score += 1;
  if (f.fumaDoente === "sim") score += 1;

  return score;
}

function classifyFagerstrom(score, tipoUsuario) {
  if (tipoUsuario !== "cigarro_industrializado") {
    return "Escala não aplicável diretamente; usar avaliação clínica complementar";
  }
  if (score <= 2) return "Muito baixa";
  if (score <= 4) return "Baixa";
  if (score === 5) return "Média";
  if (score <= 7) return "Elevada";
  return "Muito elevada";
}

function scoreUso(uso) {
  let score = 0;

  if (uso.usoAtual === "sim") score += 2;
  if (uso.frequencia === "diario") score += 2;
  else if (uso.frequencia === "semanal") score += 1;

  const cig = Number(uso.cigarrosDia || 0);
  if (cig >= 20) score += 2;
  else if (cig >= 1) score += 1;

  if (uso.exposicaoDomiciliar === "sim") score += 1;
  if (uso.exposicaoTrabalhoEscola === "sim") score += 1;
  if (uso.tentativaParar === "nao") score += 1;
  if (uso.interesseParar === "sim") score += 1;

  return Math.min(score, 10);
}

function classifyUso(score) {
  if (score <= 3) return "Baixo padrão de uso";
  if (score <= 6) return "Padrão intermediário";
  return "Padrão elevado";
}

function scoreCultural(cultural) {
  const first = (arr) => (Array.isArray(arr) && arr.length ? arr[0] : "");
  const has = (arr, value) => Array.isArray(arr) && arr.includes(value);

  let score = 0;

  // 1) Exposição e inserção cultural do uso
  if (has(cultural.usoTradicionalExiste, "sim")) score += 1;
  if (has(cultural.participouRitualTabaco, "sim")) score += 1;
  if (has(cultural.contextosEnvolvemUso, "ritual")) score += 1;
  if (has(cultural.contextosEnvolvemUso, "cura/tratamento tradicional")) score += 1;
  if (has(cultural.contextosEnvolvemUso, "uso como medicamento tradicional")) score += 1;

  // 2) Início precoce e autonomia de escolha
  const idadeInicioRitual = first(cultural.idadeInicioUsoRitual);
  if (idadeInicioRitual === "menos_de_10") score += 3;
  else if (idadeInicioRitual === "10_a_14") score += 2;
  else if (idadeInicioRitual === "15_a_17") score += 1;

  const houveEscolha = first(cultural.houveEscolha);
  if (houveEscolha === "nao") score += 2;
  else if (houveEscolha === "parcialmente") score += 1;

  // 3) Uso além do ritual e motivadores de manutenção
  if (has(cultural.contextosUtiliza, "cotidiano")) score += 2;
  if (has(cultural.contextosUtiliza, "quando está sozinho")) score += 2;
  if (has(cultural.contextosUtiliza, "trabalho")) score += 1;

  const frequenciaContexto = first(cultural.usoOcorreMaisFrequentemente);
  if (frequenciaContexto === "rituais_e_cotidiano") score += 2;
  else if (frequenciaContexto === "principalmente_cotidiano") score += 3;
  else if (frequenciaContexto === "principalmente_vontade_necessidade") score += 3;

  if (has(cultural.finalidadeUso, "alívio da vontade de fumar")) score += 3;
  if (has(cultural.finalidadeUso, "alívio emocional")) score += 2;
  if (has(cultural.finalidadeUso, "costume diário")) score += 2;
  if (has(cultural.finalidadeUso, "socialização")) score += 1;
  if (has(cultural.finalidadeUso, "relaxamento")) score += 1;

  // 4) Marcadores adicionais de risco
  if (has(cultural.diferencaTradicionalComercial, "nao")) score += 2;
  if (has(cultural.usoRitualBebidasAlcoolicas, "sim")) score += 2;

  const sintomasRitual = first(cultural.sintomasDuranteUsoRitual);
  if (sintomasRitual === "sim") score += 2;
  else if (sintomasRitual === "nao_sei") score += 1;

  return Math.min(score, MAX_SCORE_CULTURAL);
}

function classifyCultural(score) {
  if (score <= 9) return "Baixa complexidade cultural";
  if (score <= 18) return "Complexidade cultural moderada";
  return "Alta complexidade cultural";
}

function scoreAUDIT(audit) {
  return Object.values(audit).reduce((acc, value) => acc + Number(value || 0), 0);
}

function classifyAUDIT(score) {
  if (score <= 7) return "Baixo risco";
  if (score <= 15) return "Uso de risco";
  if (score <= 19) return "Uso nocivo";
  return "Provável dependência";
}

function classifyDependenciaGeral(total) {
  if (total <= 30) return "Ausente / Baixo";
  if (total <= 60) return "Moderado";
  return "Alto";
}

function getDependenciaBarClass(total) {
  if (total <= 30) return "level-low";
  if (total <= 60) return "level-medium";
  return "level-high";
}

function getDependenciaBarWidth(total) {
  const percent = Math.max(0, Math.min((total / MAX_SCORE_TOTAL) * 100, 100));
  return `${percent}%`;
}

function normalizeCasePhone(caso) {
  if (!caso || typeof caso !== "object") return caso;

  const currentPhone = String(caso.telefone || "").trim();
  if (currentPhone) return caso;

  const identificacao = String(caso.identificacao || "").trim();
  const digits = identificacao.replace(/\D/g, "");
  if (digits.length < 8) return caso;

  return {
    ...caso,
    telefone: identificacao,
  };
}

function loadCasesFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.map(normalizeCasePhone) : [];
  } catch {
    return [];
  }
}

function AuditQuestion({ title, value, onChange, options }) {
  return (
    <div className="audit-question">
      <label className="audit-label">{title}</label>
      <select value={value} onChange={onChange}>
        <option value="">Selecione</option>
        {options.map((option) => (
          <option key={`${title}-${option.label}`} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function SectionHint({ children }) {
  return <p className="section-hint">{children}</p>;
}

function MultiChoiceField({ title, options, values, onToggle, singleChoice = false }) {
  const handleChange = (value) => {
    if (singleChoice) {
      onToggle(values.includes(value) ? [] : [value]);
      return;
    }
    onToggle(toggleArray(values, value));
  };

  return (
    <div className="multi-group full">
      <p>{title}</p>
      <div className="checks">
        {options.map((option) => (
          <label key={`${title}-${option.value}`}>
            <input
              type="checkbox"
              checked={values.includes(option.value)}
              onChange={() => handleChange(option.value)}
            />
            {option.label}
          </label>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState("uso");
  const [form, setForm] = useState(initialState);
  const [casos, setCasos] = useState(loadCasesFromStorage);
  const [enviandoSheets, setEnviandoSheets] = useState(false);
  const [mensagemEnvio, setMensagemEnvio] = useState("");
  const googleScriptConfigured = GOOGLE_SCRIPT_URL.length > 0;
  const fagerstromDisponivel = form.uso.produtoPrincipal.includes("cigarro industrializado");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(casos));
  }, [casos]);

  useEffect(() => {
    setForm((prev) => {
      if (!fagerstromDisponivel) {
        const jaLimpo = Object.values(prev.fagerstrom).every((value) => value === "");
        if (jaLimpo) return prev;
        return {
          ...prev,
          fagerstrom: { ...INITIAL_FAGERSTROM },
        };
      }

      if (prev.fagerstrom.tipoUsuario === "cigarro_industrializado") return prev;
      return {
        ...prev,
        fagerstrom: {
          ...prev.fagerstrom,
          tipoUsuario: "cigarro_industrializado",
        },
      };
    });
  }, [fagerstromDisponivel]);

  const updateNested = (section, key, value) => {
    setForm((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }));
  };

  const updateCulturalChoice = (key, values, clearField, clearOnValues = []) => {
    setForm((prev) => {
      const nextCultural = {
        ...prev.cultural,
        [key]: values,
      };

      if (clearField && clearOnValues.some((value) => values.includes(value))) {
        nextCultural[clearField] = "";
      }

      return {
        ...prev,
        cultural: nextCultural,
      };
    });
  };

  const fagerScore = useMemo(
    () => scoreFagerstrom(form.fagerstrom),
    [form.fagerstrom]
  );

  const usoScore = useMemo(() => scoreUso(form.uso), [form.uso]);
  const culturalScore = useMemo(() => scoreCultural(form.cultural), [form.cultural]);
  const auditScore = useMemo(() => scoreAUDIT(form.audit), [form.audit]);
  const total = fagerScore + usoScore + culturalScore + auditScore;

  const prioridade =
    total <= 30
      ? "Baixa prioridade"
      : total <= 60
      ? "Prioridade moderada"
      : "Alta prioridade para abordagem";

  const salvarCaso = () => {
    const culturalFlat = Object.fromEntries(
      Object.entries(form.cultural).map(([key, value]) => [
        key,
        Array.isArray(value) ? value.join(", ") : value,
      ])
    );

    const novoCaso = {
      id: Date.now(),
      ...form.participante,
      ...form.uso,
      ...form.fagerstrom,
      ...form.audit,
      produtoPrincipal: form.uso.produtoPrincipal.join(", "),
      ...culturalFlat,
      scoreUso: usoScore,
      classificacaoUso: classifyUso(usoScore),
      scoreFagerstrom: fagerScore,
      classificacaoFagerstrom: classifyFagerstrom(
        fagerScore,
        form.fagerstrom.tipoUsuario
      ),
      scoreCultural: culturalScore,
      classificacaoCultural: classifyCultural(culturalScore),
      scoreAUDIT: auditScore,
      classificacaoAUDIT: classifyAUDIT(auditScore),
      scoreTotal: total,
      prioridadeFinal: prioridade,
      classificacaoGeral: classifyDependenciaGeral(total),
      dataRegistro: new Date().toISOString(),
    };

    setCasos((prev) => [...prev, novoCaso]);
    setForm(initialState);
    setTab("uso");
    setMensagemEnvio("");
    alert("Caso salvo com sucesso.");
  };

  const enviarParaGoogleSheets = async () => {
    if (!googleScriptConfigured) {
      setMensagemEnvio(GOOGLE_SCRIPT_NOT_CONFIGURED_MESSAGE);
      alert("Defina a URL do Apps Script do laboratório antes de enviar.");
      return;
    }

    if (casos.length === 0) {
      alert("Nenhum caso foi salvo ainda.");
      return;
    }

    setEnviandoSheets(true);
    setMensagemEnvio("");

    try {
      const formData = new FormData();
      const casosNormalizados = casos.map(normalizeCasePhone);

      formData.append(
        "payload",
        JSON.stringify({
          origem: "app-tabagismo-indigena",
          timestampEnvio: new Date().toISOString(),
          quantidadeCasos: casosNormalizados.length,
          casos: casosNormalizados,
        })
      );

      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        body: formData,
      });

      const texto = await response.text();
      let json = {};

      try {
        json = JSON.parse(texto);
      } catch {
        json = {};
      }

      if (!response.ok) {
        throw new Error(`Erro HTTP ${response.status}`);
      }

      if (json.sucesso === false) {
        throw new Error(json.mensagem || "Falha no envio.");
      }

      const detalhesEnvio = [
        "Dados enviados com sucesso para o Google Sheets.",
        json.envioId ? `envioId: ${json.envioId}` : "",
        json.planilhaId ? `planilhaId: ${json.planilhaId}` : "",
      ]
        .filter(Boolean)
        .join(" ");

      setMensagemEnvio(detalhesEnvio);
      alert("Dados enviados com sucesso para o Google Sheets.");
    } catch (error) {
      console.error("Erro ao enviar para Google Sheets:", error);
      const erroMensagem =
        error instanceof Error && error.message
          ? error.message
          : "Não foi possível enviar os dados ao Google Sheets.";
      setMensagemEnvio(erroMensagem);
      alert(erroMensagem);
    } finally {
      setEnviandoSheets(false);
    }
  };

  const resetAll = () => {
    setForm(initialState);
    setTab("uso");
    setMensagemEnvio("");
  };

  const removerCaso = (id) => {
    setCasos((prev) => prev.filter((caso) => caso.id !== id));
  };

  const limparTodosCasos = () => {
    const confirmar = window.confirm("Deseja realmente apagar todos os casos salvos?");
    if (!confirmar) return;
    setCasos([]);
    localStorage.removeItem(STORAGE_KEY);
    setMensagemEnvio("");
  };

  return (
    <div className="container">
      <header className="hero">
        <div className="hero-brand">
          <img
            src={`${import.meta.env.BASE_URL}logo-app.png`}
            alt="Logo Ybytu Livre"
            className="hero-logo"
          />
          <div className="hero-text">
            <div className="hero-top">{HEADER_PARTNERSHIP}</div>
            <h1>Ybytu Livre</h1>
            <p className="subtitle">Apoio para parar de fumar</p>
          </div>
        </div>
      </header>

      <div className="card">
        <h2>Identificação</h2>
        <SectionHint>
          Inclui local de residência/circulação e presença de equipe de saúde.
        </SectionHint>

        <div className="grid">
          <input
            placeholder="Nome do usuário"
            value={form.participante.identificacao}
            onChange={(e) =>
              updateNested("participante", "identificacao", e.target.value)
            }
          />
          <input
            placeholder="Telefone"
            value={form.participante.telefone}
            onChange={(e) => updateNested("participante", "telefone", e.target.value)}
          />
          <input
            placeholder="Idade"
            value={form.participante.idade}
            onChange={(e) => updateNested("participante", "idade", e.target.value)}
          />
          <input
            placeholder="Sexo"
            value={form.participante.sexo}
            onChange={(e) => updateNested("participante", "sexo", e.target.value)}
          />
          <input
            placeholder="Aldeia ou Polo"
            value={form.participante.aldeia}
            onChange={(e) => updateNested("participante", "aldeia", e.target.value)}
          />
          <input
            placeholder="Município"
            value={form.participante.municipio}
            onChange={(e) => updateNested("participante", "municipio", e.target.value)}
          />
          <input
            placeholder="Estado"
            value={form.participante.estado}
            onChange={(e) => updateNested("participante", "estado", e.target.value)}
          />
          <input
            placeholder="Etnia"
            value={form.participante.etnia}
            onChange={(e) => updateNested("participante", "etnia", e.target.value)}
          />
          <input
            placeholder="Entrevistador"
            value={form.participante.entrevistador}
            onChange={(e) =>
              updateNested("participante", "entrevistador", e.target.value)
            }
          />
          <div className="field-with-label field-date">
            <label htmlFor="data-entrevista">Data da entrevista</label>
            <input
              id="data-entrevista"
              type="date"
              aria-label="Data da entrevista"
              title="Data da entrevista"
              value={form.participante.data}
              onChange={(e) => updateNested("participante", "data", e.target.value)}
            />
          </div>
          <input
            placeholder="Idioma principal"
            value={form.participante.idioma}
            onChange={(e) => updateNested("participante", "idioma", e.target.value)}
          />

          <select
            value={form.participante.localResidencia}
            onChange={(e) =>
              updateNested("participante", "localResidencia", e.target.value)
            }
          >
            <option value="">Local de residência</option>
            <option value="aldeia">Vive na aldeia</option>
            <option value="cidade">Vive na cidade</option>
            <option value="circula">Circula entre aldeia e cidade</option>
          </select>

          <select
            value={form.participante.recebeVisitaSaude}
            onChange={(e) =>
              updateNested("participante", "recebeVisitaSaude", e.target.value)
            }
          >
            <option value="">Recebe visita de equipe de saúde?</option>
            <option value="sim">Sim</option>
            <option value="nao">Não</option>
            <option value="nao_sabe">Não sabe</option>
          </select>

          <select
            value={form.participante.circulaCidadeAldeia}
            onChange={(e) =>
              updateNested("participante", "circulaCidadeAldeia", e.target.value)
            }
          >
            <option value="">Circulação entre cidade e aldeia</option>
            <option value="frequente">Frequente</option>
            <option value="ocasional">Ocasional</option>
            <option value="nao">Não</option>
          </select>
        </div>
      </div>

      <div className="tabs">
        <button className={tab === "uso" ? "active" : ""} onClick={() => setTab("uso")}>
          Uso do tabaco
        </button>
        <button
          className={tab === "fagerstrom" ? "active" : ""}
          onClick={() => setTab("fagerstrom")}
        >
          Fagerström
        </button>
        <button className={tab === "audit" ? "active" : ""} onClick={() => setTab("audit")}>
          AUDIT
        </button>
        <button
          className={tab === "cultural" ? "active" : ""}
          onClick={() => setTab("cultural")}
        >
          Módulo cultural
        </button>
      </div>

      {tab === "uso" && (
        <div className="card">
          <h2>Questionário de uso de tabaco</h2>
          <SectionHint>
            Diferencia início ritual e início regular, contempla recaída, apoio prévio e encaminhamento.
          </SectionHint>

          <div className="grid">
            <select
              value={form.uso.usoAtual}
              onChange={(e) => updateNested("uso", "usoAtual", e.target.value)}
            >
              <option value="">Uso atual?</option>
              <option value="sim">Sim</option>
              <option value="nao">Não</option>
              <option value="ex">Ex-usuário</option>
            </select>

            <select
              value={form.uso.frequencia}
              onChange={(e) => updateNested("uso", "frequencia", e.target.value)}
            >
              <option value="">Frequência</option>
              <option value="diario">Diário</option>
              <option value="semanal">Semanal</option>
              <option value="ocasional">Ocasional</option>
              <option value="nao_usa">Não usa atualmente</option>
            </select>

            <input
              className="input-small-text"
              placeholder="Idade do primeiro uso em ritual/cerimônia"
              value={form.uso.idadeInicioRitual}
              onChange={(e) =>
                updateNested("uso", "idadeInicioRitual", e.target.value)
              }
            />

            <input
              placeholder="Idade de início do uso regular"
              value={form.uso.idadeInicioRegular}
              onChange={(e) =>
                updateNested("uso", "idadeInicioRegular", e.target.value)
              }
            />

            <input
              placeholder="Unidades por dia"
              value={form.uso.cigarrosDia}
              onChange={(e) => updateNested("uso", "cigarrosDia", e.target.value)}
            />

            <select
              value={form.uso.exposicaoDomiciliar}
              onChange={(e) =>
                updateNested("uso", "exposicaoDomiciliar", e.target.value)
              }
            >
              <option value="">Exposição de fumantes em casa</option>
              <option value="sim">Sim</option>
              <option value="nao">Não</option>
            </select>

            <select
              value={form.uso.exposicaoTrabalhoEscola}
              onChange={(e) =>
                updateNested("uso", "exposicaoTrabalhoEscola", e.target.value)
              }
            >
              <option value="">Exposição no trabalho/escola/comunidade</option>
              <option value="sim">Sim</option>
              <option value="nao">Não</option>
            </select>

            <select
              value={form.uso.tentativaParar}
              onChange={(e) =>
                updateNested("uso", "tentativaParar", e.target.value)
              }
            >
              <option value="">Já tentou parar?</option>
              <option value="sim">Sim</option>
              <option value="nao">Não</option>
            </select>

            <input
              placeholder="Quantas tentativas?"
              value={form.uso.vezesTentou}
              onChange={(e) => updateNested("uso", "vezesTentou", e.target.value)}
            />

            <input
              placeholder="Motivo principal de recaída"
              value={form.uso.motivoRecaida}
              onChange={(e) => updateNested("uso", "motivoRecaida", e.target.value)}
            />

            <select
              value={form.uso.apoioPrevio}
              onChange={(e) => updateNested("uso", "apoioPrevio", e.target.value)}
            >
              <option value="">Teve apoio prévio?</option>
              <option value="nenhum">Nenhum</option>
              <option value="profissional">Apoio profissional</option>
              <option value="medicamentoso">Apoio medicamentoso</option>
              <option value="ambos">Profissional + medicamentoso</option>
            </select>

            <select
              value={form.uso.interesseParar}
              onChange={(e) => updateNested("uso", "interesseParar", e.target.value)}
            >
              <option value="">Interesse em parar</option>
              <option value="sim">Sim</option>
              <option value="nao">Não</option>
              <option value="talvez">Talvez</option>
            </select>

            <select
              value={form.uso.estagioMotivacional}
              onChange={(e) =>
                updateNested("uso", "estagioMotivacional", e.target.value)
              }
            >
              <option value="">Estágio motivacional</option>
              <option value="pre_contemplacao">Pré-contemplação</option>
              <option value="contemplacao">Contemplação</option>
              <option value="preparacao">Preparação</option>
              <option value="acao">Ação</option>
              <option value="manutencao">Manutenção</option>
            </select>

            <select
              value={form.uso.encaminhamentoNecessario}
              onChange={(e) =>
                updateNested("uso", "encaminhamentoNecessario", e.target.value)
              }
            >
              <option value="">Necessita encaminhamento/orientação agora?</option>
              <option value="sim_imediato">Sim, imediato</option>
              <option value="sim_programado">Sim, programado</option>
              <option value="nao">Não</option>
            </select>

            <input
              placeholder="Como obtém o produto de tabaco?"
              value={form.uso.formaObtencao}
              onChange={(e) => updateNested("uso", "formaObtencao", e.target.value)}
            />

            <select
              value={form.uso.cultivoLocal}
              onChange={(e) => updateNested("uso", "cultivoLocal", e.target.value)}
            >
              <option value="">Há cultivo local de tabaco/outras plantas?</option>
              <option value="sim">Sim</option>
              <option value="nao">Não</option>
              <option value="nao_sabe">Não sabe</option>
            </select>

            <div className="multi-group full">
              <p>Produto principal (pode marcar mais de um)</p>
              <div className="checks">
              {PRODUTOS_SUBSTANCIAS.map((item) => (
                  <label key={item}>
                    <input
                      type="checkbox"
                      checked={form.uso.produtoPrincipal.includes(item)}
                      onChange={() =>
                        updateNested(
                          "uso",
                          "produtoPrincipal",
                          toggleArray(form.uso.produtoPrincipal, item)
                        )
                      }
                    />
                    {item}
                  </label>
                ))}
              </div>
            </div>

            {form.uso.produtoPrincipal.includes("outros") && (
              <input
                className="full"
                placeholder="Outros produtos (especificar)"
                value={form.uso.produtoOutros}
                onChange={(e) =>
                  updateNested("uso", "produtoOutros", e.target.value)
                }
              />
            )}
          </div>

          <textarea
            placeholder="Observações"
            value={form.uso.observacoes}
            onChange={(e) => updateNested("uso", "observacoes", e.target.value)}
          />
        </div>
      )}

      {tab === "fagerstrom" && (
        <div className="card">
          <h2>Teste de Fagerström</h2>
          <SectionHint>
            Aplicável somente quando o produto principal inclui cigarro industrializado.
          </SectionHint>
          {!fagerstromDisponivel && (
            <p className="blocked-note">
              Para liberar este bloco, marque "cigarro industrializado" em "Uso de
              tabaco" {">"} "Produto principal".
            </p>
          )}

          <div className={`grid ${!fagerstromDisponivel ? "section-locked" : ""}`}>
            <select
              value={form.fagerstrom.tipoUsuario}
              onChange={(e) =>
                updateNested("fagerstrom", "tipoUsuario", e.target.value)
              }
              disabled={!fagerstromDisponivel}
            >
              <option value="">Tipo principal de usuário (bloqueado)</option>
              <option value="cigarro_industrializado">Cigarro industrializado</option>
            </select>

            <select
              value={form.fagerstrom.primeiroCigarro}
              onChange={(e) =>
                updateNested("fagerstrom", "primeiroCigarro", e.target.value)
              }
              disabled={!fagerstromDisponivel}
            >
              <option value="">Primeiro cigarro após acordar</option>
              <option value="5">Até 5 minutos</option>
              <option value="30">6 a 30 minutos</option>
              <option value="60">31 a 60 minutos</option>
              <option value="61+">Após 60 minutos</option>
            </select>

            <select
              value={form.fagerstrom.dificuldadeLocais}
              onChange={(e) =>
                updateNested("fagerstrom", "dificuldadeLocais", e.target.value)
              }
              disabled={!fagerstromDisponivel}
            >
              <option value="">Dificuldade em locais proibidos?</option>
              <option value="sim">Sim</option>
              <option value="nao">Não</option>
            </select>

            <select
              value={form.fagerstrom.cigarroMaisDificil}
              onChange={(e) =>
                updateNested("fagerstrom", "cigarroMaisDificil", e.target.value)
              }
              disabled={!fagerstromDisponivel}
            >
              <option value="">Mais difícil abandonar</option>
              <option value="primeiro">Primeiro da manhã</option>
              <option value="outro">Outro</option>
            </select>

            <select
              value={form.fagerstrom.cigarrosDia}
              onChange={(e) =>
                updateNested("fagerstrom", "cigarrosDia", e.target.value)
              }
              disabled={!fagerstromDisponivel}
            >
              <option value="">Quantos cigarros por dia?</option>
              <option value="10">10 ou menos</option>
              <option value="20">11 a 20</option>
              <option value="30">21 a 30</option>
              <option value="31+">31 ou mais</option>
            </select>

            <select
              value={form.fagerstrom.fumaMaisManha}
              onChange={(e) =>
                updateNested("fagerstrom", "fumaMaisManha", e.target.value)
              }
              disabled={!fagerstromDisponivel}
            >
              <option value="">Fuma mais pela manhã?</option>
              <option value="sim">Sim</option>
              <option value="nao">Não</option>
            </select>

            <select
              value={form.fagerstrom.fumaDoente}
              onChange={(e) =>
                updateNested("fagerstrom", "fumaDoente", e.target.value)
              }
              disabled={!fagerstromDisponivel}
            >
              <option value="">Fuma quando está doente?</option>
              <option value="sim">Sim</option>
              <option value="nao">Não</option>
            </select>

            <select
              value={form.fagerstrom.despertaNoiteFumar}
              onChange={(e) =>
                updateNested("fagerstrom", "despertaNoiteFumar", e.target.value)
              }
              disabled={!fagerstromDisponivel}
            >
              <option value="">Desperta à noite para fumar?</option>
              <option value="sim">Sim</option>
              <option value="nao">Não</option>
            </select>

            <select
              value={form.fagerstrom.sintomasAbstinencia}
              onChange={(e) =>
                updateNested("fagerstrom", "sintomasAbstinencia", e.target.value)
              }
              disabled={!fagerstromDisponivel}
            >
              <option value="">Apresenta sintomas de abstinência?</option>
              <option value="sim">Sim</option>
              <option value="nao">Não</option>
              <option value="nao_sabe">Não sabe</option>
            </select>

            <select
              value={form.fagerstrom.tentativasSemSucesso}
              onChange={(e) =>
                updateNested("fagerstrom", "tentativasSemSucesso", e.target.value)
              }
              disabled={!fagerstromDisponivel}
            >
              <option value="">Múltiplas tentativas sem sucesso?</option>
              <option value="sim">Sim</option>
              <option value="nao">Não</option>
            </select>
          </div>
        </div>
      )}

      {tab === "cultural" && (
        <div className="card cultural-card">
          <h2>Módulo cultural</h2>
          <SectionHint>
            Diferencia uso ritual/tradicional, uso cotidiano, uso comercial e significados culturais.
          </SectionHint>

          <div className="cultural-layout">
            <section className="cultural-section">
              <h3>1. Religião, espiritualidade e crenças</h3>
              <MultiChoiceField
                title="1.1 Qual(is) religião(ões), espiritualidade(s) ou sistema(s) de crenças você segue ou pratica?"
                options={RELIGIOES_OPTIONS.map((item) => ({ value: item, label: item }))}
                values={form.cultural.religioes}
                onToggle={(nextValues) =>
                  updateCulturalChoice(
                    "religioes",
                    nextValues,
                    "religioesOutro",
                    ["prefere não responder"]
                  )
                }
              />

              {form.cultural.religioes.includes("outro") && (
                <input
                  className="full"
                  placeholder="1.1 Outro (especificar)"
                  value={form.cultural.religioesOutro}
                  onChange={(e) =>
                    updateNested("cultural", "religioesOutro", e.target.value)
                  }
                />
              )}
            </section>

            <section className="cultural-section">
              <h3>2. Uso tradicional, ritual ou medicinal</h3>
              <MultiChoiceField
                title="2.1 Na sua comunidade existe uso tradicional, ritual, espiritual ou medicinal do tabaco?"
                options={BINARIO_OPTIONS}
                values={form.cultural.usoTradicionalExiste}
                singleChoice
                onToggle={(nextValues) =>
                  updateNested("cultural", "usoTradicionalExiste", nextValues)
                }
              />

              <MultiChoiceField
                title="2.2 Você já participou de algum ritual, cerimônia ou prática tradicional que envolvesse tabaco?"
                options={[
                  { value: "sim", label: "Sim" },
                  { value: "nao", label: "Não" },
                  { value: "prefere_nao_responder", label: "Prefere não responder" },
                ]}
                values={form.cultural.participouRitualTabaco}
                singleChoice
                onToggle={(nextValues) =>
                  updateNested("cultural", "participouRitualTabaco", nextValues)
                }
              />

              <MultiChoiceField
                title="2.3 Quais contextos envolvem esse uso?"
                options={CONTEXTOS_ENVOLVEM_USO.map((item) => ({ value: item, label: item }))}
                values={form.cultural.contextosEnvolvemUso}
                onToggle={(nextValues) =>
                  updateNested("cultural", "contextosEnvolvemUso", nextValues)
                }
              />

              {form.cultural.contextosEnvolvemUso.includes("outro") && (
                <input
                  className="full"
                  placeholder="2.3 Outro contexto (especificar)"
                  value={form.cultural.contextosEnvolvemUsoOutro}
                  onChange={(e) =>
                    updateNested("cultural", "contextosEnvolvemUsoOutro", e.target.value)
                  }
                />
              )}
            </section>

            <section className="cultural-section">
              <h3>3. Início do uso</h3>
              <MultiChoiceField
                title="3.1 Quem mais influenciou o início do seu uso?"
                options={QUEM_INFLUENCIOU_OPTIONS}
                values={form.cultural.quemInfluenciou}
                singleChoice
                onToggle={(nextValues) =>
                  updateNested("cultural", "quemInfluenciou", nextValues)
                }
              />

              {form.cultural.quemInfluenciou.includes("outro") && (
                <input
                  className="full"
                  placeholder="3.1 Outro (especificar)"
                  value={form.cultural.quemInfluenciouOutro}
                  onChange={(e) =>
                    updateNested("cultural", "quemInfluenciouOutro", e.target.value)
                  }
                />
              )}

              <MultiChoiceField
                title="3.2 O início do uso ocorreu em contexto ritual/tradicional?"
                options={INICIO_CONTEXTO_RITUAL_OPTIONS}
                values={form.cultural.inicioEmContextoRitualTradicional}
                singleChoice
                onToggle={(nextValues) =>
                  updateNested("cultural", "inicioEmContextoRitualTradicional", nextValues)
                }
              />

              <MultiChoiceField
                title="3.3 Naquele momento, você sentiu que teve possibilidade real de escolher usar ou não usar?"
                options={INICIO_CONTEXTO_RITUAL_OPTIONS}
                values={form.cultural.houveEscolha}
                singleChoice
                onToggle={(nextValues) =>
                  updateNested("cultural", "houveEscolha", nextValues)
                }
              />

              <MultiChoiceField
                title="3.4 Com que idade você participou pela primeira vez de uso ritual/tradicional do tabaco?"
                options={IDADE_PRIMEIRA_PARTICIPACAO_OPTIONS}
                values={form.cultural.idadePrimeiraParticipacaoRitual}
                singleChoice
                onToggle={(nextValues) =>
                  updateNested("cultural", "idadePrimeiraParticipacaoRitual", nextValues)
                }
              />

              <MultiChoiceField
                title="3.5 Com que idade você começou a usar tabaco em contexto ritual/tradicional?"
                options={IDADE_INICIO_USO_RITUAL_OPTIONS}
                values={form.cultural.idadeInicioUsoRitual}
                singleChoice
                onToggle={(nextValues) =>
                  updateNested("cultural", "idadeInicioUsoRitual", nextValues)
                }
              />
            </section>

            <section className="cultural-section">
              <h3>4. Percepção comunitária</h3>
              <MultiChoiceField
                title="4.1 Como a comunidade percebe esse uso?"
                options={PERCEPCAO_COMUNIDADE_OPTIONS}
                values={form.cultural.percepcaoComunidade}
                onToggle={(nextValues) =>
                  updateCulturalChoice(
                    "percepcaoComunidade",
                    nextValues,
                    "percepcaoComunidadeOutro",
                    ["nao_sabe_informar"]
                  )
                }
              />

              {form.cultural.percepcaoComunidade.includes("outro") && (
                <input
                  className="full"
                  placeholder="4.1 Outro (especificar)"
                  value={form.cultural.percepcaoComunidadeOutro}
                  onChange={(e) =>
                    updateNested("cultural", "percepcaoComunidadeOutro", e.target.value)
                  }
                />
              )}

              <MultiChoiceField
                title="4.2 Para você, existe diferença entre uso ritual/tradicional e uso comercial do tabaco?"
                options={BINARIO_OPTIONS}
                values={form.cultural.diferencaTradicionalComercial}
                singleChoice
                onToggle={(nextValues) =>
                  updateNested("cultural", "diferencaTradicionalComercial", nextValues)
                }
              />

              <textarea
                placeholder="4.3 Se sim, qual a principal diferença? (você pode listar mais de uma)"
                value={form.cultural.diferencaPrincipal}
                onChange={(e) =>
                  updateNested("cultural", "diferencaPrincipal", e.target.value)
                }
              />
            </section>

            <section className="cultural-section">
              <h3>5. Produto ou substância utilizada</h3>
              <MultiChoiceField
                title="5.1 Qual produto ou substância costuma ser utilizada?"
                options={PRODUTOS_SUBSTANCIAS.map((item) => ({ value: item, label: item }))}
                values={form.cultural.produtoSubstanciaUtilizada}
                onToggle={(nextValues) =>
                  updateNested("cultural", "produtoSubstanciaUtilizada", nextValues)
                }
              />

              {form.cultural.produtoSubstanciaUtilizada.includes("outros") && (
                <input
                  className="full"
                  placeholder="5.1 Outros (especificar)"
                  value={form.cultural.produtoSubstanciaUtilizadaOutros}
                  onChange={(e) =>
                    updateNested("cultural", "produtoSubstanciaUtilizadaOutros", e.target.value)
                  }
                />
              )}

              <MultiChoiceField
                title="5.2 O produto é principalmente:"
                options={PRODUTO_PRINCIPAL_ORIGEM_OPTIONS}
                values={form.cultural.produtoPrincipalOrigem}
                singleChoice
                onToggle={(nextValues) =>
                  updateCulturalChoice(
                    "produtoPrincipalOrigem",
                    nextValues,
                    "produtoPrincipalOrigemOutro",
                    ["nao_sabe_informar", "prefere_nao_responder"]
                  )
                }
              />

              {form.cultural.produtoPrincipalOrigem.includes("outro") && (
                <input
                  className="full"
                  placeholder="5.2 Outro (especificar)"
                  value={form.cultural.produtoPrincipalOrigemOutro}
                  onChange={(e) =>
                    updateNested("cultural", "produtoPrincipalOrigemOutro", e.target.value)
                  }
                />
              )}
            </section>

            <section className="cultural-section">
              <h3>6. Contextos e finalidades do uso</h3>
              <MultiChoiceField
                title="6.1 Em quais contextos você utiliza?"
                options={CONTEXTOS_UTILIZA.map((item) => ({ value: item, label: item }))}
                values={form.cultural.contextosUtiliza}
                onToggle={(nextValues) =>
                  updateNested("cultural", "contextosUtiliza", nextValues)
                }
              />

              {form.cultural.contextosUtiliza.includes("outro") && (
                <input
                  className="full"
                  placeholder="6.1 Outro contexto (especificar)"
                  value={form.cultural.contextosUtilizaOutro}
                  onChange={(e) =>
                    updateNested("cultural", "contextosUtilizaOutro", e.target.value)
                  }
                />
              )}

              <MultiChoiceField
                title="6.2 Qual a finalidade atribuída ao uso?"
                options={FINALIDADES_USO.map((item) => ({ value: item, label: item }))}
                values={form.cultural.finalidadeUso}
                onToggle={(nextValues) =>
                  updateNested("cultural", "finalidadeUso", nextValues)
                }
              />

              {form.cultural.finalidadeUso.includes("outro") && (
                <input
                  className="full"
                  placeholder="6.2 Outra finalidade (especificar)"
                  value={form.cultural.finalidadeUsoOutro}
                  onChange={(e) =>
                    updateNested("cultural", "finalidadeUsoOutro", e.target.value)
                  }
                />
              )}
            </section>

            <section className="cultural-section">
              <h3>7. Forma de consumo</h3>
              <MultiChoiceField
                title="7.1 Qual é a principal forma de consumo?"
                options={FORMA_PRINCIPAL_CONSUMO_OPTIONS}
                values={form.cultural.formaPrincipalConsumo}
                singleChoice
                onToggle={(nextValues) =>
                  updateNested("cultural", "formaPrincipalConsumo", nextValues)
                }
              />

              {form.cultural.formaPrincipalConsumo.includes("outra") && (
                <input
                  className="full"
                  placeholder="7.1 Outra forma de consumo (especificar)"
                  value={form.cultural.formaPrincipalConsumoOutra}
                  onChange={(e) =>
                    updateNested("cultural", "formaPrincipalConsumoOutra", e.target.value)
                  }
                />
              )}

              <MultiChoiceField
                title="7.2 O uso ocorre mais frequentemente:"
                options={USO_OCORRE_FREQUENTEMENTE_OPTIONS}
                values={form.cultural.usoOcorreMaisFrequentemente}
                singleChoice
                onToggle={(nextValues) =>
                  updateNested("cultural", "usoOcorreMaisFrequentemente", nextValues)
                }
              />
            </section>

            <section className="cultural-section">
              <h3>8. Uso pessoal específico</h3>
              <MultiChoiceField
                title="8.1 Você pessoalmente já utilizou tabaco como medicamento ou em contexto de cura/tratamento tradicional?"
                options={BINARIO_COM_PREFERE_OPTIONS}
                values={form.cultural.usoMedicamentoCuraPessoal}
                singleChoice
                onToggle={(nextValues) =>
                  updateNested("cultural", "usoMedicamentoCuraPessoal", nextValues)
                }
              />

              <MultiChoiceField
                title="8.2 Você pessoalmente já utilizou tabaco em rodas de conversa ou reuniões comunitárias?"
                options={BINARIO_COM_PREFERE_OPTIONS}
                values={form.cultural.usoRodasConversaPessoal}
                singleChoice
                onToggle={(nextValues) =>
                  updateNested("cultural", "usoRodasConversaPessoal", nextValues)
                }
              />

              <MultiChoiceField
                title="8.3 Você já participou de uso ritual de bebidas alcoólicas?"
                options={BINARIO_COM_PREFERE_OPTIONS}
                values={form.cultural.usoRitualBebidasAlcoolicas}
                singleChoice
                onToggle={(nextValues) =>
                  updateNested("cultural", "usoRitualBebidasAlcoolicas", nextValues)
                }
              />

              <MultiChoiceField
                title="8.4 Você sente algum sintoma como tosse, falta de ar, náusea durante o uso do tabaco para os rituais?"
                options={[
                  { value: "sim", label: "Sim" },
                  { value: "nao", label: "Não" },
                  { value: "nao_sei", label: "Não sei" },
                ]}
                values={form.cultural.sintomasDuranteUsoRitual}
                singleChoice
                onToggle={(nextValues) =>
                  updateNested("cultural", "sintomasDuranteUsoRitual", nextValues)
                }
              />
            </section>
          </div>
        </div>
      )}

      {tab === "audit" && (
        <div className="card">
          <h2>AUDIT – Triagem do consumo de bebidas alcoólicas</h2>

          <div className="audit-grid">
            <AuditQuestion
              title="1. Com que frequência você consome bebidas alcoólicas?"
              value={form.audit.q1}
              onChange={(e) => updateNested("audit", "q1", e.target.value)}
              options={AUDIT_Q1_OPTIONS}
            />
            <AuditQuestion
              title="2. Quantas doses alcoólicas você consome tipicamente ao beber?"
              value={form.audit.q2}
              onChange={(e) => updateNested("audit", "q2", e.target.value)}
              options={AUDIT_Q2_OPTIONS}
            />
            <AuditQuestion
              title="3. Com que frequência você consome seis ou mais doses em uma ocasião?"
              value={form.audit.q3}
              onChange={(e) => updateNested("audit", "q3", e.target.value)}
              options={AUDIT_Q3_OPTIONS}
            />
            <AuditQuestion
              title="4. Com que frequência, durante o último ano, você achou que não conseguiria parar de beber depois de começar?"
              value={form.audit.q4}
              onChange={(e) => updateNested("audit", "q4", e.target.value)}
              options={AUDIT_Q4_TO_Q8_OPTIONS}
            />
            <AuditQuestion
              title="5. Com que frequência, durante o último ano, você não conseguiu fazer o que era esperado por causa da bebida?"
              value={form.audit.q5}
              onChange={(e) => updateNested("audit", "q5", e.target.value)}
              options={AUDIT_Q4_TO_Q8_OPTIONS}
            />
            <AuditQuestion
              title="6. Com que frequência, durante o último ano, você precisou beber pela manhã para se sentir melhor após ter bebido muito?"
              value={form.audit.q6}
              onChange={(e) => updateNested("audit", "q6", e.target.value)}
              options={AUDIT_Q4_TO_Q8_OPTIONS}
            />
            <AuditQuestion
              title="7. Com que frequência, durante o último ano, você sentiu culpa ou remorso após beber?"
              value={form.audit.q7}
              onChange={(e) => updateNested("audit", "q7", e.target.value)}
              options={AUDIT_Q4_TO_Q8_OPTIONS}
            />
            <AuditQuestion
              title="8. Com que frequência, durante o último ano, você não conseguiu lembrar do que aconteceu na noite anterior por causa da bebida?"
              value={form.audit.q8}
              onChange={(e) => updateNested("audit", "q8", e.target.value)}
              options={AUDIT_Q4_TO_Q8_OPTIONS}
            />
            <AuditQuestion
              title="9. Você ou outra pessoa já se machucou em consequência do seu consumo de álcool?"
              value={form.audit.q9}
              onChange={(e) => updateNested("audit", "q9", e.target.value)}
              options={AUDIT_Q9_Q10_OPTIONS}
            />
            <AuditQuestion
              title="10. Algum parente, amigo ou profissional de saúde já se preocupou com seu modo de beber ou sugeriu que você parasse?"
              value={form.audit.q10}
              onChange={(e) => updateNested("audit", "q10", e.target.value)}
              options={AUDIT_Q9_Q10_OPTIONS}
            />
          </div>
        </div>
      )}

      <div className="card result">
        <h2>Resumo do caso atual</h2>

        <p><strong>Uso do tabaco:</strong> {usoScore} pontos — {classifyUso(usoScore)}</p>
        <p>
          <strong>Fagerström:</strong> {fagerScore} pontos —{" "}
          {classifyFagerstrom(fagerScore, form.fagerstrom.tipoUsuario)}
        </p>
        <p><strong>Módulo cultural:</strong> {culturalScore} pontos — {classifyCultural(culturalScore)}</p>
        <p><strong>AUDIT:</strong> {auditScore} pontos — {classifyAUDIT(auditScore)}</p>
        <p><strong>Prioridade final:</strong> {prioridade}</p>

        <div className="chart-box">
          <div className="chart-title">Nível de dependência geral</div>
          <div className="chart-track">
            <div
              className={`chart-fill ${getDependenciaBarClass(total)}`}
              style={{ width: getDependenciaBarWidth(total) }}
            />
          </div>
          <div className="chart-label">{classifyDependenciaGeral(total)}</div>
        </div>

        {mensagemEnvio && <div className="status-envio">{mensagemEnvio}</div>}
        {!googleScriptConfigured && (
          <div className="status-envio status-envio-warning">
            {GOOGLE_SCRIPT_NOT_CONFIGURED_MESSAGE}
          </div>
        )}

        <div className="buttons">
          <button onClick={salvarCaso}>Salvar caso</button>
          <button onClick={enviarParaGoogleSheets} disabled={enviandoSheets}>
            {enviandoSheets ? "Enviando..." : "Enviar todos para Google Sheets"}
          </button>
          <button onClick={resetAll}>Limpar formulário</button>
        </div>
      </div>

      <div className="card">
        <div className="header-casos">
          <h2>Casos cadastrados</h2>
          <button className="btn-apagar-todos" onClick={limparTodosCasos}>
            Apagar todos
          </button>
        </div>

        {casos.length === 0 ? (
          <p>Nenhum caso salvo ainda.</p>
        ) : (
          <div className="table-wrap">
            <table className="tabela-casos">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Nome do usuário</th>
                  <th>Telefone</th>
                  <th>Residência</th>
                  <th>Aldeia ou Polo</th>
                  <th>Município</th>
                  <th>Uso atual</th>
                  <th>AUDIT</th>
                  <th>Total</th>
                  <th>Prioridade</th>
                  <th>Ação</th>
                </tr>
              </thead>
              <tbody>
                {casos.map((caso, index) => (
                  <tr key={caso.id}>
                    <td>{index + 1}</td>
                    <td>{caso.identificacao}</td>
                    <td>{caso.telefone || "-"}</td>
                    <td>{caso.localResidencia}</td>
                    <td>{caso.aldeia}</td>
                    <td>{caso.municipio}</td>
                    <td>{caso.usoAtual}</td>
                    <td>{caso.classificacaoAUDIT}</td>
                    <td>{caso.scoreTotal}</td>
                    <td>{caso.prioridadeFinal}</td>
                    <td>
                      <button
                        className="btn-remover"
                        onClick={() => removerCaso(caso.id)}
                      >
                        Remover
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
