const Sequelize = require("sequelize");
const sequelize = require("../database/database");

const Categoria = sequelize.define(
  "Categoria",
  {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    nome: { type: Sequelize.STRING(50), allowNull: false },
  },
  {
    freezeTableName: true,
  }
);

module.exports = Categoria;
