function getOrRegisterUser() {
  var user = getActiveUser();
  Logger.log("user: " + user);
  if (user != null) {
    return user;
  } else {
    return registerNewUsesr();
  }
}

function registerNewUser() {
  var userFolder = createUserFolder(getActiveUserEmail());
  var user = toUser([ getActiveUserEmail(), userFolder.getId(), "", "" ]);
  saveUser(user);
  return user;
}

function saveUser(user) {
  var sheet = getUserDbSheet();
  var userRow = getUserRow(user.email);
  if (userRow == null) {
    // save new user
    // sheet must be public and writable if running script as "user accessing the web app"
    Logger.log("data: " + objectToArray(user));
    sheet.appendRow(objectToArray(user));
  } else {
    var range = sheet.getRange(userRow, 1, 1, sheet.getLastColumn());
    Logger.log("data: " + objectToArray(user));
    range.setValues([ objectToArray(user) ]);// parenthesis, because setValues takes two dimensional array
  }
}

function getActiveUserEmail() {
  return Session.getActiveUser().getEmail();
}

function getActiveUser() {
  return getUser(Session.getActiveUser().getEmail());
}

function createUserFolder(name) {
  var dataFolder = getDataFolder();
  var userFolder = dataFolder.createFolder(name);
  return userFolder;
}

function getActiveUserFolder() {
  var user = getActiveUser();
  if (user == null) {
    throw new Error("user not found");
  }
  return DriveApp.getFolderById(user.folderId);
}

function getUser(userEmail) {
  Logger.log("active user: " + userEmail);

  if (userEmail == "") {
    throw new Error("email not accessible");
  }

  var sheet = getUserDbSheet();

  var range = sheet.getRange(2, 1, sheet.getLastRow(), sheet.getLastColumn());
  var values = range.getValues();
  var height = range.getHeight();

  for (var i = 0; i < height; i++) {
    var email = values[i][0];
    if (userEmail == email) {
      return toUser(getRow(values, i));
    }
  }
  return null;
}

// FIXME MFe metoda skoro identicka k getUser()
function getUserRow(userEmail) {
  var sheet = getUserDbSheet();

  var range = sheet.getRange(2, 1, sheet.getLastRow(), sheet.getLastColumn());
  var values = range.getValues();
  var height = range.getHeight();

  for (var i = 0; i < height; i++) {
    var email = values[i][0];
    if (userEmail == email) {
      return i + 2;// sheets indexuju od 1 a prvy riadok je frozen - hlavicky
    }
  }
  return null;

}

function getUserDbSheet() {
  return getDbSheet(properties.dbSpreadsheet, properties.usersSheetName);
}

function getRow(matrix, row) {
  var rowData = [];
  for (var i = 0; i < matrix[row].length; i++) {
    rowData.push(matrix[row][i]);
  }
  return rowData;
}

function toUser(row) {
  var user = {
    email : row[0],
    folderId : row[1],
    name : row[2],
    surname : row[3],
    imageIds : [],
  };
  return user;
}

function getRandomUser() {
  var sheet = getUserDbSheet();

  var range = sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn());
  var values = range.getValues();
  var height = range.getHeight();

  var randomNumber = Math.random();
  var randomRow = Math.floor(height * randomNumber);

  return toUser(getRow(values, randomRow));
}