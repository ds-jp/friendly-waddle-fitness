const Sequelize = require("sequelize");
const sequelize = require("../database/database");
const Categoria = require("./Categoria");
const Usuario = require("./Usuario");

const Exercicio = sequelize.define(
  "Exercicio",
  {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    nome: { type: Sequelize.STRING(50), allowNull: false },
    descricao: { type: Sequelize.STRING(255), allowNull: false },
    dificuldade: {
      type: Sequelize.ENUM("Fácil", "Moderado", "Difícil"),
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    underscored: true,
  }
);

Exercicio.belongsTo(Categoria, {
  foreignKey: "categoria_id",
  onDelete: "SET NULL",
});

Exercicio.belongsTo(Usuario, { foreignKey: "usuario_id", onDelete: "CASCADE" });

module.exports = Exercicio;
