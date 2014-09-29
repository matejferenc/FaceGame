function doGet(e) {
  Logger.log("doGet object e: " + Utilities.jsonStringify(e));

  context.user = getOrRegisterUser();

  if (!e.parameter.p) {
    // When no specific page requested, return "home page"
    return HtmlService.createTemplateFromFile('index').evaluate();
  } else {
    // fb access code is passed into application through url param "code"
    if (!e.parameter.code) {
    } else {
      var facebookCode = e.parameter['code'];
      processFbLogin(facebookCode);
      // delete e.parameter.code;
    }
    // else, use page parameter to pick an html file from the script
    return HtmlService.createTemplateFromFile(e.parameter['p']).evaluate();
  }
}
