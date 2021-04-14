const express = require("express");
const useMiddleware = require("./middleware");
const indexRouter = require("./route/index");
const useErrorHandlers = require("./middleware/error-handlers");

const app = express();
useMiddleware(app);

// Подключаем импортированные маршруты с определенным url префиксом.
app.use("/", indexRouter);

useErrorHandlers(app);

module.exports = app;
