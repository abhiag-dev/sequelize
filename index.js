const express = require("express");
const sequelize = require("./database");
const Menu = require("./menu.js");
const User = require("./user");
const Category = require("./category");
const app = express();

app.use(express.json());
sequelize.sync({});
Category.hasMany(Menu, { foreignKey: "category_name" });
// Category.bulkCreate([
//   { id: "1", category_name: "veg" },
//   { id: "2", category_name: "non-veg" },
// ]);
Menu.addHook("afterCreate", async (menu) => {
  try {
    const category = await Category.findOne({
      where: { category_name: menu.category_name },
    });
    if (category) {
      await category.increment("noofitems", { by: 1 });
    }
  } catch (error) {
    console.error("Category doesn't exist", error);
  }
});
app.post("/api/add-menu-item", async (req, res) => {
  try {
    const { id, name, price, description, category_name } = req.body;

    const newMenuItem = await Menu.create({
      id,
      name,
      price,
      description,
      category_name,
    });

    res.json({ message: "adding successful" });
  } catch (error) {
    console.error("Error adding menu item:", error);
    res.status(500).json({ error: "Failed to add menu item" });
  }
});

app.post("/api/user", async (req, res) => {
  try {
    const { username, password } = req.body;
    const newUser = await User.create({ username, password });
    res.json(newUser);
  } catch (error) {
    console.error("Error creating user:", error);
  }
});

app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ where: { username } });
  if (!user) {
    return res.json({ error: "User not found" });
  }
  if (user.password !== password) {
    return res.json({ error: "Invalid password" });
  }
  res.json({ message: "Login successful" });
});

app.get("/api/login/:username", async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ where: { username } });
    res.send(`Welcome ${username}`);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

app.get("/api/user", async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

app.listen(3000, () => {
  console.log(`Server is listening at http://localhost:3000`);
});
