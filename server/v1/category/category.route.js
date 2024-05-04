const express = require("express");
const router = express.Router();
const { createCategory, listCategories } = require("./category.controller");

router.post("/create-category", createCategory);

router.get("/list-category", listCategories);

module.exports = router;
