require("dotenv").config({ path: [".env.development.local", ".env"] });
const { json } = require("express");
const app = require("./service.js");
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Domain server is live on port: ${PORT}`);
});
