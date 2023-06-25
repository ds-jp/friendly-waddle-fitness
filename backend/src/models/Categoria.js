const Sequelize = require("sequelize");
const sequelize = require("../database/database");
const Usuario = require("./Usuario");

const Categoria = sequelize.define(
  "Categoria",
  {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    nome: { type: Sequelize.STRING(50), allowNull: false },
  },
  {
    freezeTableName: true,
    underscored: true,
  }
);

Categoria.belongsTo(Usuario, { foreignKey: "usuario_id", onDelete: "CASCADE" });

module.exports = Categoria;
