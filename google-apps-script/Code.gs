const CONFIG = {
  spreadsheetId: "1FDiacY7_nbl6cNHrvHBcksOud8zEN4-7oFwFDhnjhcA",
  enviosSheetName: "Envios",
  casosSheetName: "Casos",
  timezone: "America/Fortaleza",
};

const SCRIPT_SCHEMA_VERSION = "2026-04-15-case-order-v4";

const CASE_KEY_ORDER = [
  "id",
  "dataRegistro",
  "identificacao",
  "telefone",
  "idade",
  "sexo",
  "aldeia",
  "municipio",
  "estado",
  "etnia",
  "entrevistador",
  "data",
  "idioma",
  "unidadeSaudeAtendimento",
  "localResidencia",
  "recebeVisitaSaude",
  "circulaCidadeAldeia",
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
  "religioes",
  "religioesOutro",
  "usoTradicionalExiste",
  "participouRitualTabaco",
  "contextosEnvolvemUso",
  "contextosEnvolvemUsoOutro",
  "quemInfluenciou",
  "quemInfluenciouOutro",
  "inicioEmContextoRitualTradicional",
  "houveEscolha",
  "idadePrimeiraParticipacaoRitual",
  "idadeInicioUsoRitual",
  "percepcaoComunidade",
  "percepcaoComunidadeOutro",
  "diferencaTradicionalComercial",
  "diferencaPrincipal",
  "produtoSubstanciaUtilizada",
  "produtoSubstanciaUtilizadaOutros",
  "produtoPrincipalOrigem",
  "produtoPrincipalOrigemOutro",
  "contextosUtiliza",
  "contextosUtilizaOutro",
  "finalidadeUso",
  "finalidadeUsoOutro",
  "formaPrincipalConsumo",
  "formaPrincipalConsumoOutra",
  "usoOcorreMaisFrequentemente",
  "usoMedicamentoCuraPessoal",
  "usoRodasConversaPessoal",
  "usoRitualBebidasAlcoolicas",
  "scoreUso",
  "classificacaoUso",
  "scoreFagerstrom",
  "classificacaoFagerstrom",
  "scoreCigarroEletronico",
  "classificacaoCigarroEletronico",
  "scoreCultural",
  "classificacaoCultural",
  "scoreAUDIT",
  "classificacaoAUDIT",
  "scoreTotal",
  "prioridadeFinal",
  "classificacaoGeral",
];

const CASE_HEADER_LABELS = {
  religioes: "C1.1 Religioes/espiritualidades (multipla)",
  religioesOutro: "C1.1 Outro (texto)",
  usoTradicionalExiste: "C2.1 Existe uso tradicional/ritual/espiritual/medicinal",
  participouRitualTabaco: "C2.2 Ja participou de ritual com tabaco",
  contextosEnvolvemUso: "C2.3 Contextos que envolvem uso (multipla)",
  contextosEnvolvemUsoOutro: "C2.3 Outro contexto (texto)",
  quemInfluenciou: "C3.1 Quem influenciou o inicio",
  quemInfluenciouOutro: "C3.1 Outro influenciador (texto)",
  inicioEmContextoRitualTradicional: "C3.2 Inicio em contexto ritual/tradicional",
  houveEscolha: "C3.3 Possibilidade real de escolha",
  idadePrimeiraParticipacaoRitual: "C3.4 Idade primeira participacao ritual",
  idadeInicioUsoRitual: "C3.5 Idade inicio uso ritual",
  percepcaoComunidade: "C4.1 Percepcao da comunidade",
  percepcaoComunidadeOutro: "C4.1 Outra percepcao (texto)",
  diferencaTradicionalComercial: "C4.2 Diferenca ritual/tradicional vs comercial",
  diferencaPrincipal: "C4.3 Diferenca principal (texto)",
  produtoSubstanciaUtilizada: "C5.1 Produto/substancia utilizada (multipla)",
  produtoSubstanciaUtilizadaOutros: "C5.1 Outros produtos (texto)",
  produtoPrincipalOrigem: "C5.2 Origem principal do produto",
  produtoPrincipalOrigemOutro: "C5.2 Outra origem (texto)",
  contextosUtiliza: "C6.1 Contextos em que utiliza (multipla)",
  contextosUtilizaOutro: "C6.1 Outro contexto (texto)",
  finalidadeUso: "C6.2 Finalidades do uso (multipla)",
  finalidadeUsoOutro: "C6.2 Outra finalidade (texto)",
  formaPrincipalConsumo: "C7.1 Forma principal de consumo",
  formaPrincipalConsumoOutra: "C7.1 Outra forma (texto)",
  usoOcorreMaisFrequentemente: "C7.2 Uso ocorre mais frequentemente",
  usoMedicamentoCuraPessoal: "C8.1 Uso pessoal em cura/tratamento",
  usoRodasConversaPessoal: "C8.2 Uso pessoal em rodas/reunioes",
  usoRitualBebidasAlcoolicas: "C8.3 Uso ritual de bebidas alcoolicas",
};

function doGet() {
  return jsonOutput_({
    sucesso: true,
    mensagem: "YBYTU V4 ativo",
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
      envioId,
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
  if (cases.length === 0) return;

  const metadataHeaders = [
    "envioId",
    "recebidoEm",
    "origem",
    "timestampEnvio",
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
  const remaining = (keys || [])
    .filter((key) => CASE_KEY_ORDER.indexOf(key) === -1)
    .sort();

  return CASE_KEY_ORDER.concat(remaining);
}

function headerForKey_(key) {
  return CASE_HEADER_LABELS[key] || key;
}

function headersEqual_(currentHeaders, targetHeaders) {
  if (!Array.isArray(currentHeaders)) return false;
  if (currentHeaders.length < targetHeaders.length) return false;

  for (let i = 0; i < targetHeaders.length; i += 1) {
    if ((currentHeaders[i] || "") !== targetHeaders[i]) {
      return false;
    }
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
