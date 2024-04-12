const Sequelize = require("sequelize");

const sequelize = require("./database");
const OrderItem = sequelize.define(
  "OrderItem",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    itemName: {
      // New field
      type: Sequelize.STRING, // Assuming the item name is a string
      allowNull: false,
    },

    menuItemId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    totalQty: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    totalPrice1: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = OrderItem;
