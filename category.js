const Sequelize = require("sequelize");
const sequelize = require("./database");

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



module.exports = Category;
