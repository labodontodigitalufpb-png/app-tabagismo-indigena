import { useEffect, useMemo, useState } from "react";
import "./index.css";
import logo from "./assets/logo.png";

const HEADER_PARTNERSHIP =
  "Parceria PET Saúde Digital Unifal e UFAM / UNESP SJC Odontologia / LABODIGIT UFPB";

const STORAGE_KEY = "tabacontrole_casos_v8";

const GOOGLE_SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL || "";

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

const TIPOS_DISPOSITIVO_VAPE = [
  "descartável",
  "recarregável com refil",
  "modificável",
  "pod system",
  "não sabe",
];

const SABORES_VAPE = [
  "frutas",
  "mentol/hortelã",
  "doces",
  "bebidas",
  "tabaco",
  "outros",
];

const OUTROS_PRODUTOS_TABACO = [
  "narguilé",
  "cigarro de palha",
  "charuto",
  "rapé",
  "cachimbo",
  "outros",
  "nenhum",
];

const SINTOMAS_VAPE = [
  "tosse",
  "ardência na garganta",
  "falta de ar",
  "dor no peito",
  "tontura",
  "náusea",
  "dor de cabeça",
  "palpitação",
  "nenhum",
];

const CONTEXTO_SOCIAL_VAPE = [
  "amigos",
  "familiares",
  "colegas de escola/trabalho",
  "ninguém",
  "outros",
];

const SITUACOES_USO_VAPE = [
  "sozinho",
  "com amigos",
  "em festas",
  "na escola/trabalho",
  "em casa",
  "outros",
];

