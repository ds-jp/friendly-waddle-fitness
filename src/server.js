const express = require("express");
const mustacheExpress = require("mustache-express");
const indexRouter = require("./routes/index");
const Usuario = require("./models/Usuario");
const Categoria = require("./models/Categoria");
const Exercicio = require("./models/Exercicio");
const DicaSaude = require("./models/DicaSaude");
const database = require("./database/database");

const app = express();

app.use(express.json());
app.engine("mustache", mustacheExpress());
app.set("view engine", "mustache");
app.set("views", __dirname + "/views");
app.use(express.static("./src/public"));
app.use("/", indexRouter);

(async () => {
  try {
    await database.sync();
    console.log("Tabelas criadas com sucesso.");
  } catch (error) {
    console.error("Erro ao criar as tabelas:", error);
  }

  const PORT = 3000;
  app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
  });
})();
