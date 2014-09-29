function processFbLogin(facebookCode) {
  var clientId = properties.facebookClientId;
  var redirectUri = getScriptUrl() + "?p=imgAdmin";
  var clientSecret = properties.facebookClientSecret;
  var url = "https://graph.facebook.com/oauth/access_token?client_id=" + clientId + "&redirect_uri=" + redirectUri + "&client_secret=" + clientSecret
      + "&code=" + facebookCode;
  var response = fetchUrlWithLogging(url, "facebookLogin", {});
  var responseText = response.getContentText();
  Logger.log("Facebook oauth response text: " + responseText);
  var accessToken = responseText.match(/access_token=(.*)&expires.*/)[1];
  Logger.log("Facebook access token: " + accessToken);
  // context.user.fbToken=accessToken;
  // saveUser(context.user);

  var userProperties = PropertiesService.getUserProperties();
  userProperties.setProperty("fbToken", accessToken);
}

function getFbImages() {
  try {
    var userProperties = PropertiesService.getUserProperties();
    var fbToken = userProperties.getProperty("fbToken");
    if (undefined != fbToken && fbToken != "") {
      var url = "https://graph.facebook.com/v2.1/me/photos/uploaded?access_token=" + fbToken;
      return getFbImagesByUrl(url);
    } else {
      return {};
    }
  } catch (err) {
    Logger.log("error: " + err);
    return {};
  }
}

function getNextPage() {
  var userProperties = PropertiesService.getUserProperties();
  var url = userProperties.getProperty("fbNextPageUrl");
  return getFbImagesByUrl(url);
}

function getFbImagesByUrl(url) {
  var userProperties = PropertiesService.getUserProperties();

  var response = fetchUrlWithLogging(url, "fetch images", {});
  var responseText = response.getContentText();
  var data = JSON.parse(responseText);

  var fbImages = [];
  for (i in data.data) {
    // Logger.log(data.data[i]);
    // Logger.log("source: " + data.data[i].source);
    var image = {
      "source" : data.data[i].source,
      "id" : data.data[i].id
    };
    userProperties.setProperty(data.data[i].id, data.data[i].source);// ulozime do properties mapovanie z ID na obrazky
    fbImages.push(image);
  }
  var nextPageUrl = data.paging.next;
  userProperties.setProperty("fbNextPageUrl", nextPageUrl);

  return fbImages;
}
