const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const test = require("./routes/userRoutes.js");
const app = express();

app.use(express.json());
app.use(helmet());
app.use(cors());
test();

module.exports = app;
