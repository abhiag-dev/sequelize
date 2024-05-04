const Category = require("../../../models/sql/category.js");

async function createCategory(req, res) {
  try {
    const { id, category_name } = req.body;
    const newCategory = await Category.create({ id, category_name });
    res.json(newCategory);
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({ error: "Failed to create category" });
  }
}

async function listCategories(req, res) {
  try {
    const categories = await Category.findAll();
    res.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
}

module.exports = {
  createCategory,
  listCategories,
};
