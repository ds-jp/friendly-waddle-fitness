const express = require("express");
const router = express.Router();

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

module.exports = router;
