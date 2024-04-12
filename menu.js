const Sequelize = require("sequelize");

const sequelize = require("./database");

const Menu = sequelize.define(
  "Menu",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    price: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    description: {
      type: Sequelize.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: false,
  }
);
var menuItems;
const getMenuItems = async () => {
  try {
    menuItems = await Menu.findAll();
    console.log(menuItems);
    return menuItems;
  } catch (error) {
    console.error("Error fetching menu items:", error);
    throw error;
  }
};

module.exports = {
  Menu,
  getMenuItems,
};
