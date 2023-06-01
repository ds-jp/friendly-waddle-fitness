const express = require("express");
const router = express.Router();
require("dotenv").config();

router.get("/", (req, res) => {
  const data = {
    title: "FriendlyWaddle Fitness",
    name: "Teste",
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

router.get("/enviar-email", (req, res) => {
  const nome = req.query.nome;
  const email = req.query.email;
  const assunto = req.query.assunto;
  const mensagem = req.query.mensagem;
  const nodemailer = require("nodemailer");

  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: email,
    to: process.env.RECIPIENT_EMAIL,
    subject: assunto,
    text: `Nome: ${nome}\nE-mail: ${email}\n\nMensagem: ${mensagem}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Erro ao enviar e-mail:", error);
      res.status(500).send("Ocorreu um erro ao enviar o e-mail.");
    } else {
      console.log("E-mail enviado com sucesso:", info.response);
      res.send("Mensagem enviada com sucesso!");
    }
  });
});
module.exports = router;
