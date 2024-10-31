const express = require("express");
const app = express();
const helmet = require("helmet");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");

const cookieRoutes = require("./routes/cookieRoutes.js");
const boardRoutes = require("./routes/boardRoutes.js");
const taskRoutes = require("./routes/taskRoutes.js");
const inviteRoutes = require("./routes/inviteRoutes.js");

app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(cookieParser());

const requestLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "To many requests, madman!",
});

app.use(requestLimit);

app.use("/cookie", cookieRoutes);
app.use("/board", boardRoutes);
app.use("/task", taskRoutes);
app.use("/invite", inviteRoutes);
module.exports = app;
