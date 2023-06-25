const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Usuario = require("../models/Usuario");
const logger = require("../utils/logger");
require("dotenv").config();

const { criarUsuarioValidator } = require("../validators/usuario-validator");

class UsuarioController {
  async criarUsuario(req, res) {
    const { error, value } = criarUsuarioValidator.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      const errors = error.details.map((err) => err.message);
      logger.error(errors);
      return res.status(400).json({ errors });
    }

    const { nome, email, senha } = value;

    try {
      if (await Usuario.findOne({ where: { email } })) {
        return res.status(400).json({ error: "E-mail já está cadastrado" });
      }

      const isAdmin = (await Usuario.count()) === 0;
      const salt = await bcrypt.genSalt(10);
      const hashSenha = await bcrypt.hash(senha, salt);

      const usuario = await Usuario.create({
        nome: nome,
        email: email,
        senha: hashSenha,
        is_admin: isAdmin,
      });
      logger.info("Novo usuário cadastrado:", {
        id: usuario.id,
        nome,
        email,
        isAdmin,
      });

      const token = jwt.sign({ id: usuario.id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });

      res.status(201).json({ token });
    } catch (error) {
      logger.error("Erro ao cadastrar usuário:", error);
      res.status(500).json({ error: "Ocorreu um erro ao cadastrar usuário" });
    }
  }
}

module.exports = new UsuarioController();
