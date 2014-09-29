function uploadFiles(form) {
  var blob = form.img;
  saveFileToDrive(blob);
}

function saveFileToDrive(blob) {
  try {
    /* Name of the Drive folder where the files should be saved */
    var folder = getActiveUserFolder();

    Logger.log("imgUpload folder name: " + folder.getName());
    /* Get the file uploaded though the form as a blob */
    var file = folder.createFile(blob);

    Logger.log("uploaded image name: " + file.getName());

    /* Set the file description as the name of the uploader */
    // file.setDescription("Uploaded by " + form.myName);
    /* Return the download URL of the file once its on Google Drive */
    return "File uploaded successfully " + file.getUrl();

  } catch (error) {
    /* If there's an error, show the error message */
    return error.toString();
  }
}

function getDataFolder() {
  return DriveApp.getFolderById(properties.dataFolderId);
}

function getImages() {
  var imagesList = [];
  var folder = getActiveUserFolder();
  Logger.log("imgFolder: " + folder.getName());
  var files = folder.getFiles();
  while (files.hasNext()) {
    var file = files.next();
    var id = file.getId();
    imagesList.push(id)
  }
  Logger.log("images: " + imagesList);
  return imagesList;
}

function removeImage(imgId) {
  var img = DriveApp.getFileById(imgId);
  img.setTrashed(true);// FIXME MFe - nemaze subory?
  // FIXME MFe - mazanie nefunguje pre inych uzivatelov
}

function downloadFromFb(fbId) {
  var userProperties = PropertiesService.getUserProperties();
  var fbPhotoSourceUrl = userProperties.getProperty(fbId);
  // fbPhotoSourceUrl = "https://www." + fbPhotoSourceUrl.substring(8);
  Logger.log("fbPhotoSourceUrl: " + fbPhotoSourceUrl);
  Logger.log("fbId: " + fbId);
  var options = {
    "escaping" : false,
    "validateHttpsCertificates" : false,
  };
  var response = fetchUrlWithLogging(fbPhotoSourceUrl, "download photo from fb", {});
  var blob = response.getBlob();
  saveFileToDrive(blob);
}