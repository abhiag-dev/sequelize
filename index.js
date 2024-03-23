const express = require("express");
const { Sequelize, DataTypes } = require("sequelize");

const app = express();
const port = 3000;

const sequelize = new Sequelize("sequalize-video", "root", "$udhiR1ag", {
  host: "localhost",
  dialect: "mysql",
}); 

const User = sequelize.define("User", {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

sequelize.sync();

app.use(express.json());

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
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.send(`Welcome ${username}`);
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

app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
