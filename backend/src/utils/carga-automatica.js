const Usuario = require("../models/Usuario");
const Categoria = require("../models/Categoria");
const Exercicio = require("../models/Exercicio");
const logger = require("./logger");

async function realizarCargaAutomatica(req, res) {
  try {
    if (req.usuario) {
      const usuario = await Usuario.findOne({
        where: { id: req.usuario.id },
      });

      const categorias = await Categoria.bulkCreate(
        [
          { nome: "Categoria 1", usuario_id: usuario.id },
          { nome: "Categoria 2", usuario_id: usuario.id },
          { nome: "Categoria 3", usuario_id: usuario.id },
          { nome: "Categoria 4", usuario_id: usuario.id },
          { nome: "Categoria 5", usuario_id: usuario.id },
        ],
        { ignoreDuplicates: true }
      );

      const exercicios = [
        {
          nome: "Exercício 1",
          descricao: "Descrição do exercício 1",
          dificuldade: "Fácil",
          usuario_id: usuario.id,
          categoria_id: categorias[0].id,
        },
        {
          nome: "Exercício 2",
          descricao: "Descrição do exercício 2",
          dificuldade: "Moderado",
          usuario_id: usuario.id,
          categoria_id: categorias[1].id,
        },
        {
          nome: "Exercício 3",
          descricao: "Descrição do exercício 3",
          dificuldade: "Difícil",
          usuario_id: usuario.id,
          categoria_id: categorias[2].id,
        },
        {
          nome: "Exercício 4",
          descricao: "Descrição do exercício 4",
          dificuldade: "Moderado",
          usuario_id: usuario.id,
          categoria_id: categorias[3].id,
        },
        {
          nome: "Exercício 5",
          descricao: "Descrição do exercício 5",
          dificuldade: "Difícil",
          usuario_id: usuario.id,
          categoria_id: categorias[4].id,
        },
      ];

      await Exercicio.bulkCreate(exercicios, { ignoreDuplicates: true });

      logger.info("Carga automática concluída com sucesso.", {
        usuarioId: usuario.id,
      });
      res.status(200).json({
        message: "Carga automática concluída com sucesso.",
      });
    } else {
      const categorias = await Categoria.bulkCreate(
        [
          { nome: "Categoria 1", usuario_id: null },
          { nome: "Categoria 2", usuario_id: null },
          { nome: "Categoria 3", usuario_id: null },
          { nome: "Categoria 4", usuario_id: null },
          { nome: "Categoria 5", usuario_id: null },
        ],
        { ignoreDuplicates: true }
      );

      await Exercicio.bulkCreate(
        [
          {
            nome: "Exercício 1",
            descricao: "Descrição do exercício 1",
            dificuldade: "Fácil",
            usuario_id: null,
            categoria_id: categorias[0].id,
          },
          {
            nome: "Exercício 2",
            descricao: "Descrição do exercício 2",
            dificuldade: "Moderado",
            usuario_id: null,
            categoria_id: categorias[1].id,
          },
          {
            nome: "Exercício 3",
            descricao: "Descrição do exercício 3",
            dificuldade: "Difícil",
            usuario_id: null,
            categoria_id: categorias[2].id,
          },
          {
            nome: "Exercício 4",
            descricao: "Descrição do exercício 4",
            dificuldade: "Moderado",
            usuario_id: null,
            categoria_id: categorias[3].id,
          },
          {
            nome: "Exercício 5",
            descricao: "Descrição do exercício 5",
            dificuldade: "Difícil",
            usuario_id: null,
            categoria_id: categorias[4].id,
          },
        ],
        { ignoreDuplicates: true }
      );

      logger.info("Carga automática concluída com sucesso.");
      res
        .status(200)
        .json({ message: "Carga automática concluída com sucesso." });
    }
  } catch (error) {
    logger.error("Erro ao realizar a carga automática:", error);
    res
      .status(500)
      .json({ message: "Ocorreu um erro ao realizar a carga automática." });
  }
}

module.exports = realizarCargaAutomatica;
