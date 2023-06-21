const Sequelize = require("sequelize");
const sequelize = require("../database/database");
const Categoria = require("./Categoria");
const Usuario = require("./Usuario");

const DicaSaude = sequelize.define(
  "DicaSaude",
  {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    titulo: { type: Sequelize.STRING(100), allowNull: false },
    conteudo: { type: Sequelize.TEXT, allowNull: false },
  },
  {
    freezeTableName: true,
  }
);

DicaSaude.belongsTo(Categoria, {
  foreignKey: "categoria_id",
  onDelete: "SET NULL",
});

DicaSaude.belongsTo(Usuario, {
  foreignKey: "usuario_id",
  onDelete: "CASCADE",
});

module.exports = DicaSaude;
