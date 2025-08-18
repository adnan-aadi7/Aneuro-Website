import Category from "../model/category.js";
import EmailSequence from "../model/EmailSequence.js";
import Promptpack from "../model/Promptpack.js";
import FunnelTemplate from "../model/FunnelTemplate.js";
// Create a category
export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: "Category name is required" });
    }

    const category = new Category({ name });
    await category.save();

    res.status(201).json({ success: true, data: category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update a category
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.body.name) {
      return res.status(400).json({ success: false, message: "Category name is required" });
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { name: req.body.name },
      { new: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    res.json({ success: true, data: updatedCategory });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all categories
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const getUniqueEmailCategories = async (req, res) => {
  try {
    const categories = await EmailSequence.distinct("category"); // MongoDB distinct query
    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error("Error fetching unique categories:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching categories",
    });
  }
};

export const getUniquePromptCategories = async (req, res) => {
  try {
    const categories = await Promptpack.distinct("category"); 
    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error("Error fetching unique categories:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching categories",
    });
  }
};

export const getUniqueFunnelCategories = async (req, res) => {
  try {
    const categories = await FunnelTemplate.distinct("category");
    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error("Error fetching unique categories:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching categories",
    });
  }
};