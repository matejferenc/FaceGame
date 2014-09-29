/*
function addImageShowStats(imageFileId) {
  var email = getActiveUserEmail();
  var update = { $inc: { shows: 1} };
  updateMongoDocument(email, imageFileId, Json.stringify(update));
}
 */

function addGuessedRightStats(imageFileId) {
  var email = getActiveUserEmail();
  var update = {
    $inc : {
      right : 1
    }
  };
  updateMongoDocument(email, imageFileId, update);
}

function addGuessedWrongStats(imageFileId) {
  var email = getActiveUserEmail();
  var update = {
    $inc : {
      wrong : 1
    }
  };
  updateMongoDocument(email, imageFileId, update);
}

function updateMongoDocument(user, imageId, payload) {
  var findQuery = {
    user : user,
    image : imageId
  };
  var q = JSON.stringify(findQuery);
  var p = JSON.stringify(payload);
  var url = properties.mongoStatsUrl + "?apiKey=" + properties.mongoLabApiKey + "&q=" + encodeURIComponent(q) + "&u=true";
  var options = {
    "method" : "put",
    "payload" : p,
    "contentType" : "application/json",
  };

  // Logger.log("mongo url: " + url);
  // Logger.log("payload: " + p);
  var response = fetchUrlWithLogging(url, "Mongo q: " + q + " p: " + p, options);
  var responseText = response.getContentText();
  // Logger.log("mongo response: " + responseText);
  log("DEBUG", "Mongo response", responseText, "updateMongoDocument");
}

/*
 * Vrati statistiky hadania prihlaseneho uzivatela
 */
function getMyStats() {
  var user = getActiveUserEmail();
  var findQuery = {
    user : user
  };
  var q = JSON.stringify(findQuery);
  var fields = JSON.stringify({
    right : 1,
    wrong : 1,
    _id : 0
  });
  var url = properties.mongoStatsUrl + "?apiKey=" + properties.mongoLabApiKey + "&q=" + encodeURIComponent(q) + "&f=" + encodeURIComponent(fields)
      + "&l=100000";
  var response = fetchUrlWithLogging(url, "Mongo q: " + q, {});
  var responseText = response.getContentText();
  // vrati pole dokumentov obsahujucich right a wrong hodnoty
  var data = JSON.parse(responseText);
  return aggregateSumRightWrong(data);
}

function aggregateSumRightWrong(data) {
  var totalRight = 0;
  var totalWrong = 0;
  for (var i = 0; i < data.length; i++) {
    if (undefined != data[i].right) {
      totalRight += data[i].right;
    }
    if (undefined != data[i].wrong) {
      totalWrong += data[i].wrong;
    }
  }
  return {
    right : totalRight,
    wrong : totalWrong
  };
}

/*
 * Vrati statistiky hadania fotiek tohto uzivatela od ostatnych uzivatelov
 */
function getStatsForMyImages() {

}

/*
 * Vrati statistiky hadania vsetkych uzivatelov pre vsetky fotky
 */
function getAllStats() {
  var fields = JSON.stringify({
    user : 1,
    right : 1,
    wrong : 1,
    _id : 0
  });
  var url = properties.mongoStatsUrl + "?apiKey=" + properties.mongoLabApiKey + "&f=" + encodeURIComponent(fields) + "&l=100000";
  var response = fetchUrlWithLogging(url, "Mongo q: " + q, {});
  var responseText = response.getContentText();
  // vrati pole dokumentov obsahujucich mena uzivatelov, right a wrong hodnoty
  var data = JSON.parse(responseText);
  return aggregateSumRightWrong(data);
}