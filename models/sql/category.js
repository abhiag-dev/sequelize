const Sequelize = require("sequelize");
const sequelize = require("../../config/database");
const { Menu } = require("./menu.js");
const Category = sequelize.define(
  "Category",
  {
    id: {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true,
      autoIncrement: true,
    },
    category_name: {
      type: Sequelize.STRING,
      allowNull: false,
      primaryKey: true,
    },
    noOfItems: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    timestamps: false,
  }
);
Category.hasMany(Menu, { foreignKey: "category_name" });
module.exports = Category;
