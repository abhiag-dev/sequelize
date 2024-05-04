const express = require("express");
const router = express.Router();
const { registerUser, loginUser } = require("./user.controller");

router.post("/create-user", registerUser);

router.post("/login", loginUser);

module.exports = router;
