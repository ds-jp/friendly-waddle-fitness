const express = require("express");
const router = express.Router();
const enviarEmail = require("../utils/enviar-email");
const emailValidator = require("../validators/email-validator");
const logger = require("../utils/logger");
const UsuarioController = require("../controllers/Usuario-controller");
const CategoriaController = require("../controllers/Categoria-controller");
const {
  verificarToken,
  verificarAdmin,
} = require("../middlewares/auth-middleware");

router.post(
  "/categorias/criar",
  verificarToken,
  CategoriaController.criarCategoria
);
router.get("/categorias", verificarToken, CategoriaController.listarCategorias);
router.get(
  "/categorias/:id",
  verificarToken,
  CategoriaController.listarDetalhesCategoria
);
router.put(
  "/categorias/:id",
  verificarToken,
  CategoriaController.atualizarCategoria
);
router.delete(
  "/categorias/:id",
  verificarToken,
  CategoriaController.excluirCategoria
);

router.post("/usuarios/criar", UsuarioController.criarUsuario);
router.post(
  "/usuarios/admin",
  verificarToken,
  verificarAdmin,
  UsuarioController.criarUsuarioAdmin
);
router.get(
  "/usuarios",
  verificarToken,
  verificarAdmin,
  UsuarioController.listarUsuarios
);
router.get(
  "/usuarios/:id",
  verificarToken,
  UsuarioController.listarDetalhesUsuario
);
router.put("/usuarios/:id", verificarToken, UsuarioController.atualizarUsuario);
router.delete(
  "/usuarios/:id",
  verificarToken,
  UsuarioController.excluirUsuario
);
router.post("/usuarios/login", UsuarioController.login);
router.post("/usuarios/logout", verificarToken, UsuarioController.logout);

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
