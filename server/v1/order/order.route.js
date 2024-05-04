const express = require("express");
const router = express.Router();
const { createOrder, listOrders } = require("./order.controller");

router.post("/create-order", createOrder);

router.get("/list-order", listOrders);

module.exports = router;
