const express = require("express");
const router = express.Router();
const enviarEmail = require("../utils/enviar-email");
const emailValidator = require("../validators/email-validator");

router.post("/enviar-email", (req, res) => {
  const { error, value } = emailValidator.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    const errors = error.details.map((err) => err.message);
    return res.status(400).json({ errors });
  }

  const { nome, email, assunto, mensagem } = value;

  enviarEmail(nome, email, assunto, mensagem)
    .then(() => {
      res.status(200).json({ mensagem: "E-mail enviado com sucesso" });
    })
    .catch((error) => {
      console.error("Erro ao enviar e-mail:", error);
      res.status(500).json({ erro: "Ocorreu um erro ao enviar o e-mail" });
    });
});

module.exports = router;
