const Joi = require("joi");

const criarUsuarioValidator = Joi.object({
  nome: Joi.string().required().messages({
    "any.required": "O campo 'nome' é obrigatório",
  }),
  email: Joi.string().email().required().messages({
    "any.required": "O campo 'email' é obrigatório",
    "string.email": "O campo 'email' deve ser um endereço de e-mail válido",
  }),
  senha: Joi.string().min(8).required().messages({
    "any.required": "O campo 'senha' é obrigatório",
    "string.min": "O campo 'senha' precisa ter no mínimo 8 caracteres",
  }),
});

const criarUsuarioAdminValidator = Joi.object({
  nome: Joi.string().required().messages({
    "any.required": "O campo 'nome' é obrigatório",
  }),
  email: Joi.string().email().required().messages({
    "any.required": "O campo 'email' é obrigatório",
    "string.email": "O campo 'email' deve ser um endereço de e-mail válido",
  }),
  senha: Joi.string().min(8).required().messages({
    "any.required": "O campo 'senha' é obrigatório",
    "string.min": "O campo 'senha' precisa ter no mínimo 8 caracteres",
  }),
  is_admin: Joi.boolean().valid(true).required().messages({
    "any.required": "O campo 'is_admin' é obrigatório",
    "any.only": "O campo 'is_admin' deve ser true",
  }),
});

const atualizarUsuarioValidator = Joi.object({
  nome: Joi.string().optional().messages({
    "string.empty": "O campo 'nome' não pode estar vazio",
  }),
  senha: Joi.string().min(8).messages({
    "string.min": "O campo 'senha' precisa ter no mínimo 8 caracteres",
  }),
});

module.exports = {
  criarUsuarioValidator,
  atualizarUsuarioValidator,
  criarUsuarioAdminValidator,
};
