module.exports = function (app) {
  const express = require("express");
  const morgan = require("morgan");
  const cookieParser = require("cookie-parser");
  const session = require("express-session");
  const path = require("path");
  const FileStore = require("session-file-store")(session);
  const { cookiesCleaner } = require("./auth");
  const dbConnection = require("./db-connect");

  app.use(morgan("dev"));

  // Body POST запросов.
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
   // Подключаем views(hbs)
   app.set("views", path.join(__dirname, "..", "views"));
   app.set("view engine", "hbs");

  // initialize cookie-parser to allow us access the cookies stored in the browser.
  app.use(cookieParser());

  // initialize express-session to allow us track the logged-in user across sessions.
  app.use(
    session({
      store: new FileStore(), // тип хранилища FileStore, который создает нам папку с файлами
      key: "login", // ключ - название куки
      secret: "lemon", // слово, используемое для шифрования
      resave: false, //  настройка пересохранения куки, при каждом запросе
      saveUninitialized: false, // настройка создания сессии, даже без авторизации
      cookie: {
        expires: 6000000, // время жизни куки
        httpOnly: false, // по умолчанию true
      },
    })
  );

  // возможность очищать куки
  app.use(cookiesCleaner);

  // Подключаем статику
  app.use(express.static(path.join(__dirname, "..", "public")));

 
};
