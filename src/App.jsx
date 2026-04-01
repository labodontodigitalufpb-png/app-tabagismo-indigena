import { useEffect, useMemo, useState } from "react";
import "./index.css";
import logo from "./assets/logo.png";

const HEADER_PARTNERSHIP =
  "Ybytu Livre • PET Saúde Digital Unifal e UFAM • UNESP SJC Odontologia • LABODIGIT UFPB";

const STORAGE_KEY = "app_tabagismo_casos_v6";

const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbyyKlYxY78A5IaOOt_ceWc1yHwsZM0HRlHeF6RiQQgg-Z_eypPpA25EZqhKjC_kPF2geA/exec";

const PRODUTOS_TABACO = [
  "cigarro industrializado",
  "fumo de rolo",
  "cigarro de palha",
  "rapé",
  "cachimbo",
  "charuto",
  "cigarro eletrônico",
  "narguilé",
  "tabaco ritual",
  "outra planta para fumar",
  "outros",
];

const CONTEXTOS_USO = [
  "ritual",
  "cotidiano",
  "social",
  "trabalho",
  "festas",
  "luto/cerimônia",
  "cura/tratamento tradicional",
  "outros",
];

const FINALIDADES_USO = [
  "ritual/espiritual",
  "socialização",
  "alívio emocional",
  "alívio da vontade de fumar",
  "costume diário",
  "pressão social",
  "tradição familiar",
  "outros",
];

