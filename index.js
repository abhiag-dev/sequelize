const express = require("express");
const { Op } = require("sequelize");
const sequelize = require("./database");
const { Menu } = require("./menu.js");
const User = require("./user");
const Category = require("./category");
const Order = require("./order");
const OrderItem = require("./orderItems");
const app = express();

app.use(express.json());
sequelize.sync({});
Category.hasMany(Menu, { foreignKey: "category_name" });
Order.hasMany(OrderItem, { foreignKey: "OrderId" });

// Customer Register
app.post("/api/create-user", async (req, res) => {
  try {
    const { username, password } = req.body;
    const newUser = await User.create({ username, password });
    res.json(newUser);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Failed to create user" });
  }
});

// Customer Login
app.post("/api/create-login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.json({ error: "User not found" });
    }
    if (user.password !== password) {
      return res.json({ error: "Invalid password" });
    }
    res.json({ message: "Login successful" });
  } catch (error) {
    console.error("Error authenticating user:", error);
    res.status(500).json({ error: "Failed to authenticate user" });
  }
});

// List Menu For All Categories
app.get("/api/list-menu", async (req, res) => {
  try {
    const menuItems = await Menu.findAll();
    res.json(menuItems);
  } catch (error) {
    console.error("Error fetching menu items:", error);
    res.status(500).json({ error: "Failed to fetch menu items" });
  }
});

// List Category
app.get("/api/list-category", async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

// Create Category
app.post("/api/create-category", async (req, res) => {
  try {
    const { id, category_name } = req.body;
    const newCategory = await Category.create({ id, category_name });
    res.json(newCategory);
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({ error: "Failed to create category" });
  }
});

// Create Menu Item
app.post("/api/create-menu-item", async (req, res) => {
  try {
    const { name, price, description, category_name } = req.body;
    const menuItem = await Menu.create({
      name,
      price,
      description,
      category_name,
    });
    res.json(menuItem);
  } catch (error) {
    console.error("Error creating menu item:", error);
    res.status(500).json({ error: "Failed to create menu item" });
  }
});

// List Menu Items of Specific Category
app.get("/api/list-menuByCategory", async (req, res) => {
  try {
    const { category_name } = req.body;
    let menuItems;
    if (category_name) {
      menuItems = await Menu.findAll({ where: { category_name } });
    } else {
      menuItems = await Menu.findAll();
    }
    res.json(menuItems);
  } catch (error) {
    console.error("Error fetching menu items:", error);
    res.status(500).json({ error: "Failed to fetch menu items" });
  }
});

// Edit Menu Item
app.put("/api/update-menuItem", async (req, res) => {
  try {
    const { id, name, price, description, category_name } = req.body;
    const menuItem = await Menu.findByPk(id);
    if (!menuItem) {
      return res.status(404).json({ error: "Menu item not found" });
    }
    await menuItem.update({
      name: name || menuItem.name,
      price: price || menuItem.price,
      description: description || menuItem.description,
      category_name: category_name || menuItem.category_name,
    });
    res.json({
      message: "Menu item updated successfully",
      updatedItem: menuItem,
    });
  } catch (error) {
    console.error("Error updating menu item:", error);
    res.status(500).json({ error: "Failed to update menu item" });
  }
});

// Delete Menu Item
app.delete("/api/delete-menuItem", async (req, res) => {
  try {
    const { id } = req.body;
    const menuItem = await Menu.findByPk(id);
    if (!menuItem) {
      return res.status(404).json({ error: "Menu item not found" });
    }
    await menuItem.destroy();
    res.json({ message: "Menu item deleted successfully" });
  } catch (error) {
    console.error("Error deleting menu item:", error);
    res.status(500).json({ error: "Failed to delete menu item" });
  }
});

// Create User Order
app.post("/api/create-order", async (req, res) => {
  try {
    const { userId, menuItems, address, city, state, paymentMethod } = req.body;
    let totalPrice = 0;
    for (const menuItem of menuItems) {
      const item = await Menu.findOne({ where: { name: menuItem.itemName } });
      if (!item) {
        return res
          .status(404)
          .json({ error: `Menu item "${menuItem.name}" not found` });
      }
    }

    const newOrder = await Order.create({
      userId,
      totalPrice: 0,
      datetime: new Date(),
      address,
      city,
      state,
      paymentMethod,
    });
    const menuItemPrice = menuItems.map(async (menuItem) => {
      let item = await Menu.findByPk(menuItem.id);
      totalPrice += item.price * menuItem.quantity;
      const orderItems = await OrderItem.create({
        OrderId: newOrder.OrderId,
        menuItemId: item.id,
        totalQty: menuItem.quantity,
        totalPrice1: item.price * menuItem.quantity,
        itemName: menuItem.itemName,
      });
    });
    await Promise.all(menuItemPrice);
    await newOrder.update({ totalPrice });
    res.json(newOrder);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Failed to create order" });
  }
});

// List Orders of User
app.get("/api/list-orders", async (req, res) => {
  try {
    const userId = req.body.userId;
    const orders = await Order.findAll({
      where: { userId },
      include: OrderItem,
    });
    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

app.put("/api/edit-order", async (req, res) => {
  try {
    const { orderId, userId, address, city, state, paymentMethod } = req.body;
    const order = await Order.findByPk(orderId);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    await order.update({
      userId,
      address,
      city,
      state,
      paymentMethod,
    });

    res.json({ message: "Order updated successfully", updatedOrder: order });
  } catch (error) {
    console.error("Error editing order:", error);
    res.status(500).json({ error: "Failed to edit order" });
  }
});

// List All Orders
app.get("/api/list-allOrders", async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [OrderItem],
    });
    const formattedOrders = orders.map((order) => ({
      orderId: order.OrderId,
      userId: order.userId,
      totalPrice: order.totalPrice,
      datetime: order.datetime,
      address: order.address,
      city: order.city,
      state: order.state,
      paymentMethod: order.paymentMethod,
      orderItems: order.OrderItems.map((item) => ({
        orderItemId: item.id,
        itemName: item.itemName,
        menuItemId: item.menuItemId,
        quantity: item.totalQty,
        totalPrice: item.totalPrice1,
      })),
    }));
    res.json(formattedOrders);
  } catch (error) {
    console.error("Error fetching all orders:", error);
    res.status(500).json({ error: "Failed to fetch all orders" });
  }
});

app.get("/api/list-menuCategory", async (req, res) => {
  try {
    const categories = await Category.findAll({ include: Menu });
    const output = categories.map((category) => ({
      category_name: category.category_name,
      count: category.noOfItems,
      menuItems: category.Menus.map((menuItem) => ({
        id: menuItem.id,
        name: menuItem.name,
        price: menuItem.price,
        description: menuItem.description,
      })),
    }));
    res.json(output);
  } catch (error) {
    console.error("Error fetching categories with menu items:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch categories with menu items" });
  }
});

app.listen(3000, () => {
  console.log(`Server is listening at http://localhost:3000`);
});
