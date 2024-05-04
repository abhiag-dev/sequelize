const { Menu } = require("../../../models/sql/menu.js");

async function createMenuItem(req, res) {
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
}

async function listMenuItems(req, res) {
  try {
    const menuItems = await Menu.findAll();
    res.json(menuItems);
  } catch (error) {
    console.error("Error fetching menu items:", error);
    res.status(500).json({ error: "Failed to fetch menu items" });
  }
}

async function updateMenuItem(req, res) {
  try {
    const { id } = req.body;
    const menuItem = await Menu.findByPk(id);

    if (!menuItem) {
      return res.status(404).json({ error: "Menu item not found" });
    }

    const updateData = {};
    if (req.body.name) updateData.name = req.body.name;
    if (req.body.price) updateData.price = req.body.price;
    if (req.body.description) updateData.description = req.body.description;
    if (req.body.category_name)
      updateData.category_name = req.body.category_name;

    await menuItem.update(updateData);

    res.json({
      message: "Menu item updated successfully",
      updatedItem: menuItem,
    });
  } catch (error) {
    console.error("Error updating menu item:", error);
    res.status(500).json({ error: "Failed to update menu item" });
  }
}

async function deleteMenuItem(req, res) {
    try {
      const { id, name } = req.body;
  
      if (id) {
        const menuItem = await Menu.findByPk(id);
        if (!menuItem) {
          return res.status(404).json({ error: "Menu item not found" });
        }
        await menuItem.destroy();
        return res.json({ message: "Menu item deleted successfully" });
      } else if (name) {
        const menuItem = await Menu.findOne({ where: { name } });
        if (!menuItem) {
          return res.status(404).json({ error: "Menu item not found" });
        }
        await menuItem.destroy();
        return res.json({ message: "Menu item deleted successfully" });
      } else {
        return res.status(400).json({ error: "Missing required field: id or name" });
      }
    } catch (error) {
      console.error("Error deleting menu item:", error);
      res.status(500).json({ error: "Failed to delete menu item" });
    }
  }
  
async function listMenuItemsByCategory(req, res) {
  try {
    const { category_name } = req.body;
    const menuItems = await Menu.findAll({
      where: { category_name },
    });

    res.json(menuItems);
  } catch (error) {
    console.error("Error fetching menu items by category:", error);
    res.status(500).json({ error: "Failed to fetch menu items by category" });
  }
}

module.exports = {
  createMenuItem,
  listMenuItems,
  updateMenuItem,
  deleteMenuItem,
  listMenuItemsByCategory,
};
