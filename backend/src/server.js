const express = require("express");
const router = require("./routes/routes");
const cors = require("cors");
const logger = require("./utils/logger");

const Usuario = require("./models/Usuario");
const Categoria = require("./models/Categoria");
const Exercicio = require("./models/Exercicio");
const database = require("./database/database");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", router);

(async () => {
  try {
    await database.sync();
    logger.info("Tabelas criadas com sucesso.");
  } catch (error) {
    logger.error("Erro ao criar as tabelas:", error);
  }

  const PORT = 4000;
  app.listen(PORT, () => {
    logger.info(`Servidor backend rodando em http://localhost:${PORT}`);
  });
})();
