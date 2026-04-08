const SHEET_NAME = "Respostas";

const HEADERS = [
  "id",
  "identificacao",
  "idade",
  "sexo",
  "telefone",
  "municipio",
  "estado",
  "entrevistador",
  "data",
  "idioma",
  "unidadeSaudeAtendimento",
  "recebeVisitaSaude",
  "usoAtual",
  "frequencia",
  "idadeInicioRitual",
  "idadeInicioRegular",
  "produtoPrincipal",
  "produtoOutros",
  "cigarrosDia",
  "exposicaoDomiciliar",
  "exposicaoTrabalhoEscola",
  "tentativaParar",
  "vezesTentou",
  "motivoRecaida",
  "apoioPrevio",
  "interesseParar",
  "estagioMotivacional",
  "encaminhamentoNecessario",
  "formaObtencao",
  "cultivoLocal",
  "observacoes",
  "tipoUsuario",
  "primeiroCigarro",
  "dificuldadeLocais",
  "cigarroMaisDificil",
  "fumaMaisManha",
  "fumaDoente",
  "despertaNoiteFumar",
  "sintomasAbstinencia",
  "tentativasSemSucesso",
  "q1",
  "q2",
  "q3",
  "q4",
  "q5",
  "q6",
  "q7",
  "q8",
  "q9",
  "q10",
  "jaUsouAlgumaVez",
  "idadePrimeiroUso",
  "idadeUsoFrequente",
  "tempoUso",
  "vezesPorDia",
  "tipoDispositivo",
  "usaMaisDeUm",
  "compartilhaDispositivo",
  "localCompra",
  "contemNicotina",
  "concentracaoNicotina",
  "usaSabores",
  "saboresMaisUsados",
  "saboresOutros",
  "outrasSubstancias",
  "vontadeAoAcordar",
  "dificuldadeSemUsar",
  "necessidadeForteDia",
  "usaDoente",
  "tentouReduzirSemConseguir",
  "abstinenciaQuandoSemUsar",
  "acordaNoiteParaUsar",
  "motivoInicio",
  "motivoInicioOutro",
  "motivoContinua",
  "motivoContinuaOutro",
  "fumaCigarroConvencional",
  "outrosProdutosTabaco",
  "outrosProdutosTabacoOutros",
  "comecouAntesOuDepois",
  "usaParaPararCigarroComum",
  "sintomasPercebidos",
  "pioraRespiratoria",
  "quemUsaPerto",
  "situacoesUso",
  "situacoesUsoOutros",
  "incentivoDeAlguem",
  "achaQueFazMal",
  "achaMenosMalQueCigarro",
  "achaQueCausaDependencia",
  "pensouEmParar",
  "jaTentouParar",
  "quantasTentativas",
  "dificuldadeParar",
  "dificuldadePararOutro",
  "gostariaAjuda",
  "scoreUso",
  "classificacaoUso",
  "scoreFagerstrom",
  "classificacaoFagerstrom",
  "scoreCigarroEletronico",
  "classificacaoCigarroEletronico",
  "scoreAUDIT",
  "classificacaoAUDIT",
  "scoreTotal",
  "prioridadeFinal",
  "classificacaoGeral",
  "dataRegistro",
  "origem",
  "timestampEnvio",
];

function doPost(e) {
  try {
    const sheet = getSheet_();
    const payload = JSON.parse((e && e.parameter && e.parameter.payload) || "{}");
    const casos = Array.isArray(payload.casos) ? payload.casos : [];

    ensureHeaders_(sheet);

    if (casos.length === 0) {
      return jsonResponse_({
        sucesso: true,
        mensagem: "Sem casos para inserir.",
        quantidade: 0,
      });
    }

    const rows = casos.map((caso) =>
      HEADERS.map((header) => {
        if (header === "origem") return payload.origem || "";
        if (header === "timestampEnvio") return payload.timestampEnvio || "";
        const value = caso[header];
        return value === undefined || value === null ? "" : value;
      })
    );

    sheet.getRange(sheet.getLastRow() + 1, 1, rows.length, HEADERS.length).setValues(rows);

    return jsonResponse_({
      sucesso: true,
      mensagem: "Dados enviados com sucesso.",
      quantidade: rows.length,
    });
  } catch (error) {
    return jsonResponse_({
      sucesso: false,
      mensagem: error && error.message ? error.message : String(error),
    });
  }
}

function getSheet_() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
  }

  return sheet;
}

function ensureHeaders_(sheet) {
  const currentHeaders = sheet
    .getRange(1, 1, 1, HEADERS.length)
    .getValues()[0]
    .map(String);

  const needsHeader =
    sheet.getLastRow() === 0 ||
    HEADERS.some((header, index) => currentHeaders[index] !== header);

  if (needsHeader) {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
  }
}

function jsonResponse_(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(
    ContentService.MimeType.JSON
  );
}