const FORMAS_CONSUMO = [
  "cigarro industrializado",
  "cigarro artesanal/de palha",
  "cachimbo",
  "rapé",
  "mascado",
  "charuto",
  "outras",
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
  cultural: {
    usoTradicionalExiste: "",
    tiposRituais: "",
    diferencaTradicionalComercial: "",
    contextoUso: [],
    contextoUsoOutros: "",
    finalidadeUso: [],
    finalidadeUsoOutros: "",
    quemInfluenciou: "",
    inicioEmContextoRitual: "",
    houveEscolha: "",
    percepcaoComunidade: "",
    produtoLocalDefinicao: "",
    produtoLocal: [],
    produtoLocalOutros: "",
    formaConsumo: [],
    formaConsumoOutras: "",
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
  let score = 0;

  if (cultural.usoTradicionalExiste === "sim") score += 1;
  if (cultural.diferencaTradicionalComercial === "nao") score += 2;
  if (cultural.contextoUso.includes("ritual")) score += 1;
  if (cultural.contextoUso.includes("cotidiano")) score += 2;
  if (cultural.finalidadeUso.includes("alívio da vontade de fumar")) score += 2;
  if (cultural.finalidadeUso.includes("alívio emocional")) score += 1;
  if (cultural.finalidadeUso.includes("socialização")) score += 1;

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
  const maxScore = 38;
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
  const culturalScore = useMemo(() => scoreCultural(form.cultural), [form.cultural]);
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
      ...form.participante,
      ...form.uso,
      ...form.fagerstrom,
      ...form.audit,
      produtoPrincipal: form.uso.produtoPrincipal.join(", "),
      contextoUso: form.cultural.contextoUso.join(", "),
      finalidadeUso: form.cultural.finalidadeUso.join(", "),
      produtoLocal: form.cultural.produtoLocal.join(", "),
      formaConsumo: form.cultural.formaConsumo.join(", "),
      ...form.cultural,
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
      let json = {};

      try {
        json = JSON.parse(texto);
      } catch {
        json = {};
      }

      if (!response.ok) throw new Error(`Erro HTTP ${response.status}`);
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
            style={{ width: "155px" }}
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
            placeholder="Aldeia"
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
          <input
            type="date"
            placeholder="Data de entrevista"
            aria-label="Data de entrevista"
            title="Data de entrevista"
            value={form.participante.data}
            onChange={(e) => updateNested("participante", "data", e.target.value)}
          />
          <input
            placeholder="Idioma"
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
        <button
          className={tab === "cultural" ? "active" : ""}
          onClick={() => setTab("cultural")}
        >
          Módulo cultural
        </button>
        <button className={tab === "audit" ? "active" : ""} onClick={() => setTab("audit")}>
          AUDIT
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
              disabled={form.fagerstrom.tipoUsuario !== "cigarro_industrializado"}
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
              disabled={form.fagerstrom.tipoUsuario !== "cigarro_industrializado"}
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
              disabled={form.fagerstrom.tipoUsuario !== "cigarro_industrializado"}
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
              disabled={form.fagerstrom.tipoUsuario !== "cigarro_industrializado"}
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
              disabled={form.fagerstrom.tipoUsuario !== "cigarro_industrializado"}
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
              disabled={form.fagerstrom.tipoUsuario !== "cigarro_industrializado"}
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

      {tab === "cultural" && (
        <div className="card">
          <h2>Módulo cultural</h2>
          <SectionHint>
            Diferencia uso ritual, cotidiano e significados culturais.
          </SectionHint>

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

            <input
              placeholder="Quais rituais/cerimônias envolvem o uso?"
              value={form.cultural.tiposRituais}
              onChange={(e) =>
                updateNested("cultural", "tiposRituais", e.target.value)
              }
            />

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
              <option value="">Diferencia uso ritual/tradicional do uso comercial?</option>
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
              value={form.cultural.inicioEmContextoRitual}
              onChange={(e) =>
                updateNested("cultural", "inicioEmContextoRitual", e.target.value)
              }
            >
              <option value="">O início ocorreu em contexto ritual?</option>
              <option value="sim">Sim</option>
              <option value="nao">Não</option>
            </select>

            <select
              value={form.cultural.houveEscolha}
              onChange={(e) =>
                updateNested("cultural", "houveEscolha", e.target.value)
              }
            >
              <option value="">Houve possibilidade real de escolha?</option>
              <option value="sim">Sim</option>
              <option value="nao">Não</option>
              <option value="parcial">Parcialmente</option>
            </select>

            <select
              value={form.cultural.percepcaoComunidade}
              onChange={(e) =>
                updateNested("cultural", "percepcaoComunidade", e.target.value)
              }
            >
              <option value="">Como a comunidade percebe esse uso?</option>
              <option value="aceito_em_rituais">Aceito em rituais específicos</option>
              <option value="aceito_no_cotidiano">Aceito também no cotidiano</option>
              <option value="desencorajado">Desencorajado pela comunidade</option>
              <option value="varia_por_situacao">Varia conforme situação/grupo</option>
            </select>

            <select
              value={form.cultural.produtoLocalDefinicao}
              onChange={(e) =>
                updateNested("cultural", "produtoLocalDefinicao", e.target.value)
              }
            >
              <option value="">“Produto local” refere-se a:</option>
              <option value="consumido_pelo_participante">
                Produto consumido pelo participante
              </option>
              <option value="disponivel_na_comunidade">
                Produto disponível na comunidade
              </option>
              <option value="ambos">Ambos</option>
            </select>
          </div>

          <div className="multi-group full">
            <p>Produto local mencionado</p>
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

          {form.cultural.produtoLocal.includes("outros") && (
            <input
              className="full"
              placeholder="Outro produto local (especificar)"
              value={form.cultural.produtoLocalOutros}
              onChange={(e) =>
                updateNested("cultural", "produtoLocalOutros", e.target.value)
              }
            />
          )}

          <h3>Contextos de uso</h3>
          <div className="checks">
            {CONTEXTOS_USO.map((item) => (
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
            ))}
          </div>

          {form.cultural.contextoUso.includes("outros") && (
            <input
              className="full mt"
              placeholder="Outro contexto de uso"
              value={form.cultural.contextoUsoOutros}
              onChange={(e) =>
                updateNested("cultural", "contextoUsoOutros", e.target.value)
              }
            />
          )}

          <h3>Finalidade atribuída ao uso</h3>
          <div className="checks">
            {FINALIDADES_USO.map((item) => (
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
            ))}
          </div>

          {form.cultural.finalidadeUso.includes("outros") && (
            <input
              className="full mt"
              placeholder="Outra finalidade"
              value={form.cultural.finalidadeUsoOutros}
              onChange={(e) =>
                updateNested("cultural", "finalidadeUsoOutros", e.target.value)
              }
            />
          )}

          <h3>Forma de consumo</h3>
          <div className="checks">
            {FORMAS_CONSUMO.map((item) => (
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
            ))}
          </div>

          {form.cultural.formaConsumo.includes("outras") && (
            <input
              className="full mt"
              placeholder="Outra forma de consumo"
              value={form.cultural.formaConsumoOutras}
              onChange={(e) =>
                updateNested("cultural", "formaConsumoOutras", e.target.value)
              }
            />
          )}

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
                  <th>Residência</th>
                  <th>Aldeia</th>
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