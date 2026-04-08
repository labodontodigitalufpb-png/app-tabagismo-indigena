const CONFIG = {
  spreadsheetId: "1FDiacY7_nbl6cNHrvHBcksOud8zEN4-7oFwFDhnjhcA",
  enviosSheetName: "Envios",
  casosSheetName: "Casos",
  timezone: "America/Fortaleza",
};

function doGet() {
  return jsonOutput_({
    sucesso: true,
    mensagem: "Apps Script do projeto Ybytu Livre ativo.",
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
      envioId,
      planilhaId: spreadsheet.getId(),
      quantidadeCasos: Array.isArray(payload.casos) ? payload.casos.length : 0,
    });
  } catch (error) {
    console.error(error);
    return jsonOutput_({
      sucesso: false,
      mensagem: error.message || "Falha ao registrar dados.",
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
  } catch (error) {
    throw new Error("Payload JSON invalido.");
  }

  if (!parsed || !Array.isArray(parsed.casos)) {
    throw new Error("O payload precisa conter um array 'casos'.");
  }

  return parsed;
}

function getSpreadsheet_() {
  if (!CONFIG.spreadsheetId || CONFIG.spreadsheetId.indexOf("PREENCHA_") === 0) {
    throw new Error("Configure o spreadsheetId no arquivo Code.gs.");
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
  ];

  const row = [
    envioId,
    formatDate_(momento),
    sanitizeValue_(payload.origem),
    sanitizeValue_(payload.timestampEnvio),
    Number(payload.quantidadeCasos || 0),
    Array.isArray(payload.casos) ? payload.casos.length : 0,
  ];

  const sheet = ensureSheet_(spreadsheet, CONFIG.enviosSheetName, headers);
  sheet.appendRow(row);
}

function appendCasos_(spreadsheet, payload, envioId, momento) {
  const cases = Array.isArray(payload.casos) ? payload.casos : [];
  if (cases.length === 0) {
    return;
  }

  const metadataHeaders = [
    "envioId",
    "recebidoEm",
    "origem",
    "timestampEnvio",
    "indiceCaso",
  ];

  const dynamicHeaders = collectCaseHeaders_(cases);
  const headers = metadataHeaders.concat(dynamicHeaders);
  const sheet = ensureSheet_(spreadsheet, CONFIG.casosSheetName, headers);
  syncHeaders_(sheet, headers);

  const rows = cases.map((item, index) => {
    const metadataValues = [
      envioId,
      formatDate_(momento),
      sanitizeValue_(payload.origem),
      sanitizeValue_(payload.timestampEnvio),
      index + 1,
    ];

    const caseValues = dynamicHeaders.map((header) => sanitizeValue_(item[header]));
    return metadataValues.concat(caseValues);
  });

  const startRow = sheet.getLastRow() + 1;
  sheet.getRange(startRow, 1, rows.length, headers.length).setValues(rows);
}

function ensureSheet_(spreadsheet, sheetName, headers) {
  let sheet = spreadsheet.getSheetByName(sheetName);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(sheetName);
  }

  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    styleHeader_(sheet, headers.length);
  } else {
    syncHeaders_(sheet, headers);
  }

  return sheet;
}

function syncHeaders_(sheet, headers) {
  const currentHeaderCount = Math.max(sheet.getLastColumn(), headers.length);
  const currentHeaders =
    currentHeaderCount > 0
      ? sheet.getRange(1, 1, 1, currentHeaderCount).getValues()[0]
      : [];

  const missingHeaders = headers.filter((header) => currentHeaders.indexOf(header) === -1);

  if (missingHeaders.length === 0) {
    return;
  }

  const finalHeaders = currentHeaders
    .filter((header) => header !== "")
    .concat(missingHeaders);

  sheet.getRange(1, 1, 1, finalHeaders.length).setValues([finalHeaders]);
  styleHeader_(sheet, finalHeaders.length);
}

function styleHeader_(sheet, columnCount) {
  sheet
    .getRange(1, 1, 1, columnCount)
    .setBackground("#1d4ed8")
    .setFontColor("#ffffff")
    .setFontWeight("bold");
  sheet.setFrozenRows(1);
}

function collectCaseHeaders_(cases) {
  const map = {};

  cases.forEach((item) => {
    Object.keys(item || {}).forEach((key) => {
      map[key] = true;
    });
  });

  return Object.keys(map).sort();
}

function sanitizeValue_(value) {
  if (value === null || value === undefined) {
    return "";
  }

  if (Array.isArray(value)) {
    return value.join(", ");
  }

  if (typeof value === "object") {
    return JSON.stringify(value);
  }

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
