const Sequelize = require("sequelize");
const sequelize = require("./database");

const User = sequelize.define(
  "User",
  {
    username: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = User;
