const jwt = require("jsonwebtoken");
const logger = require("../utils/logger");
const Usuario = require("../models/Usuario");
require("dotenv").config();

function verificarToken(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: "Token não fornecido" });
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      logger.error("Erro ao verificar token:", {
        error: err,
        token: token,
      });
      return res.status(500).json({ error: "Erro ao verificar token" });
    }

    try {
      const usuario = await Usuario.findByPk(decoded.id);

      if (!usuario) {
        return res.status(404).json({ error: "Usuário não encontrado" });
      }

      req.usuario = usuario;
      next();
    } catch (error) {
      logger.error("Erro ao verificar token:", {
        error: error,
        token: token,
      });
      res.status(500).json({ error: "Erro ao verificar token" });
    }
  });
}

function verificarAdmin(req, res, next) {
  if (!req.usuario.is_admin) {
    logger.warn("Acesso restrito ao administrador:", {
      userId: req.usuario.id,
    });
    return res.status(403).json({ error: "Acesso restrito ao administrador" });
  }
  next();
}

module.exports = {
  verificarToken,
  verificarAdmin,
};
