const Comment = require("../models/commentSchema");
const Product = require("../models/productSchema");

const asyncWrapper = require("../middleware/asyncWrapper");
const mongoose = require("mongoose");

const calcAverageRatings = async (productId) => {
  const stats = await Comment.aggregate([
    { $match: { productId: new mongoose.Types.ObjectId(productId) } },
    {
      $group: {
        _id: "$productId",
        numOfRatings: { $sum: 1 },
        avgRating: { $avg: "$rating" },
      },
    },
  ]);

  await Product.findByIdAndUpdate(productId, {
    ratingCount: stats.length > 0 ? stats[0].numOfRatings : 0,
    ratingAverage: stats.length > 0 ? stats[0].avgRating : 0,
  });
};

const addComment = asyncWrapper(async (req, res) => {
  const { productId, userId, text, star } = req.body;
  await Comment.create({ productId, userId, text, rating: star });
  await calcAverageRatings(productId);

  res.status(201).json({
    success: true,
    message: "Comment Added Successefully",
  });
});

const deleteComment = asyncWrapper(async (req, res) => {
  const { commentId } = req.params;
  const deletedCart = await Comment.findByIdAndDelete(commentId);
  await calcAverageRatings(deletedCart.productId);

  res.status(201).json({
    success: true,
    message: "Comment Added Successefully",
  });
});

const editComment = asyncWrapper(async (req, res) => {
  const { commentId, text, star } = req.body;
  const editComment = await Comment.findByIdAndUpdate(commentId, {
    text,
    rating: star,
    updated: true,
  });
  await calcAverageRatings(editComment.productId);

  res.status(201).json({
    success: true,
    message: "Comment Added Successefully",
  });
});

const viewComments = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const comments = await Comment.find({ productId: id }).populate(
    "userId",
    "name avatar",
  );
  res.status(201).json({
    success: true,
    comments,
  });
});

const viewAllComments = asyncWrapper(async (req, res) => {
  const comments = await Comment.find()
    .populate("userId", "name avatar")
    .populate("productId", "name")
    .limit(2);
  res.status(201).json({
    success: true,
    comments,
  });
});

module.exports = {
  addComment,
  deleteComment,
  editComment,
  viewComments,
  viewAllComments,
};