const DIFICULDADE_PARAR_VAPE = [
  "vontade intensa",
  "ansiedade",
  "influência social",
  "hábito",
  "falta de apoio",
  "outro",
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

const initialState = {
  participante: {
    identificacao: "",
    idade: "",
    sexo: "",
    telefone: "",
    municipio: "",
    estado: "",
    entrevistador: "",
    data: "",
    idioma: "Português",
    unidadeSaudeAtendimento: "",
    recebeVisitaSaude: "",
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
  fagerstrom: {
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
  },
  cigarroEletronico: {
    jaUsouAlgumaVez: "",
    usoAtual: "",
    idadePrimeiroUso: "",
    idadeUsoFrequente: "",
    tempoUso: "",
    vezesPorDia: "",
    tipoDispositivo: "",
    usaMaisDeUm: "",
    compartilhaDispositivo: "",
    localCompra: "",
    contemNicotina: "",
    concentracaoNicotina: "",
    usaSabores: "",
    saboresMaisUsados: [],
    saboresOutros: "",
    outrasSubstancias: "",
    vontadeAoAcordar: "",
    dificuldadeSemUsar: "",
    necessidadeForteDia: "",
    usaDoente: "",
    tentouReduzirSemConseguir: "",
    abstinenciaQuandoSemUsar: "",
    acordaNoiteParaUsar: "",
    motivoInicio: "",
    motivoInicioOutro: "",
    motivoContinua: "",
    motivoContinuaOutro: "",
    fumaCigarroConvencional: "",
    outrosProdutosTabaco: [],
    outrosProdutosTabacoOutros: "",
    comecouAntesOuDepois: "",
    usaParaPararCigarroComum: "",
    sintomasPercebidos: [],
    pioraRespiratoria: "",
    quemUsaPerto: "",
    situacoesUso: [],
    situacoesUsoOutros: "",
    incentivoDeAlguem: "",
    achaQueFazMal: "",
    achaMenosMalQueCigarro: "",
    achaQueCausaDependencia: "",
    pensouEmParar: "",
    jaTentouParar: "",
    quantasTentativas: "",
    dificuldadeParar: [],
    dificuldadePararOutro: "",
    gostariaAjuda: "",
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

function scoreCigarroEletronico(v) {
  let score = 0;

  if (
    v.usoAtual === "sim_diariamente" ||
    v.usoAtual === "sim_alguns_dias" ||
    v.usoAtual === "sim_ocasionalmente"
  )
    score += 2;

  if (v.usoAtual === "sim_diariamente") score += 2;
  if (v.vezesPorDia === "11_20") score += 1;
  if (v.vezesPorDia === "mais_20") score += 2;
  if (v.contemNicotina === "sim") score += 2;
  if (v.vontadeAoAcordar === "5min") score += 2;
  else if (v.vontadeAoAcordar === "30min") score += 1;
  if (v.dificuldadeSemUsar === "sim") score += 1;
  if (v.necessidadeForteDia === "sim") score += 1;
  if (v.tentouReduzirSemConseguir === "sim") score += 1;
  if (v.abstinenciaQuandoSemUsar === "sim") score += 1;
  if (v.acordaNoiteParaUsar === "sim") score += 1;
  if (v.gostariaAjuda === "sim_agora") score += 1;

  return Math.min(score, 15);
}

function classifyCigarroEletronico(score) {
  if (score <= 4) return "Baixo padrão de uso";
  if (score <= 9) return "Padrão intermediário";
  return "Padrão elevado";
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
  if (total <= 8) return "Ausente / Baixo";
  if (total <= 18) return "Moderado";
  return "Alto";
}

function getDependenciaBarClass(total) {
  if (total <= 8) return "level-low";
  if (total <= 18) return "level-medium";
  return "level-high";
}

function getDependenciaBarWidth(total) {
  const maxScore = 45;
  const percent = Math.max(0, Math.min((total / maxScore) * 100, 100));
  return `${percent}%`;
}

function loadCasesFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
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

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(casos));
  }, [casos]);

  const updateNested = (section, key, value) => {
    setForm((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }));
  };

  const fagerScore = useMemo(() => scoreFagerstrom(form.fagerstrom), [form.fagerstrom]);
  const usoScore = useMemo(() => scoreUso(form.uso), [form.uso]);
  const vapeScore = useMemo(
    () => scoreCigarroEletronico(form.cigarroEletronico),
    [form.cigarroEletronico]
  );
  const auditScore = useMemo(() => scoreAUDIT(form.audit), [form.audit]);
  const total = fagerScore + usoScore + vapeScore + auditScore;

  const prioridade =
    total <= 10
      ? "Baixa prioridade"
      : total <= 22
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
      ...form.cigarroEletronico,
      produtoPrincipal: form.uso.produtoPrincipal.join(", "),
      saboresMaisUsados: form.cigarroEletronico.saboresMaisUsados.join(", "),
      outrosProdutosTabaco: form.cigarroEletronico.outrosProdutosTabaco.join(", "),
      sintomasPercebidos: form.cigarroEletronico.sintomasPercebidos.join(", "),
      situacoesUso: form.cigarroEletronico.situacoesUso.join(", "),
      dificuldadeParar: form.cigarroEletronico.dificuldadeParar.join(", "),
      scoreUso: usoScore,
      classificacaoUso: classifyUso(usoScore),
      scoreFagerstrom: fagerScore,
      classificacaoFagerstrom: classifyFagerstrom(
        fagerScore,
        form.fagerstrom.tipoUsuario
      ),
      scoreCigarroEletronico: vapeScore,
      classificacaoCigarroEletronico: classifyCigarroEletronico(vapeScore),
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

    if (!GOOGLE_SCRIPT_URL) {
      const mensagem =
        "Configure a variável VITE_GOOGLE_SCRIPT_URL para enviar os dados ao Google Sheets.";
      setMensagemEnvio(mensagem);
      alert(mensagem);
      return;
    }

    setEnviandoSheets(true);
    setMensagemEnvio("");

    try {
      const payload = JSON.stringify({
        origem: "tabacontrole",
        timestampEnvio: new Date().toISOString(),
        quantidadeCasos: casos.length,
        casos,
      });

      const iframeName = `google-sheets-submit-${Date.now()}`;
      const iframe = document.createElement("iframe");
      iframe.name = iframeName;
      iframe.style.display = "none";

      const formElement = document.createElement("form");
      formElement.method = "POST";
      formElement.action = GOOGLE_SCRIPT_URL;
      formElement.target = iframeName;
      formElement.style.display = "none";

      const input = document.createElement("input");
      input.type = "hidden";
      input.name = "payload";
      input.value = payload;

      formElement.appendChild(input);
      document.body.appendChild(iframe);
      document.body.appendChild(formElement);
      formElement.submit();

      window.setTimeout(() => {
        formElement.remove();
        iframe.remove();
      }, 4000);

      setMensagemEnvio(
        "Dados enviados para o Google Sheets. Confirme a chegada diretamente na planilha."
      );
      alert("Envio realizado. Confira a planilha para confirmar o recebimento.");
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
            src={logo}
            alt="Logo Ybytu Livre"
            className="hero-logo"
            style={{ width: "620px" }}
          />
          <div className="hero-text">
            <div className="hero-top">{HEADER_PARTNERSHIP}</div>
          </div>
        </div>
      </header>

      <div className="card">
        <h2>Identificação</h2>
        <SectionHint>
          Inclui unidade de saude de atendimento e presenca de equipe de saude.
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
            onChange={(e) =>
              updateNested("participante", "telefone", e.target.value)
            }
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
            placeholder="Entrevistador"
            value={form.participante.entrevistador}
            onChange={(e) =>
              updateNested("participante", "entrevistador", e.target.value)
            }
          />
          <input
            type={form.participante.data ? "date" : "text"}
            placeholder="Data da entrevista"
            aria-label="Data da entrevista"
            title="Data da entrevista"
            value={form.participante.data}
            onFocus={(e) => {
              e.target.type = "date";
            }}
            onBlur={(e) => {
              if (!e.target.value) e.target.type = "text";
            }}
            onChange={(e) => updateNested("participante", "data", e.target.value)}
          />
          <input
            placeholder="Idioma"
            value={form.participante.idioma}
            onChange={(e) => updateNested("participante", "idioma", e.target.value)}
          />

          <input
            placeholder="Unidade de saude de atendimento"
            value={form.participante.unidadeSaudeAtendimento}
            onChange={(e) =>
              updateNested("participante", "unidadeSaudeAtendimento", e.target.value)
            }
          />

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
        <button
          className={tab === "cigarroEletronico" ? "active" : ""}
          onClick={() => setTab("cigarroEletronico")}
        >
          Cigarro eletrônico
        </button>
        <button className={tab === "audit" ? "active" : ""} onClick={() => setTab("audit")}>
          AUDIT
        </button>
      </div>

      {tab === "uso" && (
        <div className="card">
          <h2>Questionário de uso de tabaco</h2>
          <SectionHint>
            Avalia padrão atual de uso, recaída, apoio prévio e necessidade de encaminhamento.
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
              placeholder="Início do primeiro uso"
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
            Aplicável principalmente a usuários de cigarros industrializados.
          </SectionHint>

          <div className="grid">
            <select
              value={form.fagerstrom.tipoUsuario}
              onChange={(e) =>
                updateNested("fagerstrom", "tipoUsuario", e.target.value)
              }
            >
              <option value="">Tipo principal de usuário</option>
              <option value="cigarro_industrializado">Cigarro industrializado</option>
              <option value="outro_produto">Outro produto/dispositivo</option>
            </select>

            <select
              value={form.fagerstrom.primeiroCigarro}
              onChange={(e) =>
                updateNested("fagerstrom", "primeiroCigarro", e.target.value)
              }
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
            >
              <option value="">Múltiplas tentativas sem sucesso?</option>
              <option value="sim">Sim</option>
              <option value="nao">Não</option>
            </select>
          </div>
        </div>
      )}

      {tab === "cigarroEletronico" && (
        <div className="card">
          <h2>Avaliação do uso de cigarro eletrônico</h2>
          <SectionHint>
            Investiga histórico de uso, dependência, sintomas, contexto social e interesse em parar.
          </SectionHint>

          <div className="grid">
            <select
              value={form.cigarroEletronico.jaUsouAlgumaVez}
              onChange={(e) =>
                updateNested("cigarroEletronico", "jaUsouAlgumaVez", e.target.value)
              }
            >
              <option value="">Já usou cigarro eletrônico alguma vez?</option>
              <option value="sim">Sim</option>
              <option value="nao">Não</option>
            </select>

            <select
              value={form.cigarroEletronico.usoAtual}
              onChange={(e) =>
                updateNested("cigarroEletronico", "usoAtual", e.target.value)
              }
            >
              <option value="">Usa cigarro eletrônico atualmente?</option>
              <option value="sim_diariamente">Sim, diariamente</option>
              <option value="sim_alguns_dias">Sim, alguns dias por semana</option>
              <option value="sim_ocasionalmente">Sim, ocasionalmente</option>
              <option value="nao_mas_ja_usei">Não, mas já usei</option>
              <option value="nunca_usei">Nunca usei</option>
            </select>

            <input
              placeholder="Idade do primeiro uso"
              value={form.cigarroEletronico.idadePrimeiroUso}
              onChange={(e) =>
                updateNested("cigarroEletronico", "idadePrimeiroUso", e.target.value)
              }
            />

            <input
              placeholder="Idade de início do uso frequente"
              value={form.cigarroEletronico.idadeUsoFrequente}
              onChange={(e) =>
                updateNested("cigarroEletronico", "idadeUsoFrequente", e.target.value)
              }
            />

            <select
              value={form.cigarroEletronico.tempoUso}
              onChange={(e) =>
                updateNested("cigarroEletronico", "tempoUso", e.target.value)
              }
            >
              <option value="">Há quanto tempo usa?</option>
              <option value="menos_1_mes">Menos de 1 mês</option>
              <option value="1_6_meses">1 a 6 meses</option>
              <option value="6_12_meses">6 a 12 meses</option>
              <option value="mais_1_ano">Mais de 1 ano</option>
            </select>

            <select
              value={form.cigarroEletronico.vezesPorDia}
              onChange={(e) =>
                updateNested("cigarroEletronico", "vezesPorDia", e.target.value)
              }
            >
              <option value="">Quantas vezes por dia utiliza?</option>
              <option value="1_5">1 a 5</option>
              <option value="6_10">6 a 10</option>
              <option value="11_20">11 a 20</option>
              <option value="mais_20">Mais de 20</option>
              <option value="nao_sabe">Não sabe informar</option>
            </select>

            <select
              value={form.cigarroEletronico.tipoDispositivo}
              onChange={(e) =>
                updateNested("cigarroEletronico", "tipoDispositivo", e.target.value)
              }
            >
              <option value="">Tipo de dispositivo utilizado</option>
              {TIPOS_DISPOSITIVO_VAPE.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <select
              value={form.cigarroEletronico.usaMaisDeUm}
              onChange={(e) =>
                updateNested("cigarroEletronico", "usaMaisDeUm", e.target.value)
              }
            >
              <option value="">Usa mais de um tipo de dispositivo?</option>
              <option value="sim">Sim</option>
              <option value="nao">Não</option>
            </select>

            <select
              value={form.cigarroEletronico.compartilhaDispositivo}
              onChange={(e) =>
                updateNested(
                  "cigarroEletronico",
                  "compartilhaDispositivo",
                  e.target.value
                )
              }
            >
              <option value="">Compartilha dispositivo com outra pessoa?</option>
              <option value="sim">Sim</option>
              <option value="nao">Não</option>
            </select>

            <select
              value={form.cigarroEletronico.localCompra}
              onChange={(e) =>
                updateNested("cigarroEletronico", "localCompra", e.target.value)
              }
            >
              <option value="">Costuma comprar onde?</option>
              <option value="internet">Internet</option>
              <option value="loja_fisica">Loja física</option>
              <option value="amigos">Amigos/conhecidos</option>
              <option value="recebe">Recebe de outra pessoa</option>
              <option value="outro">Outro</option>
            </select>

            <select
              value={form.cigarroEletronico.contemNicotina}
              onChange={(e) =>
                updateNested("cigarroEletronico", "contemNicotina", e.target.value)
              }
            >
              <option value="">O líquido contém nicotina?</option>
              <option value="sim">Sim</option>
              <option value="nao">Não</option>
              <option value="nao_sabe">Não sabe</option>
            </select>

            <select
              value={form.cigarroEletronico.concentracaoNicotina}
              onChange={(e) =>
                updateNested(
                  "cigarroEletronico",
                  "concentracaoNicotina",
                  e.target.value
                )
              }
            >
              <option value="">Concentração de nicotina</option>
              <option value="baixa">Baixa</option>
              <option value="media">Média</option>
              <option value="alta">Alta</option>
              <option value="nao_sabe">Não sabe</option>
            </select>

            <select
              value={form.cigarroEletronico.usaSabores}
              onChange={(e) =>
                updateNested("cigarroEletronico", "usaSabores", e.target.value)
              }
            >
              <option value="">Usa líquidos com sabores?</option>
              <option value="sim">Sim</option>
              <option value="nao">Não</option>
            </select>

            <select
              value={form.cigarroEletronico.outrasSubstancias}
              onChange={(e) =>
                updateNested("cigarroEletronico", "outrasSubstancias", e.target.value)
              }
            >
              <option value="">Já usou com outras substâncias além da nicotina?</option>
              <option value="sim">Sim</option>
              <option value="nao">Não</option>
              <option value="nao_sabe">Não sabe</option>
            </select>

            <div className="multi-group full">
              <p>Quais sabores usa mais?</p>
              <div className="checks">
                {SABORES_VAPE.map((item) => (
                  <label key={item}>
                    <input
                      type="checkbox"
                      checked={form.cigarroEletronico.saboresMaisUsados.includes(item)}
                      onChange={() =>
                        updateNested(
                          "cigarroEletronico",
                          "saboresMaisUsados",
                          toggleArray(form.cigarroEletronico.saboresMaisUsados, item)
                        )
                      }
                    />
                    {item}
                  </label>
                ))}
              </div>
            </div>

            {form.cigarroEletronico.saboresMaisUsados.includes("outros") && (
              <input
                className="full"
                placeholder="Outros sabores"
                value={form.cigarroEletronico.saboresOutros}
                onChange={(e) =>
                  updateNested("cigarroEletronico", "saboresOutros", e.target.value)
                }
              />
            )}

            <select
              value={form.cigarroEletronico.vontadeAoAcordar}
              onChange={(e) =>
                updateNested(
                  "cigarroEletronico",
                  "vontadeAoAcordar",
                  e.target.value
                )
              }
            >
              <option value="">Quanto tempo após acordar sente vontade de usar?</option>
              <option value="5min">Nos primeiros 5 minutos</option>
              <option value="30min">6 a 30 minutos</option>
              <option value="60min">31 a 60 minutos</option>
              <option value="apos_60">Após 60 minutos</option>
              <option value="nao_usa_diariamente">Não usa diariamente</option>
            </select>

            <select
              value={form.cigarroEletronico.dificuldadeSemUsar}
              onChange={(e) =>
                updateNested("cigarroEletronico", "dificuldadeSemUsar", e.target.value)
              }
            >
              <option value="">Dificuldade de ficar sem usar em locais/situações?</option>
              <option value="sim">Sim</option>
              <option value="nao">Não</option>
            </select>

            <select
              value={form.cigarroEletronico.necessidadeForteDia}
              onChange={(e) =>
                updateNested(
                  "cigarroEletronico",
                  "necessidadeForteDia",
                  e.target.value
                )
              }
            >
              <option value="">Sente necessidade muito forte em algum momento do dia?</option>
              <option value="sim">Sim</option>
              <option value="nao">Não</option>
            </select>

            <select
              value={form.cigarroEletronico.usaDoente}
              onChange={(e) =>
                updateNested("cigarroEletronico", "usaDoente", e.target.value)
              }
            >
              <option value="">Usa mesmo quando está doente?</option>
              <option value="sim">Sim</option>
              <option value="nao">Não</option>
            </select>

            <select
              value={form.cigarroEletronico.tentouReduzirSemConseguir}
              onChange={(e) =>
                updateNested(
                  "cigarroEletronico",
                  "tentouReduzirSemConseguir",
                  e.target.value
                )
              }
            >
              <option value="">Já tentou reduzir e não conseguiu?</option>
              <option value="sim">Sim</option>
              <option value="nao">Não</option>
            </select>

            <select
              value={form.cigarroEletronico.abstinenciaQuandoSemUsar}
              onChange={(e) =>
                updateNested(
                  "cigarroEletronico",
                  "abstinenciaQuandoSemUsar",
                  e.target.value
                )
              }
            >
              <option value="">Sente irritação/ansiedade/vontade forte quando fica sem usar?</option>
              <option value="sim">Sim</option>
              <option value="nao">Não</option>
            </select>

            <select
              value={form.cigarroEletronico.acordaNoiteParaUsar}
              onChange={(e) =>
                updateNested(
                  "cigarroEletronico",
                  "acordaNoiteParaUsar",
                  e.target.value
                )
              }
            >
              <option value="">Já acordou à noite com vontade de usar?</option>
              <option value="sim">Sim</option>
              <option value="nao">Não</option>
            </select>

            <select
              value={form.cigarroEletronico.motivoInicio}
              onChange={(e) =>
                updateNested("cigarroEletronico", "motivoInicio", e.target.value)
              }
            >
              <option value="">Por que começou a usar?</option>
              <option value="curiosidade">Curiosidade</option>
              <option value="influencia_amigos">Influência de amigos</option>
              <option value="sabores">Sabores</option>
              <option value="menos_prejudicial">Achava menos prejudicial</option>
              <option value="parar_cigarro_comum">Para parar de fumar cigarro comum</option>
              <option value="ansiedade_estresse">Ansiedade/estresse</option>
              <option value="outro">Outro</option>
            </select>

            {form.cigarroEletronico.motivoInicio === "outro" && (
              <input
                placeholder="Outro motivo de início"
                value={form.cigarroEletronico.motivoInicioOutro}
                onChange={(e) =>
                  updateNested(
                    "cigarroEletronico",
                    "motivoInicioOutro",
                    e.target.value
                  )
                }
              />
            )}

            <select
              value={form.cigarroEletronico.motivoContinua}
              onChange={(e) =>
                updateNested("cigarroEletronico", "motivoContinua", e.target.value)
              }
            >
              <option value="">Principal motivo para continuar usando</option>
              <option value="prazer">Prazer</option>
              <option value="relaxamento">Relaxamento</option>
              <option value="habito">Hábito</option>
              <option value="dependencia">Dependência</option>
              <option value="socializacao">Socialização</option>
              <option value="substituir_cigarro">Substituir o cigarro comum</option>
              <option value="outro">Outro</option>
            </select>

            {form.cigarroEletronico.motivoContinua === "outro" && (
              <input
                placeholder="Outro motivo para continuar"
                value={form.cigarroEletronico.motivoContinuaOutro}
                onChange={(e) =>
                  updateNested(
                    "cigarroEletronico",
                    "motivoContinuaOutro",
                    e.target.value
                  )
                }
              />
            )}

            <select
              value={form.cigarroEletronico.fumaCigarroConvencional}
              onChange={(e) =>
                updateNested(
                  "cigarroEletronico",
                  "fumaCigarroConvencional",
                  e.target.value
                )
              }
            >
              <option value="">Também fuma cigarro convencional?</option>
              <option value="sim_diariamente">Sim, diariamente</option>
              <option value="sim_ocasionalmente">Sim, ocasionalmente</option>
              <option value="nao">Não</option>
            </select>

            <select
              value={form.cigarroEletronico.comecouAntesOuDepois}
              onChange={(e) =>
                updateNested(
                  "cigarroEletronico",
                  "comecouAntesOuDepois",
                  e.target.value
                )
              }
            >
              <option value="">O uso do cigarro eletrônico começou antes ou depois?</option>
              <option value="antes">Antes</option>
              <option value="depois">Depois</option>
              <option value="nunca_fumou">Nunca fumou cigarro comum</option>
              <option value="nao_sabe">Não sabe</option>
            </select>

            <select
              value={form.cigarroEletronico.usaParaPararCigarroComum}
              onChange={(e) =>
                updateNested(
                  "cigarroEletronico",
                  "usaParaPararCigarroComum",
                  e.target.value
                )
              }
            >
              <option value="">Usa para tentar parar de fumar cigarro comum?</option>
              <option value="sim">Sim</option>
              <option value="nao">Não</option>
            </select>

            <div className="multi-group full">
              <p>Usa outros produtos de tabaco?</p>
              <div className="checks">
                {OUTROS_PRODUTOS_TABACO.map((item) => (
                  <label key={item}>
                    <input
                      type="checkbox"
                      checked={form.cigarroEletronico.outrosProdutosTabaco.includes(
                        item
                      )}
                      onChange={() =>
                        updateNested(
                          "cigarroEletronico",
                          "outrosProdutosTabaco",
                          toggleArray(form.cigarroEletronico.outrosProdutosTabaco, item)
                        )
                      }
                    />
                    {item}
                  </label>
                ))}
              </div>
            </div>

            {form.cigarroEletronico.outrosProdutosTabaco.includes("outros") && (
              <input
                className="full"
                placeholder="Outros produtos de tabaco"
                value={form.cigarroEletronico.outrosProdutosTabacoOutros}
                onChange={(e) =>
                  updateNested(
                    "cigarroEletronico",
                    "outrosProdutosTabacoOutros",
                    e.target.value
                  )
                }
              />
            )}

            <div className="multi-group full">
              <p>Após usar, sente algum destes sintomas?</p>
              <div className="checks">
                {SINTOMAS_VAPE.map((item) => (
                  <label key={item}>
                    <input
                      type="checkbox"
                      checked={form.cigarroEletronico.sintomasPercebidos.includes(item)}
                      onChange={() =>
                        updateNested(
                          "cigarroEletronico",
                          "sintomasPercebidos",
                          toggleArray(form.cigarroEletronico.sintomasPercebidos, item)
                        )
                      }
                    />
                    {item}
                  </label>
                ))}
              </div>
            </div>

            <select
              value={form.cigarroEletronico.pioraRespiratoria}
              onChange={(e) =>
                updateNested("cigarroEletronico", "pioraRespiratoria", e.target.value)
              }
            >
              <option value="">Percebe piora de problema respiratório após o uso?</option>
              <option value="sim">Sim</option>
              <option value="nao">Não</option>
              <option value="nao_sabe">Não sabe</option>
            </select>

            <select
              value={form.cigarroEletronico.quemUsaPerto}
              onChange={(e) =>
                updateNested("cigarroEletronico", "quemUsaPerto", e.target.value)
              }
            >
              <option value="">Quem mais usa perto de você?</option>
              {CONTEXTO_SOCIAL_VAPE.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <div className="multi-group full">
              <p>O uso acontece mais em quais situações?</p>
              <div className="checks">
                {SITUACOES_USO_VAPE.map((item) => (
                  <label key={item}>
                    <input
                      type="checkbox"
                      checked={form.cigarroEletronico.situacoesUso.includes(item)}
                      onChange={() =>
                        updateNested(
                          "cigarroEletronico",
                          "situacoesUso",
                          toggleArray(form.cigarroEletronico.situacoesUso, item)
                        )
                      }
                    />
                    {item}
                  </label>
                ))}
              </div>
            </div>

            {form.cigarroEletronico.situacoesUso.includes("outros") && (
              <input
                className="full"
                placeholder="Outras situações de uso"
                value={form.cigarroEletronico.situacoesUsoOutros}
                onChange={(e) =>
                  updateNested(
                    "cigarroEletronico",
                    "situacoesUsoOutros",
                    e.target.value
                  )
                }
              />
            )}

            <select
              value={form.cigarroEletronico.incentivoDeAlguem}
              onChange={(e) =>
                updateNested("cigarroEletronico", "incentivoDeAlguem", e.target.value)
              }
            >
              <option value="">Alguém já incentivou você a usar?</option>
              <option value="sim">Sim</option>
              <option value="nao">Não</option>
            </select>

            <select
              value={form.cigarroEletronico.achaQueFazMal}
              onChange={(e) =>
                updateNested("cigarroEletronico", "achaQueFazMal", e.target.value)
              }
            >
              <option value="">Você acha que faz mal à saúde?</option>
              <option value="sim_muito">Sim, muito</option>
              <option value="sim_pouco">Sim, um pouco</option>
              <option value="nao">Não</option>
              <option value="nao_sabe">Não sabe</option>
            </select>

            <select
              value={form.cigarroEletronico.achaMenosMalQueCigarro}
              onChange={(e) =>
                updateNested(
                  "cigarroEletronico",
                  "achaMenosMalQueCigarro",
                  e.target.value
                )
              }
            >
              <option value="">Acha que faz menos mal que o cigarro comum?</option>
              <option value="sim">Sim</option>
              <option value="nao">Não</option>
              <option value="nao_sabe">Não sabe</option>
            </select>

            <select
              value={form.cigarroEletronico.achaQueCausaDependencia}
              onChange={(e) =>
                updateNested(
                  "cigarroEletronico",
                  "achaQueCausaDependencia",
                  e.target.value
                )
              }
            >
              <option value="">Você acredita que pode causar dependência?</option>
              <option value="sim">Sim</option>
              <option value="nao">Não</option>
              <option value="nao_sabe">Não sabe</option>
            </select>

            <select
              value={form.cigarroEletronico.pensouEmParar}
              onChange={(e) =>
                updateNested("cigarroEletronico", "pensouEmParar", e.target.value)
              }
            >
              <option value="">Já pensou em parar de usar?</option>
              <option value="sim">Sim</option>
              <option value="nao">Não</option>
            </select>

            <select
              value={form.cigarroEletronico.jaTentouParar}
              onChange={(e) =>
                updateNested("cigarroEletronico", "jaTentouParar", e.target.value)
              }
            >
              <option value="">Já tentou parar?</option>
              <option value="sim">Sim</option>
              <option value="nao">Não</option>
            </select>

            <input
              placeholder="Quantas tentativas já fez?"
              value={form.cigarroEletronico.quantasTentativas}
              onChange={(e) =>
                updateNested(
                  "cigarroEletronico",
                  "quantasTentativas",
                  e.target.value
                )
              }
            />

            <div className="multi-group full">
              <p>O que dificultou parar?</p>
              <div className="checks">
                {DIFICULDADE_PARAR_VAPE.map((item) => (
                  <label key={item}>
                    <input
                      type="checkbox"
                      checked={form.cigarroEletronico.dificuldadeParar.includes(item)}
                      onChange={() =>
                        updateNested(
                          "cigarroEletronico",
                          "dificuldadeParar",
                          toggleArray(form.cigarroEletronico.dificuldadeParar, item)
                        )
                      }
                    />
                    {item}
                  </label>
                ))}
              </div>
            </div>

            {form.cigarroEletronico.dificuldadeParar.includes("outro") && (
              <input
                className="full"
                placeholder="Outra dificuldade para parar"
                value={form.cigarroEletronico.dificuldadePararOutro}
                onChange={(e) =>
                  updateNested(
                    "cigarroEletronico",
                    "dificuldadePararOutro",
                    e.target.value
                  )
                }
              />
            )}

            <select
              value={form.cigarroEletronico.gostariaAjuda}
              onChange={(e) =>
                updateNested("cigarroEletronico", "gostariaAjuda", e.target.value)
              }
            >
              <option value="">Gostaria de receber ajuda para parar?</option>
              <option value="sim_agora">Sim, agora</option>
              <option value="sim_depois">Sim, depois</option>
              <option value="nao">Não</option>
            </select>
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
        <p>
          <strong>Cigarro eletrônico:</strong> {vapeScore} pontos —{" "}
          {classifyCigarroEletronico(vapeScore)}
        </p>
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
                  <th>Município</th>
                  <th>Uso atual</th>
                  <th>Vape</th>
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
                    <td>{caso.municipio}</td>
                    <td>{caso.usoAtual}</td>
                    <td>{caso.classificacaoCigarroEletronico}</td>
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
