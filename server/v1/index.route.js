const express = require("express");
const userRoutes = require("./user/user.route");
const menuRoutes = require("./menu/menu.route");
const categoryRoutes = require("./category/category.route");
const orderRoutes = require("./order/order.route");

const router = express.Router();

router.get("/", (req, res) => {
  console.log("Root route (/) has been accessed");
  res.send("OK");
});

router.use("/user", userRoutes);
router.use("/menu", menuRoutes);
router.use("/category", categoryRoutes);
router.use("/order", orderRoutes);

module.exports = router;
