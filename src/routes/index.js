const express = require("express");
const router = express.Router();
const enviarEmail = require("../public/js/enviar-email");
require("dotenv").config();

router.get("/", (req, res) => {
  const data = {
    title: "FriendlyWaddle Fitness",
  };
  res.render("index", data);
});

router.get("/saiba-mais", (req, res) => {
  const data = {
    title: "Saiba Mais - FriendlyWaddle Fitness",
  };
  res.render("saiba-mais", data);
});

router.get("/tecnologias", (req, res) => {
  const data = {
    title: "Tecnologias - FriendlyWaddle Fitness",
  };
  res.render("tecnologias", data);
});

router.get("/equipe", (req, res) => {
  const data = {
    title: "Equipe - FriendlyWaddle Fitness",
  };
  res.render("equipe", data);
});

router.get("/contato", (req, res) => {
  const data = {
    title: "Contato - FriendlyWaddle Fitness",
  };
  res.render("contato", data);
});

router.post("/enviar-email", (req, res) => {
  const { nome, email, assunto, mensagem } = req.body;

  enviarEmail(nome, email, assunto, mensagem)
    .then(() => {
      res.sendStatus(200);
    })
    .catch((error) => {
      console.error("Erro ao enviar e-mail:", error);
      res.sendStatus(500);
    });
});

module.exports = router;
