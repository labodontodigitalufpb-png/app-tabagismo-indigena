import { useEffect, useMemo, useState } from "react";
import "./App.css";

const HEADER_PARTNERSHIP =
  "Parceria PET Saúde Digital Unifal e UFAM
   / UNESP SJC Odontologia / LABODIGIT UFPB";

const STORAGE_KEY = "app_tabagismo_casos_v5";

const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbxoT_1U2HJX6dQDXOFCYpVyulxvR_AjHGEEo08eqB5EdMt1k4Irv1_2vWD0wma8Ajpf/exec";

const PRODUTOS_TABACO = [
  "cigarro",
  "fumo de rolo",
  "cigarro de palha",
  "rapé",
  "cachimbo",
  "charuto",
  "cigarro eletrônico",
  "narguilé",
  "maconha",
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
    aldeia: "",
    municipio: "",
    estado: "",
    etnia: "",
    entrevistador: "",
    data: "",
    idioma: "Português",
  },
  uso: {
    usoAtual: "",
    frequencia: "",
    idadeInicio: "",
    produtoPrincipal: [],
    cigarrosDia: "",
    exposicaoDomiciliar: "",
    tentativaParar: "",
    vezesTentou: "",
    interesseParar: "",
    observacoes: "",
  },
  fagerstrom: {
    primeiroCigarro: "",
    dificuldadeLocais: "",
    cigarroMaisDificil: "",
    cigarrosDia: "",
    fumaMaisManha: "",
    fumaDoente: "",
  },
  cultural: {
    usoTradicionalExiste: "",
    diferencaTradicionalComercial: "",
    contextoUso: [],
    finalidadeUso: [],
    quemInfluenciou: "",
    percepcaoComunidade: "",
    produtoLocal: [],
    formaConsumo: [],
    comentarios: "",
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

function classifyFagerstrom(score) {
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
  if (uso.tentativaParar === "nao") score += 1;

  return Math.min(score, 8);
}

function classifyUso(score) {
  if (score <= 2) return "Baixo padrão de uso";
  if (score <= 5) return "Padrão intermediário";
  return "Padrão elevado";
}

function scoreCultural(cultural) {
  let score = 0;

  if (cultural.usoTradicionalExiste === "sim") score += 1;
  if (cultural.diferencaTradicionalComercial === "nao") score += 2;
  if (cultural.contextoUso.includes("ritual")) score += 1;
  if (cultural.contextoUso.includes("cotidiano")) score += 2;
  if (cultural.finalidadeUso.includes("dependencia")) score += 2;
  if (cultural.finalidadeUso.includes("dependência")) score += 2;
  if (cultural.finalidadeUso.includes("social")) score += 1;

  return Math.min(score, 8);
}

function classifyCultural(score) {
  if (score <= 2) return "Baixa complexidade cultural";
  if (score <= 5) return "Complexidade cultural moderada";
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
  if (total <= 7) return "Ausente / Baixo";
  if (total <= 13) return "Moderado";
  return "Alto";
}

function getDependenciaBarClass(total) {
  if (total <= 7) return "level-low";
  if (total <= 13) return "level-medium";
  return "level-high";
}

function getDependenciaBarWidth(total) {
  const maxScore = 34;
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

export default function App() {
  const [tab, setTab] = useState("uso");
  const [form, setForm] = useState(initialState);
  const [casos, setCasos] = useState(loadCasesFromStorage);
  const [enviandoSheets, setEnviandoSheets] = useState(false);
  const [mensagemEnvio, setMensagemEnvio] = useState("");

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

  const fagerScore = useMemo(
    () => scoreFagerstrom(form.fagerstrom),
    [form.fagerstrom]
  );

  const usoScore = useMemo(() => scoreUso(form.uso), [form.uso]);

  const culturalScore = useMemo(
    () => scoreCultural(form.cultural),
    [form.cultural]
  );

  const auditScore = useMemo(() => scoreAUDIT(form.audit), [form.audit]);

  const total = fagerScore + usoScore + culturalScore + auditScore;

  const prioridade =
    total <= 10
      ? "Baixa prioridade"
      : total <= 20
      ? "Prioridade moderada"
      : "Alta prioridade para abordagem";

  const salvarCaso = () => {
    const novoCaso = {
      id: Date.now(),
      identificacao: form.participante.identificacao,
      idade: form.participante.idade,
      sexo: form.participante.sexo,
      aldeia: form.participante.aldeia,
      municipio: form.participante.municipio,
      estado: form.participante.estado,
      etnia: form.participante.etnia,
      entrevistador: form.participante.entrevistador,
      data: form.participante.data,
      idioma: form.participante.idioma,

      usoAtual: form.uso.usoAtual,
      frequencia: form.uso.frequencia,
      idadeInicio: form.uso.idadeInicio,
      produtoPrincipal: form.uso.produtoPrincipal.join(", "),
      cigarrosDiaUso: form.uso.cigarrosDia,
      exposicaoDomiciliar: form.uso.exposicaoDomiciliar,
      tentativaParar: form.uso.tentativaParar,
      vezesTentou: form.uso.vezesTentou,
      interesseParar: form.uso.interesseParar,
      observacoes: form.uso.observacoes,

      primeiroCigarro: form.fagerstrom.primeiroCigarro,
      dificuldadeLocais: form.fagerstrom.dificuldadeLocais,
      cigarroMaisDificil: form.fagerstrom.cigarroMaisDificil,
      cigarrosDiaFagerstrom: form.fagerstrom.cigarrosDia,
      fumaMaisManha: form.fagerstrom.fumaMaisManha,
      fumaDoente: form.fagerstrom.fumaDoente,

      usoTradicionalExiste: form.cultural.usoTradicionalExiste,
      diferencaTradicionalComercial:
        form.cultural.diferencaTradicionalComercial,
      contextoUso: form.cultural.contextoUso.join(", "),
      finalidadeUso: form.cultural.finalidadeUso.join(", "),
      quemInfluenciou: form.cultural.quemInfluenciou,
      percepcaoComunidade: form.cultural.percepcaoComunidade,
      produtoLocal: form.cultural.produtoLocal.join(", "),
      formaConsumo: form.cultural.formaConsumo.join(", "),
      comentarios: form.cultural.comentarios,

      auditQ1: form.audit.q1,
      auditQ2: form.audit.q2,
      auditQ3: form.audit.q3,
      auditQ4: form.audit.q4,
      auditQ5: form.audit.q5,
      auditQ6: form.audit.q6,
      auditQ7: form.audit.q7,
      auditQ8: form.audit.q8,
      auditQ9: form.audit.q9,
      auditQ10: form.audit.q10,

      scoreUso: usoScore,
      classificacaoUso: classifyUso(usoScore),
      scoreFagerstrom: fagerScore,
      classificacaoFagerstrom: classifyFagerstrom(fagerScore),
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
    if (casos.length === 0) {
      alert("Nenhum caso foi salvo ainda.");
      return;
    }

    setEnviandoSheets(true);
    setMensagemEnvio("");

    try {
      const formData = new FormData();
      formData.append(
        "payload",
        JSON.stringify({
          origem: "app-tabagismo-indigena",
          timestampEnvio: new Date().toISOString(),
          quantidadeCasos: casos.length,
          casos,
        })
      );

      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        body: formData,
      });

      const texto = await response.text();
      console.log("Resposta do Apps Script:", texto);

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

      setMensagemEnvio("Dados enviados com sucesso para o Google Sheets.");
      alert("Dados enviados com sucesso para o Google Sheets.");
    } catch (error) {
      console.error("Erro ao enviar para Google Sheets:", error);
      setMensagemEnvio("Não foi possível enviar os dados ao Google Sheets.");
      alert("Erro ao enviar para o Google Sheets.");
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
    const confirmar = window.confirm(
      "Deseja realmente apagar todos os casos salvos?"
    );
    if (!confirmar) return;
    setCasos([]);
    localStorage.removeItem(STORAGE_KEY);
    setMensagemEnvio("");
  };

  return (
    <div className="container">
      <header className="hero">
        <div className="hero-top">{HEADER_PARTNERSHIP}</div>
        <h1>Avaliação do hábito do tabagismo em população indígena</h1>
        <p className="subtitle">
          App com 4 instrumentos: uso de tabaco, Fagerström, módulo cultural e AUDIT.
        </p>
      </header>

      <div className="card">
        <h2>Identificação</h2>
        <div className="grid">
          <input
            placeholder="Identificação"
            value={form.participante.identificacao}
            onChange={(e) =>
              updateNested("participante", "identificacao", e.target.value)
            }
          />
          <input
            placeholder="Idade"
            value={form.participante.idade}
            onChange={(e) =>
              updateNested("participante", "idade", e.target.value)
            }
          />
          <input
            placeholder="Sexo"
            value={form.participante.sexo}
            onChange={(e) =>
              updateNested("participante", "sexo", e.target.value)
            }
          />
          <input
            placeholder="Aldeia"
            value={form.participante.aldeia}
            onChange={(e) =>
              updateNested("participante", "aldeia", e.target.value)
            }
          />
          <input
            placeholder="Município"
            value={form.participante.municipio}
            onChange={(e) =>
              updateNested("participante", "municipio", e.target.value)
            }
          />
          <input
            placeholder="Estado"
            value={form.participante.estado}
            onChange={(e) =>
              updateNested("participante", "estado", e.target.value)
            }
          />
          <input
            placeholder="Etnia"
            value={form.participante.etnia}
            onChange={(e) =>
              updateNested("participante", "etnia", e.target.value)
            }
          />
          <input
            placeholder="Entrevistador"
            value={form.participante.entrevistador}
            onChange={(e) =>
              updateNested("participante", "entrevistador", e.target.value)
            }
          />
          <input
            type="date"
            value={form.participante.data}
            onChange={(e) =>
              updateNested("participante", "data", e.target.value)
            }
          />
          <input
            placeholder="Idioma"
            value={form.participante.idioma}
            onChange={(e) =>
              updateNested("participante", "idioma", e.target.value)
            }
          />
        </div>
      </div>

      <div className="tabs">
        <button
          className={tab === "uso" ? "active" : ""}
          onClick={() => setTab("uso")}
        >
          Instrumento 1
        </button>
        <button
          className={tab === "fagerstrom" ? "active" : ""}
          onClick={() => setTab("fagerstrom")}
        >
          Instrumento 2
        </button>
        <button
          className={tab === "cultural" ? "active" : ""}
          onClick={() => setTab("cultural")}
        >
          Instrumento 3
        </button>
        <button
          className={tab === "audit" ? "active" : ""}
          onClick={() => setTab("audit")}
        >
          Instrumento 4
        </button>
      </div>

      {tab === "uso" && (
        <div className="card">
          <h2>Questionário de uso de tabaco</h2>

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
              onChange={(e) =>
                updateNested("uso", "frequencia", e.target.value)
              }
            >
              <option value="">Frequência</option>
              <option value="diario">Diário</option>
              <option value="semanal">Semanal</option>
              <option value="ocasional">Ocasional</option>
              <option value="nao_usa">Não usa atualmente</option>
            </select>

            <input
              placeholder="Idade de início"
              value={form.uso.idadeInicio}
              onChange={(e) =>
                updateNested("uso", "idadeInicio", e.target.value)
              }
            />

            <input
              placeholder="Cigarros/unidades por dia"
              value={form.uso.cigarrosDia}
              onChange={(e) =>
                updateNested("uso", "cigarrosDia", e.target.value)
              }
            />

            <select
              value={form.uso.exposicaoDomiciliar}
              onChange={(e) =>
                updateNested("uso", "exposicaoDomiciliar", e.target.value)
              }
            >
              <option value="">Exposição domiciliar</option>
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
              onChange={(e) =>
                updateNested("uso", "vezesTentou", e.target.value)
              }
            />

            <select
              value={form.uso.interesseParar}
              onChange={(e) =>
                updateNested("uso", "interesseParar", e.target.value)
              }
            >
              <option value="">Interesse em parar</option>
              <option value="sim">Sim</option>
              <option value="nao">Não</option>
              <option value="talvez">Talvez</option>
            </select>

            <div className="multi-group">
              <p>Produto principal (pode marcar mais de um)</p>
              <div className="checks">
                {PRODUTOS_TABACO.map((item) => (
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

          <div className="grid">
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
          </div>
        </div>
      )}

      {tab === "cultural" && (
        <div className="card">
          <h2>Módulo cultural</h2>

          <div className="grid">
            <select
              value={form.cultural.usoTradicionalExiste}
              onChange={(e) =>
                updateNested("cultural", "usoTradicionalExiste", e.target.value)
              }
            >
              <option value="">Existe uso tradicional/ritual?</option>
              <option value="sim">Sim</option>
              <option value="nao">Não</option>
              <option value="nao_sei">Não sei</option>
            </select>

            <select
              value={form.cultural.diferencaTradicionalComercial}
              onChange={(e) =>
                updateNested(
                  "cultural",
                  "diferencaTradicionalComercial",
                  e.target.value
                )
              }
            >
              <option value="">Diferencia tradicional de comercial?</option>
              <option value="sim">Sim</option>
              <option value="nao">Não</option>
              <option value="parcial">Parcialmente</option>
            </select>

            <input
              placeholder="Quem influenciou o início?"
              value={form.cultural.quemInfluenciou}
              onChange={(e) =>
                updateNested("cultural", "quemInfluenciou", e.target.value)
              }
            />

            <select
              value={form.cultural.percepcaoComunidade}
              onChange={(e) =>
                updateNested("cultural", "percepcaoComunidade", e.target.value)
              }
            >
              <option value="">Percepção da comunidade</option>
              <option value="hábito comum na comunidade">
                Hábito comum na comunidade
              </option>
              <option value="hábito incomum na comunidade">
                Hábito incomum na comunidade
              </option>
              <option value="hábito parcialmente tolerado na comunidade">
                Hábito parcialmente tolerado na comunidade
              </option>
            </select>
          </div>

          <div className="multi-group">
            <p>Produto local mencionado (pode marcar mais de um)</p>
            <div className="checks">
              {PRODUTOS_TABACO.map((item) => (
                <label key={item}>
                  <input
                    type="checkbox"
                    checked={form.cultural.produtoLocal.includes(item)}
                    onChange={() =>
                      updateNested(
                        "cultural",
                        "produtoLocal",
                        toggleArray(form.cultural.produtoLocal, item)
                      )
                    }
                  />
                  {item}
                </label>
              ))}
            </div>
          </div>

          <h3>Contextos de uso</h3>
          <div className="checks">
            {["ritual", "cotidiano", "social", "trabalho", "festas"].map(
              (item) => (
                <label key={item}>
                  <input
                    type="checkbox"
                    checked={form.cultural.contextoUso.includes(item)}
                    onChange={() =>
                      updateNested(
                        "cultural",
                        "contextoUso",
                        toggleArray(form.cultural.contextoUso, item)
                      )
                    }
                  />
                  {item}
                </label>
              )
            )}
          </div>

          <h3>Finalidade atribuída</h3>
          <div className="checks">
            {["ritual", "social", "alívio", "dependencia", "costume"].map(
              (item) => (
                <label key={item}>
                  <input
                    type="checkbox"
                    checked={form.cultural.finalidadeUso.includes(item)}
                    onChange={() =>
                      updateNested(
                        "cultural",
                        "finalidadeUso",
                        toggleArray(form.cultural.finalidadeUso, item)
                      )
                    }
                  />
                  {item}
                </label>
              )
            )}
          </div>

          <h3>Forma de consumo</h3>
          <div className="checks">
            {["fumado", "mascado", "rapé", "cachimbo", "artesanal"].map(
              (item) => (
                <label key={item}>
                  <input
                    type="checkbox"
                    checked={form.cultural.formaConsumo.includes(item)}
                    onChange={() =>
                      updateNested(
                        "cultural",
                        "formaConsumo",
                        toggleArray(form.cultural.formaConsumo, item)
                      )
                    }
                  />
                  {item}
                </label>
              )
            )}
          </div>

          <textarea
            placeholder="Comentários adicionais"
            value={form.cultural.comentarios}
            onChange={(e) =>
              updateNested("cultural", "comentarios", e.target.value)
            }
          />
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

        <p>
          <strong>Instrumento 1:</strong> {usoScore} pontos —{" "}
          {classifyUso(usoScore)}
        </p>
        <p>
          <strong>Instrumento 2:</strong> {fagerScore} pontos — dependência{" "}
          {classifyFagerstrom(fagerScore)}
        </p>
        <p>
          <strong>Instrumento 3:</strong> {culturalScore} pontos —{" "}
          {classifyCultural(culturalScore)}
        </p>
        <p>
          <strong>Instrumento 4 (AUDIT):</strong> {auditScore} pontos —{" "}
          {classifyAUDIT(auditScore)}
        </p>
        <p>
          <strong>Prioridade final:</strong> {prioridade}
        </p>

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
                  <th>Identificação</th>
                  <th>Aldeia</th>
                  <th>Município</th>
                  <th>Estado</th>
                  <th>Uso atual</th>
                  <th>AUDIT</th>
                  <th>Score total</th>
                  <th>Prioridade</th>
                  <th>Ação</th>
                </tr>
              </thead>
              <tbody>
                {casos.map((caso, index) => (
                  <tr key={caso.id}>
                    <td>{index + 1}</td>
                    <td>{caso.identificacao}</td>
                    <td>{caso.aldeia}</td>
                    <td>{caso.municipio}</td>
                    <td>{caso.estado}</td>
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