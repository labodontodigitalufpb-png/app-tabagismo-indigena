const CONFIG = {
  spreadsheetId: "1FDiacY7_nbl6cNHrvHBcksOud8zEN4-7oFwFDhnjhcA",
  enviosSheetName: "Envios",
  casosSheetName: "Casos",
  timezone: "America/Fortaleza",
};

const BLOCKED_SPREADSHEET_IDS = [
  "1PQTTNZfqeHJRL7FOmfDeRgGsKxJCGMxEWQOsg2Lo0io",
];

const SCRIPT_SCHEMA_VERSION = "2026-04-20-tabagismo-indigena-v1";

const CASE_KEY_ORDER = [
  "id",
  "dataRegistro",
  "identificacao",
  "telefone",
  "idade",
  "sexo",
  "dsei",
  "aldeia",
  "polo",
  "escolaridade",
  "racaCor",
  "ocupacao",
  "municipio",
  "estado",
  "ine",
  "tipoEquipe",
  "profissionalResponsavel",
  "entrevistador",
  "data",
  "idioma",
  "localResidencia",
  "recebeVisitaSaude",
  "usoAtual",
  "frequencia",
  "idadeInicioRegular",
  "produtoPrincipal",
  "produtoOutros",
  "cigarrosDia",
  "exposicaoDomiciliar",
  "exposicaoTrabalhoEscola",
  "tentativaParar",
  "vezesTentou",
  "tempoUltimaTentativa",
  "motivoRecaida",
  "apoioPrevio",
  "usouMedicacaoApoioEstruturado",
  "procurouGrupoCessacaoSemAcesso",
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
  "upenn_q1",
  "upenn_q2",
  "upenn_q3",
  "upenn_q4",
  "upenn_q5",
  "upenn_q6",
  "upenn_q7",
  "upenn_q8",
  "upenn_q9",
  "upenn_q10",
  "jaUsouAlgumaVez",
  "idadePrimeiroUso",
  "idadeUsoFrequente",
  "tempoUso",
  "frequenciaUso",
  "vezesPorDia",
  "tipoDispositivo",
  "usaMaisDeUm",
  "compartilhaDispositivo",
  "localCompra",
  "localCompraOutros",
  "contemNicotina",
  "concentracaoNicotina",
  "usaSabores",
  "saboresMaisUsados",
  "saboresOutros",
  "outrasSubstancias",
  "outrasSubstanciasOutras",
  "usoDualTabacoCombustivel",
  "usaAoAcordar",
  "tentativasParar",
  "scoreUso",
  "classificacaoUso",
  "scoreFagerstrom",
  "classificacaoFagerstrom",
  "scoreAUDIT",
  "classificacaoAUDIT",
  "scoreUPenn",
  "classificacaoUPenn",
  "scoreEletronico",
  "classificacaoEletronico",
  "riscoIntegrado",
  "condutaSugerida",
  "scoreTotal",
  "prioridadeFinal",
  "classificacaoGeral",
];

const CASE_HEADER_LABELS = {
  identificacao: "Nome do usuário",
  dsei: "DSEI",
  aldeia: "Aldeia",
  polo: "Polo",
  racaCor: "Raça/cor",
  ine: "INE",
  q1: "Q1",
  q2: "Q2",
  q3: "Q3",
  q4: "Q4",
  q5: "Q5",
  q6: "Q6",
  q7: "Q7",
  q8: "Q8",
  q9: "Q9",
  q10: "Q10",
  upenn_q1: "UPenn Q1",
  upenn_q2: "UPenn Q2",
  upenn_q3: "UPenn Q3",
  upenn_q4: "UPenn Q4",
  upenn_q5: "UPenn Q5",
  upenn_q6: "UPenn Q6",
  upenn_q7: "UPenn Q7",
  upenn_q8: "UPenn Q8",
  upenn_q9: "UPenn Q9",
  upenn_q10: "UPenn Q10",
};

function doGet() {
  return jsonOutput_({
    sucesso: true,
    mensagem: "Tabagismo Indigena Apps Script ativo",
    schemaVersion: SCRIPT_SCHEMA_VERSION,
    spreadsheetId: CONFIG.spreadsheetId,
    casosSheetName: CONFIG.casosSheetName,
    enviosSheetName: CONFIG.enviosSheetName,
    scriptId: ScriptApp.getScriptId(),
    timestamp: new Date().toISOString(),
  });
}

function doPost(e) {
  try {
    const payload = parsePayload_(e);
    const spreadsheet = getSpreadsheet_();
    const envioId = Utilities.getUuid();
    const momento = new Date();

    appendResumoEnvio_(spreadsheet, payload, envioId, momento);
    appendCasos_(spreadsheet, payload, envioId, momento);

    return jsonOutput_({
      sucesso: true,
      mensagem: "Dados registrados com sucesso.",
      schemaVersion: SCRIPT_SCHEMA_VERSION,
      envioId: envioId,
      planilhaId: spreadsheet.getId(),
      quantidadeCasos: Array.isArray(payload.casos) ? payload.casos.length : 0,
    });
  } catch (error) {
    console.error(error);
    return jsonOutput_({
      sucesso: false,
      mensagem: error && error.message ? error.message : "Falha ao registrar dados.",
    });
  }
}

