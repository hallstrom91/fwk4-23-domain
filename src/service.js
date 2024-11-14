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
const logger = require("./utils/logger.js")

app.use(express.json());
app.use(cookieParser());

const corsOptions = {
  credentials: true,
  origin: [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:3002",
    "http://localhost:5173",
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(
  helmet.contentSecurityPolicy({
    useDefaults: true,
    directives: {
      defaultSrc: ["'self'"],
      connectSrc: [
        "'self'",
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:3002",
        "http://localhost:5173",
      ],
      frameSrc: ["'self'"],
      "img-src": ["'self'", "data:"],
    },
  }),
);

app.use(cors(corsOptions));

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
