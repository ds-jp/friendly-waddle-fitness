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

router.get("/exercicios", (req, res) => {
  const data = {
    title: "Exercicios - FriendlyWaddle Fitness",
  };
  res.render("exercicios", data);
});

router.get("/categorias", (req, res) => {
  const data = {
    title: "Categorias - FriendlyWaddle Fitness",
  };
  res.render("categorias", data);
});

router.get("/categorias/inserir", (req, res) => {
  const data = {
    title: "Inserir Categoria - FriendlyWaddle Fitness",
  };
  res.render("inserirCategoria", data);
});

router.get("/categorias/alterar", (req, res) => {
  const data = {
    title: "Alterar Categoria - FriendlyWaddle Fitness",
  };
  res.render("alterarCategoria", data);
});

router.get("/exercicios/inserir", (req, res) => {
  const data = {
    title: "Inserir Exercício - FriendlyWaddle Fitness",
  };
  res.render("inserirExercicio", data);
});

router.get("/exercicios/alterar", (req, res) => {
  const data = {
    title: "Alterar Exercício - FriendlyWaddle Fitness",
  };
  res.render("alterarExercicio", data);
});

module.exports = router;
