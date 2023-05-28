const express = require("express");
const mustacheExpress = require("mustache-express");
const indexRouter = require("./src/routes/index");

const app = express();

app.engine("mustache", mustacheExpress());
app.set("view engine", "mustache");
app.set("views", __dirname + "/src/views");
app.use(express.static("./src/public"));
app.use("/", indexRouter);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
