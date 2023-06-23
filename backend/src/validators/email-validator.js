const Joi = require("joi");

const emailValidator = Joi.object({
  nome: Joi.string().required().messages({
    "any.required": "O campo 'nome' é obrigatório",
  }),
  email: Joi.string().email().required().messages({
    "any.required": "O campo 'email' é obrigatório",
    "string.email": "O campo 'email' deve ser um endereço de e-mail válido",
  }),
  assunto: Joi.string().required().messages({
    "any.required": "O campo 'assunto' é obrigatório",
  }),
  mensagem: Joi.string().required().messages({
    "any.required": "O campo 'mensagem' é obrigatório",
  }),
});

module.exports = emailValidator;
