// This middleware will check if user's cookie is still saved in browser and user is not set, then automatically log the user out.
// This usually happens when you stop your express server after login, your cookie still remains saved in the browser.
function cookiesCleaner(req, res, next) {
  // если есть кука и нет сессии - удаляем куку
  if (req.cookies.user_sid && !req.session.user) {
    res.clearCookie("user_sid");
  }
  next();
}

// middleware функция дял проверки наличия сессии
const sessionChecker = (req, res, next) => {
  if (req.session.user) {
    res.redirect("/");
  } 
  if (req.session.deliver) {
    res.redirect("/courier"); // проверить редирект????
  } 
  else {
    next();
  }
};

module.exports = {
  sessionChecker,
  cookiesCleaner,
};
