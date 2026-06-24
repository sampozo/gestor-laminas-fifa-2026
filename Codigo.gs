// Backend para el Gestor de Láminas FIFA 2026
// Sigue la guía de HTML-to-Mobile-Architect (v6.0)

/**
 * Maneja las peticiones GET desde la aplicación móvil.
 */
function doGet(e) {
  const params = e.parameter;
  const action = params.action;
  const codigo = params.codigo;
  
  let result = { success: false, error: "Acción no válida o parámetros faltantes" };
  
  if (action === "buscar" && codigo) {
    result = buscarLaminaGS(codigo);
  } else if (action === "agregar" && codigo) {
    result = agregarLaminaGS(codigo);
  }
  
  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Maneja las peticiones POST (redirige a doGet).
 */
function doPost(e) {
  return doGet(e);
}

/**
 * Obtiene la hoja de cálculo de forma segura.
 * Prioriza la hoja activa (bound script) y si falla, usa el ID seguro almacenado en Script Properties.
 */
function getSheet() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    if (ss) {
      const activeSheet = ss.getSheets()[0];
      if (activeSheet) return activeSheet;
    }
  } catch (err) {
    // Silenciar error y proceder al fallback por ID
  }
  
  // Usar fallback de ID almacenado de forma segura en las propiedades del script
  const sheetId = PropertiesService.getScriptProperties().getProperty("SPREADSHEET_ID");
  if (sheetId) {
    return SpreadsheetApp.openById(sheetId).getSheets()[0];
  }
  
  throw new Error("No se pudo conectar con la hoja de cálculo. Por favor vincula el script o configura la propiedad SPREADSHEET_ID.");
}

/**
 * Busca una lámina por su código.
 */
function buscarLaminaGS(codigo) {
  try {
    const sheet = getSheet();
    const data = sheet.getDataRange().getValues();
    const codigoNormalizado = normalizarCodigo(codigo);
    
    // Columnas: id, lamina_id, pais, pais_codigo, la_tengo
    for (let i = 1; i < data.length; i++) {
      const cellValue = data[i][1]; // lamina_id (e.g. "USA 1")
      if (normalizarCodigo(cellValue) === codigoNormalizado) {
        return {
          encontrada: true,
          id: data[i][0],
          lamina_id: data[i][1],
          pais: data[i][2],
          pais_codigo: data[i][3],
          la_tengo: parseInt(data[i][4])
        };
      }
    }
    
    return { encontrada: false };
  } catch (error) {
    return { encontrada: false, error: error.message };
  }
}

/**
 * Marca una lámina como obtenida ("la_tengo" = 1).
 */
function agregarLaminaGS(codigo) {
  try {
    const sheet = getSheet();
    const data = sheet.getDataRange().getValues();
    const codigoNormalizado = normalizarCodigo(codigo);
    
    for (let i = 1; i < data.length; i++) {
      const cellValue = data[i][1];
      if (normalizarCodigo(cellValue) === codigoNormalizado) {
        sheet.getRange(i + 1, 5).setValue(1); // Columna 5 (la_tengo)
        return { success: true, lamina_id: data[i][1], la_tengo: 1 };
      }
    }
    
    return { success: false, error: "Lámina no encontrada" };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Normaliza los códigos de las láminas eliminando espacios en blanco y pasando a mayúsculas.
 * Ej: "ARG 1" -> "ARG1", "arg01" -> "ARG01" (y limpia ceros a la izquierda para comparar)
 */
function normalizarCodigo(cod) {
  if (!cod) return "";
  // Quitar espacios y pasar a mayúsculas
  let clean = cod.toString().replace(/\s+/g, "").toUpperCase();
  // Manejar el caso de ceros intermedios opcionales (ej. "ARG01" vs "ARG1")
  clean = clean.replace(/([A-Z]+)0+(\d+)/, "$1$2");
  return clean;
}