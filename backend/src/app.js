const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const {usersController} = require("./components");
const {errorHandler} = require("./middleware");

const API_ROOT = "/api/v1";

const app = express();

// Enable security, CORS, compression, and body parsing
app.use(cors());
app.options("*", cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(morgan(":remote-addr - :remote-user [:date[clf]] \":method :url HTTP/:http-version\" :status :res[content-length] :response-time ms"));  // eslint-disable-line

// Setup controllers
app.use(`${API_ROOT}/users`, usersController);

// Error handling must be the last middleware
app.use(errorHandler());

module.exports = app;
