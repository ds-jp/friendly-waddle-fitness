const express = require("express");
const router = express.Router();

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

module.exports = router;
