const express = require("express");
const mustacheExpress = require("mustache-express");
const router = require("./routes/routes");

const app = express();

app.engine("mustache", mustacheExpress());
app.set("view engine", "mustache");
app.set("views", __dirname + "/views");
app.use(express.static("./src/public"));
app.use("/", router);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor frontend rodando em http://localhost:${PORT}`);
});
