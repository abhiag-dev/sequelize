const Sequelize = require("sequelize");

const sequelize = require("./database");

const Order = sequelize.define(
  "Order",
  {
    OrderId: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: Sequelize.INTEGER,
    totalPrice: Sequelize.DECIMAL,
    datetime: Sequelize.DATE,
    address: Sequelize.STRING,
    city: Sequelize.STRING,
    state: Sequelize.STRING,
    paymentMethod: Sequelize.STRING,
  },
  {
    timestamps: false,
  }
);

module.exports = Order;
