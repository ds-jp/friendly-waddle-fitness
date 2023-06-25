const Sequelize = require("sequelize");
const database = require("../database/database");

const Usuario = database.define(
  "Usuario",
  {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    nome: { type: Sequelize.STRING(50), allowNull: false },
    email: { type: Sequelize.STRING(50), allowNull: false, unique: true },
    senha: { type: Sequelize.STRING(255), allowNull: false },
    is_admin: { type: Sequelize.BOOLEAN, defaultValue: false },
  },
  {
    freezeTableName: true,
    underscored: true,
  }
);

module.exports = Usuario;
