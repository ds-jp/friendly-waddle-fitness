const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Usuario = require("../models/Usuario");
const logger = require("../utils/logger");
require("dotenv").config();

const {
  criarUsuarioValidator,
  atualizarUsuarioValidator,
  criarUsuarioAdminValidator,
} = require("../validators/usuario-validator");

const tokenBlacklist = new Set();

class UsuarioController {
  async criarUsuario(req, res) {
    const { error, value } = criarUsuarioValidator.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      const errors = error.details.map((err) => err.message);
      logger.error("Erro ao cadastrar usuário:", errors);
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
        nome,
        email,
        senha: hashSenha,
        is_admin: isAdmin,
      });

      logger.info("Novo usuário cadastrado:", {
        id: usuario.id,
        nome,
        email,
        isAdmin,
      });

      res.status(201).json({ user: "Usuário criado com sucesso" });
    } catch (error) {
      logger.error("Erro ao cadastrar usuário:", {
        error,
      });
      res.status(500).json({ error: "Ocorreu um erro ao cadastrar usuário" });
    }
  }

  async criarUsuarioAdmin(req, res) {
    const { error, value } = criarUsuarioAdminValidator.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      const errors = error.details.map((err) => err.message);
      logger.error(errors, {
        createdBy: req.usuario.id,
      });
      return res.status(400).json({ errors });
    }

    const { nome, email, senha } = value;

    try {
      if (await Usuario.findOne({ where: { email } })) {
        return res.status(400).json({ error: "E-mail já está cadastrado" });
      }

      const salt = await bcrypt.genSalt(10);
      const hashSenha = await bcrypt.hash(senha, salt);

      const isAdmin = true;

      const usuario = await Usuario.create({
        nome,
        email,
        senha: hashSenha,
        is_admin: isAdmin,
      });

      logger.info("Novo administrador cadastrado:", {
        criadoPor: req.usuario.id,
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
      logger.error("Erro ao cadastrar administrador:", {
        userId: req.usuario.id,
        error,
      });
      res
        .status(500)
        .json({ error: "Ocorreu um erro ao cadastrar administrador" });
    }
  }

  async listarUsuarios(req, res) {
    try {
      const usuarios = await Usuario.findAll();
      logger.info("Usuários listados por:", {
        userId: req.usuario.id,
      });
      res.json(usuarios);
    } catch (error) {
      logger.error("Erro ao listar usuários:", {
        error,
        userId: req.usuario.id,
      });
      res.status(500).json({ error: "Ocorreu um erro ao listar usuários" });
    }
  }

  async listarDetalhesUsuario(req, res) {
    const { id } = req.params;

    try {
      const isAdmin = req.usuario.is_admin;
      const userId = req.usuario.id;

      if (!isAdmin && parseInt(id) !== userId) {
        logger.warn(
          "Acesso restrito ao usuário ou administrador (listarDetalhesUsuario):",
          {
            userId: req.usuario.id,
            usuarioListado: id,
          }
        );
        return res
          .status(403)
          .json({ error: "Acesso restrito ao usuário ou administrador" });
      }

      logger.info("Detalhes do usuário listados por:", {
        userId,
        usuarioListado: id,
      });

      const usuario = await Usuario.findByPk(id);
      if (!usuario) {
        return res.status(404).json({ error: "Usuário não encontrado" });
      }

      res.json(usuario);
    } catch (error) {
      logger.error("Erro ao listar usuário:", {
        error,
        userId: req.usuario.id,
        usuarioListado: id,
      });
      res.status(500).json({ error: "Ocorreu um erro ao listar o usuário" });
    }
  }

  async atualizarUsuario(req, res) {
    const { id } = req.params;
    const { error, value } = atualizarUsuarioValidator.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      const errors = error.details.map((err) => err.message);
      logger.error(errors, {
        createdBy: req.usuario.id,
      });
      return res.status(400).json({ errors });
    }

    const { nome, senha } = value;

    try {
      const usuario = await Usuario.findByPk(id);

      if (!usuario) {
        return res.status(404).json({ error: "Usuário não encontrado" });
      }

      const userId = req.usuario.id;
      const isAdmin = req.usuario.is_admin;

      if (userId !== usuario.id && !isAdmin) {
        logger.warn(
          "Acesso restrito ao usuário ou administrador (atualizarUsuario):",
          {
            userId: req.usuario.id,
            usuarioAtualizado: id,
          }
        );
        return res
          .status(403)
          .json({ error: "Acesso restrito ao usuário ou administrador" });
      }

      if (nome) {
        usuario.nome = nome;
      }

      if (senha) {
        const salt = await bcrypt.genSalt(10);
        const hashSenha = await bcrypt.hash(senha, salt);
        usuario.senha = hashSenha;
      }

      await usuario.save();

      logger.info("Usuário atualizado por:", {
        userId,
        usuarioAtualizado: id,
      });

      res.json(usuario);
    } catch (error) {
      logger.error("Erro ao atualizar usuário:", {
        error,
        userId: req.usuario.id,
        usuarioId: id,
      });
      res.status(500).json({ error: "Ocorreu um erro ao atualizar usuário" });
    }
  }

  async excluirUsuario(req, res) {
    const { id } = req.params;

    try {
      const isAdmin = req.usuario.is_admin;
      const userId = req.usuario.id;

      if (!isAdmin && parseInt(id) !== userId) {
        logger.warn(
          "Acesso restrito ao usuário ou administrador (excluirUsuario):",
          {
            userId: req.usuario.id,
            usuarioExcluido: id,
          }
        );
        return res
          .status(403)
          .json({ error: "Acesso restrito ao usuário ou administrador" });
      }

      const usuario = await Usuario.findByPk(id);

      if (!usuario) {
        return res.status(404).json({ error: "Usuário não encontrado" });
      }

      await usuario.destroy();

      logger.info("Usuário excluído por:", {
        userId,
        usuarioExcluido: id,
      });

      res.json({ message: "Usuário excluído com sucesso" });
    } catch (error) {
      logger.error("Erro ao excluir usuário:", {
        error,
        userId: req.usuario.id,
        usuarioId: id,
      });
      res.status(500).json({ error: "Ocorreu um erro ao excluir usuário" });
    }
  }

  async login(req, res) {
    const { email, senha } = req.body;

    try {
      const usuario = await Usuario.findOne({ where: { email } });

      if (!usuario) {
        logger.warn("Tentativa de login com e-mail inválido:", { email });
        return res.status(401).json({ error: "Credenciais inválidas" });
      }

      const senhaValida = await bcrypt.compare(senha, usuario.senha);

      const userId = usuario.id;

      if (!senhaValida) {
        logger.warn("Tentativa de login com senha inválida:", {
          userId,
          email,
        });
        return res.status(401).json({ error: "Credenciais inválidas" });
      }

      const token = jwt.sign({ id: usuario.id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });

      logger.info("Usuário logado:", { usuarioId: usuario.id });

      res.json({ token });
    } catch (error) {
      logger.error("Erro no login:", error);
      res.status(500).json({ error: "Erro no login" });
    }
  }

  async logout(req, res) {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (token && tokenBlacklist.has(token)) {
      logger.warn("Tentativa de logout com token inválido", { token });
      return res.status(401).json({ error: "Token inválido" });
    }

    if (token) {
      tokenBlacklist.add(token);
    }

    const userId = req.usuario.id;

    logger.info("Usuário fez logout", { userId });

    res.json({ message: "Logout realizado com sucesso" });
  }
}

module.exports = new UsuarioController();
