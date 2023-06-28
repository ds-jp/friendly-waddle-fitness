const Categoria = require("../models/Categoria");
const logger = require("../utils/logger");

const {
  criarCategoriaValidator,
} = require("../validators/categoria-validator");

class CategoriaController {
  async listarCategorias(req, res) {
    try {
      let categorias;
      if (req.usuario) {
        categorias = await Categoria.findAll({
          where: { usuario_id: req.usuario.id },
        });
      } else {
        categorias = await Categoria.findAll({ where: { usuario_id: null } });
      }
      logger.info("Categorias listadas", { usuarioId: req.usuario?.id });
      res.json(categorias);
    } catch (error) {
      logger.error("Erro ao listar categorias:", {
        error,
        usuarioId: req.usuario?.id,
      });
      res.status(500).json({ error: "Ocorreu um erro ao listar categorias" });
    }
  }

  async listarDetalhesCategoria(req, res) {
    try {
      let categoria;
      if (req.usuario) {
        categoria = await Categoria.findOne({
          where: { id: req.params.id, usuario_id: req.usuario.id },
        });
      } else {
        categoria = await Categoria.findOne({
          where: { id: req.params.id, usuario_id: null },
        });
      }

      if (!categoria) {
        return res.status(404).json({ error: "Categoria não encontrada" });
      }

      logger.info("Categoria listada:", {
        categoriaId: categoria.id,
        usuarioId: req.usuario?.id,
      });
      res.json(categoria);
    } catch (error) {
      logger.error("Erro ao listar categoria:", {
        error,
        usuarioId: req.usuario?.id,
      });
      res.status(500).json({ error: "Ocorreu um erro ao listar categoria" });
    }
  }

  async criarCategoria(req, res) {
    const usuarioId = req.usuario.id;

    const { error, value } = criarCategoriaValidator.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      const errors = error.details.map((err) => err.message);
      logger.error("Erro ao cadastrar categoria:", errors, {
        createdBy: usuarioId,
      });
      return res.status(400).json({ errors });
    }

    const { nome } = value;

    try {
      const categoria = await Categoria.create({ nome, usuario_id: usuarioId });

      logger.info("Nova categoria cadastrada:", {
        criadoPor: usuarioId,
        nome,
      });

      res.status(201).json(categoria);
    } catch (error) {
      logger.error("Erro ao criar categoria:", error, {
        createdBy: usuarioId,
      });
      res.status(500).json({ error: "Erro ao criar categoria" });
    }
  }

  async atualizarCategoria(req, res) {
    const { id } = req.params;
    const usuarioId = req.usuario.id;

    const { error, value } = criarCategoriaValidator.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      const errors = error.details.map((err) => err.message);
      logger.error("Erro ao cadastrar categoria:", errors, {
        createdBy: req.usuario?.id,
      });
      return res.status(400).json({ errors });
    }

    const { nome } = value;

    try {
      const categoria = await Categoria.findByPk(id);

      if (!categoria) {
        return res.status(404).json({ error: "Categoria não encontrada" });
      }

      if (categoria.usuario_id !== usuarioId) {
        return res.status(403).json({ error: "Acesso não autorizado" });
      }

      categoria.nome = nome;
      await categoria.save();

      logger.info("Categoria atualizada:", {
        categoriaId: categoria.id,
        usuarioId: usuarioId,
      });

      res.json(categoria);
    } catch (error) {
      logger.error("Erro ao atualizar categoria:", {
        error,
        usuarioId: req.usuario.id,
      });
      res.status(500).json({ error: "Erro ao atualizar categoria" });
    }
  }

  async excluirCategoria(req, res) {
    try {
      const { id } = req.params;
      const usuarioId = req.usuario.id;

      const categoria = await Categoria.findByPk(id);

      if (!categoria) {
        return res.status(404).json({ error: "Categoria não encontrada" });
      }

      if (categoria.usuario_id !== usuarioId) {
        return res.status(403).json({ error: "Acesso não autorizado" });
      }

      await categoria.destroy();

      logger.info("Categoria excluída:", {
        categoriaId: categoria.id,
        usuarioId: usuarioId,
      });

      res.json({ message: "Categoria excluída com sucesso" });
    } catch (error) {
      logger.error("Erro ao excluir categoria:", {
        error,
        usuarioId: req.usuario.id,
      });
      res.status(500).json({ error: "Erro ao excluir categoria" });
    }
  }
}

module.exports = new CategoriaController();
