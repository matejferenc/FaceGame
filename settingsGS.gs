function saveSettings(form) {
  try {
    var user = getActiveUser();
    user.name = form.name;
    user.surname = form.surname;

    saveUser(user);
    return "user updated successfully";

  } catch (error) {

    /* If there's an error, show the error message */
    return error.toString();
  }
}