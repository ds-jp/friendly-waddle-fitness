const express = require("express");
const router = express.Router();
const enviarEmail = require("../utils/enviar-email");
const emailValidator = require("../validators/email-validator");
const logger = require("../utils/logger");
const UsuarioController = require("../controllers/Usuario-controller");

router.post("/usuarios/criar", UsuarioController.criarUsuario);

router.post("/enviar-email", (req, res) => {
  const { error, value } = emailValidator.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    const errors = error.details.map((err) => err.message);
    logger.error(errors);
    return res.status(400).json({ errors });
  }

  const { nome, email, assunto, mensagem } = value;

  enviarEmail(nome, email, assunto, mensagem)
    .then(() => {
      logger.info("E-mail enviado com sucesso:", {
        nome,
        email,
        assunto,
        mensagem,
      });
      res.status(200).json({ mensagem: "E-mail enviado com sucesso" });
    })
    .catch((error) => {
      logger.error("Erro ao enviar e-mail:", error);
      res.status(500).json({ erro: "Ocorreu um erro ao enviar o e-mail" });
    });
});

module.exports = router;