function parsePayload_(e) {
  const rawPayload =
    (e && e.parameter && e.parameter.payload) ||
    (e && e.postData && e.postData.contents);

  if (!rawPayload) {
    throw new Error("Payload ausente.");
  }

  let parsed;
  try {
    parsed = JSON.parse(rawPayload);
  } catch (_error) {
    throw new Error("Payload JSON invalido.");
  }

  if (!parsed || !Array.isArray(parsed.casos)) {
    throw new Error("O payload precisa conter um array 'casos'.");
  }

  return parsed;
}

function getSpreadsheet_() {
  if (!CONFIG.spreadsheetId || String(CONFIG.spreadsheetId).indexOf("PREENCHA_") === 0) {
    throw new Error("Configure o spreadsheetId no arquivo Code.gs.");
  }
  if (BLOCKED_SPREADSHEET_IDS.indexOf(String(CONFIG.spreadsheetId).trim()) !== -1) {
    throw new Error(
      "O spreadsheetId configurado esta bloqueado por seguranca. Use a planilha do projeto Tabagismo Indigena."
    );
  }
  return SpreadsheetApp.openById(CONFIG.spreadsheetId);
}

function appendResumoEnvio_(spreadsheet, payload, envioId, momento) {
  const headers = [
    "envioId",
    "recebidoEm",
    "origem",
    "timestampEnvio",
    "quantidadeCasosInformada",
    "quantidadeCasosRecebida",
    "schemaVersion",
  ];

  const row = [
    envioId,
    formatDate_(momento),
    sanitizeValue_(payload.origem),
    sanitizeValue_(payload.timestampEnvio),
    Number(payload.quantidadeCasos || 0),
    Array.isArray(payload.casos) ? payload.casos.length : 0,
    SCRIPT_SCHEMA_VERSION,
  ];

  const sheet = ensureSheet_(spreadsheet, CONFIG.enviosSheetName, headers);
  sheet.appendRow(row);
}

function appendCasos_(spreadsheet, payload, envioId, momento) {
  const cases = Array.isArray(payload.casos) ? payload.casos : [];
  if (cases.length === 0) return;

  const metadataHeaders = [
    "envioId",
    "recebidoEm",
    "origem",
    "timestampEnvio",
    "schemaVersion",
    "indiceCaso",
  ];

  const dynamicKeys = collectCaseKeys_(cases);
  const orderedKeys = orderCaseKeys_(dynamicKeys);
  const dynamicHeaders = orderedKeys.map((key) => headerForKey_(key));
  const headers = metadataHeaders.concat(dynamicHeaders);

  const sheet = ensureSheet_(spreadsheet, CONFIG.casosSheetName, headers);
  syncHeaders_(sheet, headers);

  const rows = cases.map((item, index) => {
    const metadataValues = [
      envioId,
      formatDate_(momento),
      sanitizeValue_(payload.origem),
      sanitizeValue_(payload.timestampEnvio),
      SCRIPT_SCHEMA_VERSION,
      index + 1,
    ];

    const caseValues = orderedKeys.map((key) => sanitizeValue_(item[key]));
    return metadataValues.concat(caseValues);
  });

  const startRow = sheet.getLastRow() + 1;
  sheet.getRange(startRow, 1, rows.length, headers.length).setValues(rows);
}

function ensureSheet_(spreadsheet, sheetName, headers) {
  let sheet = spreadsheet.getSheetByName(sheetName);
  if (!sheet) sheet = spreadsheet.insertSheet(sheetName);

  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    styleHeader_(sheet, headers.length);
  } else {
    syncHeaders_(sheet, headers);
  }

  return sheet;
}

function syncHeaders_(sheet, headers) {
  const currentHeaderCount = Math.max(sheet.getLastColumn(), headers.length, 1);
  const currentHeaders =
    sheet.getLastRow() > 0
      ? sheet.getRange(1, 1, 1, currentHeaderCount).getValues()[0]
      : [];

  if (headersEqual_(currentHeaders, headers)) return;

  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  styleHeader_(sheet, headers.length);
}

function styleHeader_(sheet, columnCount) {
  sheet
    .getRange(1, 1, 1, columnCount)
    .setBackground("#1d4ed8")
    .setFontColor("#ffffff")
    .setFontWeight("bold");
  sheet.setFrozenRows(1);
}

function collectCaseKeys_(cases) {
  const map = {};
  cases.forEach((item) => {
    Object.keys(item || {}).forEach((key) => {
      map[key] = true;
    });
  });
  return Object.keys(map).sort();
}

function orderCaseKeys_(keys) {
  const list = Array.isArray(keys) ? keys : [];

  const known = CASE_KEY_ORDER.filter((key) => list.indexOf(key) !== -1);
  const remaining = list.filter((key) => CASE_KEY_ORDER.indexOf(key) === -1).sort();
  return known.concat(remaining);
}

function headerForKey_(key) {
  return CASE_HEADER_LABELS[key] || key;
}

function headersEqual_(currentHeaders, targetHeaders) {
  if (!Array.isArray(currentHeaders)) return false;
  if (currentHeaders.length < targetHeaders.length) return false;

  for (let i = 0; i < targetHeaders.length; i += 1) {
    if ((currentHeaders[i] || "") !== targetHeaders[i]) return false;
  }

  return true;
}

function sanitizeValue_(value) {
  if (value === null || value === undefined) return "";
  if (Array.isArray(value)) return value.join(", ");
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

function formatDate_(date) {
  return Utilities.formatDate(date, CONFIG.timezone, "yyyy-MM-dd'T'HH:mm:ssXXX");
}

function jsonOutput_(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(
    ContentService.MimeType.JSON
  );
}
