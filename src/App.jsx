import { useEffect, useMemo, useState } from "react";
import "./App.css";

const HEADER_PARTNERSHIP =
  "Parceria PET Saúde Digital / UNESP SJC Odontologia / LABODIGIT UFPB";

const STORAGE_KEY = "app_tabagismo_casos_v4";

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

  const total = fagerScore + usoScore + culturalScore;

  const prioridade =
    total <= 7
      ? "Baixa prioridade"
      : total <= 13
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

      scoreUso: usoScore,
      classificacaoUso: classifyUso(usoScore),
      scoreFagerstrom: fagerScore,
      classificacaoFagerstrom: classifyFagerstrom(fagerScore),
      scoreCultural: culturalScore,
      classificacaoCultural: classifyCultural(culturalScore),
      scoreTotal: total,
      prioridadeFinal: prioridade,
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
          App com 3 instrumentos: uso de tabaco, Fagerström e módulo cultural.
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
            onChange={(e) => updateNested("participante", "data", e.target.value)}
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
            {["ritual", "social", "alívio", "dependência", "costume"].map(
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
          <strong>Prioridade final:</strong> {prioridade}
        </p>

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