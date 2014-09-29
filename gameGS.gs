function startGameRound() {
  var randomUser = getUserWithPicture(getActiveUserEmail());
  Logger.log("randomUser: " + randomUser);
  
  var userProperties = PropertiesService.getUserProperties();
  userProperties.setProperty("gameCorrectAnswer", randomUser.folderId)
  
  var otherUsers = getPossibleUsers(properties.gameUsersCount, randomUser);
  Logger.log("otherUsers: " + otherUsers);
  
  context.game.possibilities = shuffle(otherUsers);
  Logger.log("possibilities: " + context.game.possibilities)
  context.game.imageId = getRandomImageId(randomUser);
  userProperties.setProperty("gameImageId", context.game.imageId);
  return context;
}

function getRandomImageId(user) {
  var imageIds = user.imageIds;
  var count = imageIds.length;
  var randomNumber = Math.random();
  var randomIndex = Math.floor(count * randomNumber);
  return imageIds[randomIndex]
}

function getPossibleUsers(count, correctUser) {
  var users = [correctUser];
  while (users.length < count) {
    var user = getRandomUser();
    if (contains(users, user)) {
      continue;
    } else {
      users.push(user)
    }
  }
  return users;
}

function contains(userArray, user) {
  for (var i = 0; i < userArray.length; i++) {
    if (userArray[i].email == user.email) {
      return true;
    }
  }
  return false;
}

function getUserWithPicture(except) {
  for (var i=0; i<100; i++) {
    var user = getRandomUser();
    if (user.email == except) {
      continue;
    }
    var folderId = user.folderId;
    var folder = DriveApp.getFolderById(folderId);
    var files = toArray(folder.getFiles());
    var images = filterImages(files);
    if (images.length > 0) {
      user.imageIds = getFileIds(images);
      return user;
    }
  }
  throw new Error("could not find user with picture");
}

function getFileIds(files) {
  var ids = [];
  for (var i=0; i<files.length; i++) {
    var file = files[i];
    ids.push(file.getId());
  }
  return ids;
}

function filterImages(files) {
  var images = []
  for (var i=0; i<files.length; i++) {
    var file = files[i];
    var fileName = file.getName();
    if (isImageType(fileName)) {
      images.push(file)
    }
  }
  return images;
}
        
function isImageType(fileName) {
  return endsWith(fileName, "jpg") || endsWith(fileName, "JPG") || endsWith(fileName, "png") || endsWith(fileName, "PNG");
}
        
function takeGuess(form) {
  var userProperties = PropertiesService.getUserProperties();
  var correctAnswer = userProperties.getProperty("gameCorrectAnswer");
  var correctImageId = userProperties.getProperty("gameImageId");
  
  
  if (correctAnswer == form.guess) {
    addGuessedRightStats(correctImageId);
    return "OK";
  } else {
    addGuessedWrongStats(correctImageId);
    return "WRONG";
  }
}