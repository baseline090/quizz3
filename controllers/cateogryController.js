// categoryController.js

const Quiz = require('../models/Quiz');
const Category = require('../models/Category');
const mongoose = require('mongoose');

// Add a new category
exports.addCategory = async (req, res) => {
  try {
    const { name } = req.body;
    console.log('name: ', name);
    if (!name || name.trim().length === 0) {
      return res.status(400).json({ message: 'Category name is required' });
    }

    const existingCategory = await Category.findOne({ name });
    console.log('existingCategory: ', existingCategory);
    if (existingCategory) {
      return res.status(400).json({ message: 'Category already exists' });
    }

    const category = new Category({ name });
    await category.save();

    res.status(201).json({ message: 'Category added successfully', category });
  } catch (error) {
    console.error('Error adding category:', error);
    res.status(500).json({ message: 'Server error while adding category' });
  }
};

// Get all categories
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Server error while fetching categories' });
  }
};

// Delete a category
exports.deleteCategory = async (req, res) => {
  const { categoryId } = req.body;

  if (!categoryId) {
    return res.status(400).json({ message: 'Category ID is required' });
  }

  if (!mongoose.Types.ObjectId.isValid(categoryId)) {
    return res.status(400).json({ message: 'Invalid Category ID' });
  }

  try {
    const category = await Category.findByIdAndDelete(categoryId);

    if (!category) {
      return res.status(404).json({ message: `Category with ID ${categoryId} not found` });
    }

    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ message: 'Server error while deleting category' });
  }
};

// Get category by ID
exports.getCategoryById = async (req, res) => {
  const { categoryId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(categoryId)) {
    return res.status(400).json({ message: 'Invalid Category ID' });
  }

  try {
    const category = await Category.findById(categoryId);

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.status(200).json(category);
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({ message: 'Server error while fetching category' });
  }
};

// Get quizzes by category name
exports.getQuizzesByCategoryName = async (req, res) => {
  const { categoryName } = req.params;  

  
  try {
    const category = await Category.findOne({ name: categoryName });

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Fetch all quizzes in this category
    const quizzes = await Quiz.find({ category: category._id }).populate('category', 'name');

    if (quizzes.length > 0) {
      res.status(200).json(quizzes);
    } else {
      res.status(404).json({ message: 'No quizzes found for this category' });
    }
  } catch (error) {
    console.error('Error fetching quizzes for category:', error);
    res.status(500).json({ message: 'Error fetching quizzes for the category' });
  }
};



