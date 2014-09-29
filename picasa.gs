// Define global variables needed to access Picasa Web Albums Data API
var NAME = 'lh2';
var SCOPE = 'http://picasaweb.google.com/data/';
var URL = "https://picasaweb.google.com/data/feed/api/user/default";

/*
 * - Fetch the Picasa albums of the current user - Find the public albums among them - Add their titles to a listbox - Put this listbox in a UI and show it in
 * the spreadsheet
 */
function getPicasaAlbums() {
  var data = UrlFetchApp.fetch(URL, googleOAuth_()).getContentText();
  var xmlOutput = Xml.parse(data, false);
  var albums = xmlOutput.getElement().getElements('entry');
  var info = [];
  var app = UiApp.createApplication().setTitle('Picasa');
  var panel = app.createVerticalPanel();
  var listBox = app.createListBox().setName('albumListBox').addItem('select');
  var handler = app.createServerHandler('showImagesEventHandler').addCallbackElement(listBox);
  listBox.addChangeHandler(handler);
  for (var i = 0; i < albums.length; i++) {
    if (albums[i].getElement('rights').getText() == "public") {
      var title = albums[i].getElement('title').getText();
      var id = albums[i].getElement('http://schemas.google.com/photos/2007', 'id').getText();
      info.push([ title, id ]);
      listBox.addItem(title);
    }
  }
  // use a script property to save the links to each album for later use
  ScriptProperties.setProperty('info', Utilities.jsonStringify(info));
  var scrollPanel = app.createScrollPanel().setWidth('500').setHeight('300');
  scrollPanel.setAlwaysShowScrollBars(true);
  scrollPanel.add(app.createVerticalPanel().setId('panelForImages'));
  app.add(panel.add(listBox).add(scrollPanel));
  // SpreadsheetApp.getActiveSpreadsheet().show(app);
  return app;
}

/*
 * - Clear the UI - Retrieve the album selected by the user from the listBox - Get the ID of this album from the 'info' script property - Get the photos of this
 * album from Picasa - Show those photos in the UI
 */
function showImagesEventHandler(e) {
  var app = UiApp.getActiveApplication();
  var panel = app.getElementById('panelForImages').clear();
  var info = Utilities.jsonParse(ScriptProperties.getProperty('info'));
  for (i in info) {
    if (info[i][0] == e.parameter.albumListBox) {
      var data = UrlFetchApp.fetch(URL + '/albumid/' + info[i][1], googleOAuth_()).getContentText();
      var xmlOutput = Xml.parse(data, false);
      var photos = xmlOutput.getElement().getElements('entry');
      for (j in photos) {
        panel.add(app.createImage(photos[j].getElement('content').getAttribute('src').getValue()));
      }
    }
  }
  return app;
}

/*
 * Authenticate the user when accessing data from Google Services through UrlFetch There are three URIs required to authenticate an application and obtain an
 * access token, one for each step of the OAuth process: - Obtain a request token - Authorize the request token - Upgrade to an access token
 */

function googleOAuth_() {
  var oAuthConfig = UrlFetchApp.addOAuthService(NAME);
  oAuthConfig.setRequestTokenUrl('https://www.google.com/accounts/OAuthGetRequestToken?scope=' + SCOPE);
  oAuthConfig.setAuthorizationUrl('https://www.google.com/accounts/OAuthAuthorizeToken');
  oAuthConfig.setAccessTokenUrl('https://www.google.com/accounts/OAuthGetAccessToken');
  oAuthConfig.setConsumerKey('anonymous');
  oAuthConfig.setConsumerSecret('anonymous');
  return {
    oAuthServiceName : NAME,
    oAuthUseToken : 'always'
  };
}