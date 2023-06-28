const Exercicio = require("../models/Exercicio");
const logger = require("../utils/logger");

const {
  criarExercicioValidator,
  atualizarExercicioValidator,
} = require("../validators/exercicio-validator");

class ExercicioController {
  async listarExercicios(req, res) {
    try {
      let exercicios;
      if (req.usuario) {
        exercicios = await Exercicio.findAll({
          where: { usuario_id: req.usuario.id },
        });
      } else {
        exercicios = await Exercicio.findAll({ where: { usuario_id: null } });
      }
      logger.info("Exercícios listados", { usuarioId: req.usuario?.id });
      res.json(exercicios);
    } catch (error) {
      logger.error("Erro ao listar exercícios:", {
        error,
        usuarioId: req.usuario?.id,
      });
      res.status(500).json({ error: "Ocorreu um erro ao listar exercícios" });
    }
  }

  async listarDetalhesExercicio(req, res) {
    try {
      let exercicio;
      if (req.usuario) {
        exercicio = await Exercicio.findOne({
          where: { id: req.params.id, usuario_id: req.usuario.id },
        });
      } else {
        exercicio = await Exercicio.findOne({
          where: { id: req.params.id, usuario_id: null },
        });
      }

      if (!exercicio) {
        return res.status(404).json({ error: "Exercício não encontrado" });
      }

      logger.info("Exercício listado:", {
        exercicioId: exercicio.id,
        usuarioId: req.usuario?.id,
      });
      res.json(exercicio);
    } catch (error) {
      logger.error("Erro ao listar exercício:", {
        error,
        usuarioId: req.usuario?.id,
      });
      res.status(500).json({ error: "Ocorreu um erro ao listar exercício" });
    }
  }

  async criarExercicio(req, res) {
    const usuarioId = req.usuario.id;

    const { error, value } = criarExercicioValidator.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      const errors = error.details.map((err) => err.message);
      logger.error("Erro ao cadastrar exercício:", errors, {
        createdBy: usuarioId,
      });
      return res.status(400).json({ errors });
    }

    try {
      const exercicio = await Exercicio.create({
        ...value,
        usuario_id: usuarioId,
      });

      logger.info("Novo exercício cadastrado:", {
        criadoPor: usuarioId,
        exercicioId: exercicio.id,
      });

      res.status(201).json(exercicio);
    } catch (error) {
      logger.error("Erro ao criar exercício:", error, {
        createdBy: usuarioId,
      });
      res.status(500).json({ error: "Erro ao criar exercício" });
    }
  }

  async atualizarExercicio(req, res) {
    const { id } = req.params;
    const usuarioId = req.usuario.id;

    const { error, value } = atualizarExercicioValidator.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      const errors = error.details.map((err) => err.message);
      logger.error("Erro ao atualizar exercício:", errors, {
        createdBy: req.usuario?.id,
      });
      return res.status(400).json({ errors });
    }

    try {
      const exercicio = await Exercicio.findByPk(id);

      if (!exercicio) {
        return res.status(404).json({ error: "Exercício não encontrado" });
      }

      if (exercicio.usuario_id !== usuarioId) {
        return res.status(403).json({ error: "Acesso não autorizado" });
      }

      await exercicio.update(value);

      logger.info("Exercício atualizado:", {
        exercicioId: exercicio.id,
        usuarioId: usuarioId,
      });

      res.json(exercicio);
    } catch (error) {
      logger.error("Erro ao atualizar exercício:", {
        error,
        usuarioId: req.usuario.id,
      });
      res.status(500).json({ error: "Erro ao atualizar exercício" });
    }
  }

  async excluirExercicio(req, res) {
    try {
      const { id } = req.params;
      const usuarioId = req.usuario.id;

      const exercicio = await Exercicio.findByPk(id);

      if (!exercicio) {
        return res.status(404).json({ error: "Exercício não encontrado" });
      }

      if (exercicio.usuario_id !== usuarioId) {
        return res.status(403).json({ error: "Acesso não autorizado" });
      }

      await exercicio.destroy();

      logger.info("Exercício excluído:", {
        exercicioId: exercicio.id,
        usuarioId: usuarioId,
      });

      res.json({ message: "Exercício excluído com sucesso" });
    } catch (error) {
      logger.error("Erro ao excluir exercício:", {
        error,
        usuarioId: req.usuario.id,
      });
      res.status(500).json({ error: "Erro ao excluir exercício" });
    }
  }
}

module.exports = new ExercicioController();
