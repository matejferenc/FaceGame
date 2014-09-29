function include(filename) {
  return HtmlService.createTemplateFromFile(filename).evaluate().getContent();
}

function getScriptUrl() {
  var url = ScriptApp.getService().getUrl();
  return url;
}

function toArray(iterable) {
  var array = [];
  while (iterable.hasNext()) {
    array.push(iterable.next())
  }
  return array;
}

function endsWith(string, suffix) {
  return string.indexOf(suffix, string.length - suffix.length) !== -1;
}

function replaceAt(string, replacement) {
  return string.replace(/@/g, replacement);
}

function shuffle(o) {
  for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x)
    ;
  return o;
};

function getDbSheet(spreadsheetId, sheetName) {
  var ss = SpreadsheetApp.openById(spreadsheetId);
  var sheet = ss.getSheetByName(sheetName);
  return sheet;
}

function objectToArray(dataObject) {
  var dataArray = [];
  for ( var o in dataObject) {
    dataArray.push(dataObject[o]);
  }
  return dataArray;
}

function byteCount(s) {
  var b = s.match(/[^\x00-\xff]/g);
  return (s.length + (!b ? 0 : b.length));
}

function getLogDbSheet() {
  return getDbSheet(properties.dbSpreadsheet, properties.logSheetName);
}

function fetchUrlWithLogging(url, id, options) {
  try {
    var response = UrlFetchApp.fetch(url, options);

    log("INFO", "UrlFetchApp - response headers", Utilities.jsonStringify(response.getAllHeaders()), id);
    log("INFO", "UrlFetchApp - response code", response.getResponseCode(), id);
    // log("INFO", "UrlFetchApp - response size", byteCount(response), id);//-nefunguje dobre s binarnymi datami
    return response;
  } catch (err) {
    log("ERROR", "UrlFetchApp - " + err, url, id);
    throw err;
  }
}

function log(level, key, value, id) {
  var sheet = getLogDbSheet();
  var date = new Date();
  var userEmail = getActiveUserEmail();
  sheet.appendRow([ date.toString(), userEmail, level, key, value, id ]);
}