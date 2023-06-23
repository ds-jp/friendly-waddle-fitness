const Sequelize = require("sequelize");
const sequelize = new Sequelize({
  dialect: process.env.DB_DIALECT,
  storage: process.env.DB_STORAGE,
  logging: (message) => {
    if (message.includes("ERROR")) {
      console.error(message);
    }
  },
});

module.exports = sequelize;
