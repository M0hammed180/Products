const category = require("../models/favouritesSchema");
const asyncWrapper = require("../middleware/asyncWrapper");

const addCategory = asyncWrapper(async (req, res) => {
  const { name, description, isActive } = req.body;

  const images = req.files?.map((file) => file.path) || [];

  const newCategory = await category.create({
    name,
    description,
    isActive,
    image: req.file ? req.file.path : "",
  });

  return res.status(200).json({
    success: true,
    message: "Category created successfully",
    newCategory,
  });
});
const removeCategory = asyncWrapper(async (req, res) => {});
const editCategory = asyncWrapper(async (req, res) => {});
const showCategorys = asyncWrapper(async (req, res) => {
  const categorys = await category.find();
  return res.status(200).json({
    success: true,
    categorys,
  });
});

module.exports = {
  addCategory,
  removeCategory,
  editCategory,
  showCategorys,
};
