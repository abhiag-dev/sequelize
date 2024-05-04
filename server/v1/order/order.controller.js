const Order = require("../../../models/sql/order.js");
const OrderItem = require("../../../models/sql/orderItems.js");
const { Menu } = require("../../../models/sql/menu.js");

async function createOrder(req, res) {
  try {
    const { userId, menuItems, address, city, state, paymentMethod } = req.body;

    let totalPrice = 0;

    const orderItemsData = [];

    for (const menuItem of menuItems) {
      const item = await Menu.findOne({ where: { name: menuItem.itemName } });
      if (!item) {
        return res
          .status(404)
          .json({ error: `Menu item "${menuItem.itemName}" not found` });
      }

      const itemTotalPrice = item.price * menuItem.quantity;
      totalPrice += itemTotalPrice;

      orderItemsData.push({
        menuItemId: item.id,
        totalQty: menuItem.quantity,
        totalPrice1: itemTotalPrice,
        itemName: menuItem.itemName,
        OrderId: null,
      });
    }

    const newOrder = await Order.create({
      userId,
      totalPrice,
      datetime: new Date(),
      address,
      city,
      state,
      paymentMethod,
    });

    orderItemsData.forEach((orderItemData) => {
      orderItemData.OrderId = newOrder.OrderId;
    });
    await OrderItem.bulkCreate(orderItemsData);

    res.json(newOrder);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Failed to create order" });
  }
}

async function listOrders(req, res) {
  try {
    const { userId } = req.body;
    console.log(typeof Menu.findOne);
    const orders = await Order.findAll({
      where: { userId },
      include: {
        model: OrderItem,
        as: "orderItems",
        attributes: ["itemName", "totalQty", "totalPrice1"],
      },
    });

    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
}

module.exports = {
  createOrder,
  listOrders,
};
