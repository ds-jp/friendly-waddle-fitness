const Joi = require("joi");

const criarCategoriaValidator = Joi.object({
  nome: Joi.string().required().messages({
    "any.required": "O campo 'nome' é obrigatório",
    "string.empty": `"nome" não pode estar vazio`,
  }),
});

module.exports = { criarCategoriaValidator };
