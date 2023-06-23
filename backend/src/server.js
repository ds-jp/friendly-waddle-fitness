const express = require("express");
const router = require("./routes/routes");
const cors = require("cors");

const Usuario = require("./models/Usuario");
const Categoria = require("./models/Categoria");
const Exercicio = require("./models/Exercicio");
const DicaSaude = require("./models/DicaSaude");
const database = require("./database/database");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api", router);

(async () => {
  try {
    await database.sync();
    console.log("Tabelas criadas com sucesso.");
  } catch (error) {
    console.error("Erro ao criar as tabelas:", error);
  }

  const PORT = 4000;
  app.listen(PORT, () => {
    console.log(`Servidor backend rodando em http://localhost:${PORT}`);
  });
})();
