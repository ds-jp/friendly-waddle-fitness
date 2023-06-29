const Joi = require("joi");

const criarExercicioValidator = Joi.object({
  nome: Joi.string().required().messages({
    "any.required": "O campo 'nome' é obrigatório.",
    "string.empty": "O campo 'nome' não pode estar vazio.",
  }),
  descricao: Joi.string().required().messages({
    "any.required": "O campo 'descricao' é obrigatório.",
    "string.empty": "O campo 'descricao' não pode estar vazio.",
  }),
  dificuldade: Joi.string()
    .valid("Fácil", "Moderado", "Difícil")
    .required()
    .messages({
      "any.required": "O campo 'dificuldade' é obrigatório.",
      "any.only":
        "O campo 'dificuldade' deve ser 'Fácil', 'Moderado' ou 'Difícil'.",
    }),
  categoria_id: Joi.number().integer().positive().messages({
    "number.positive": "O campo 'categoria_id' deve ser um número positivo.",
    "number.integer": "O campo 'categoria_id' deve ser um número inteiro.",
  }),
});

const atualizarExercicioValidator = Joi.object({
  nome: Joi.string().messages({
    "string.empty": "O campo 'nome' não pode estar vazio.",
  }),
  descricao: Joi.string().messages({
    "string.empty": "O campo 'descricao' não pode estar vazio.",
  }),
  dificuldade: Joi.string().valid("Fácil", "Moderado", "Difícil").messages({
    "any.only":
      "O campo 'dificuldade' deve ser 'Fácil', 'Moderado' ou 'Difícil'.",
  }),
  categoria_id: Joi.number().integer().positive().messages({
    "number.positive": "O campo 'categoria_id' deve ser um número positivo.",
    "number.integer": "O campo 'categoria_id' deve ser um número inteiro.",
  }),
});

module.exports = { criarExercicioValidator, atualizarExercicioValidator };
