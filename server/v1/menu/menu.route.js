const express = require("express");
const router = express.Router();
const {
  createMenuItem,
  listMenuItems,
  updateMenuItem,
  deleteMenuItem,
  listMenuItemsByCategory,
} = require("./menu.controller");

router.post("/create-menu-item", createMenuItem);

router.get("/list-menu", listMenuItems);

router.post("/list-menuByCategory", listMenuItemsByCategory);
router.put("/update", updateMenuItem);

router.delete("/delete", deleteMenuItem);

module.exports = router;
