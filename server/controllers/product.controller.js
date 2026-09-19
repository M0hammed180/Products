const product = require("../models/productSchema");
const ProductEvent = require("../models/eventSchema");
const Review = require("../models/commentSchema");
const asyncWrapper = require("../middleware/asyncWrapper");
const { default: mongoose } = require("mongoose");
const Cart = require("../models/cartSchema");

const addProduct = asyncWrapper(async (req, res) => {
  const {
    name,
    description,
    price,
    discountPrice,
    category,
    stock,
    isActive,
    size,
  } = req.body;

  const images = req.files?.map((file) => file.path) || [];

  const newProduct = await product.create({
    name,
    description,
    price,
    discountPrice,
    category,
    stock,
    isActive,
    images,
    size,
  });

  return res.status(200).json({
    success: true,
    message: "Product created successfully",
    newProduct,
  });
});

const removeProduct = asyncWrapper(async (req, res) => {
  const removedProduct = await product.findByIdAndDelete(req.params.id);

  if (!removedProduct) {
    return res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }

  return res.status(200).json({
    success: true,
    message: "Product deleted successfully",
  });
});

const editProduct = asyncWrapper(async (req, res) => {
  const {
    name,
    description,
    price,
    discountPrice,
    category,
    stock,
    size,
    isActive,
    id,
  } = req.body;
  const _id = new mongoose.Types.ObjectId(id);
  const update = {
    name,
    description,
    price,
    discountPrice,
    category,
    stock,
    isActive,
    size,
  };
  if (req.files?.length) {
    const existingImages = req.body.existingImages
      ? Array.isArray(req.body.existingImages)
        ? req.body.existingImages
        : [req.body.existingImages]
      : [];
    update.images = [...existingImages, ...req.files.map((file) => file.path)];
  } else if (req.body.existingImages) {
    update.images = Array.isArray(req.body.existingImages)
      ? req.body.existingImages
      : [req.body.existingImages];
  }
  if (typeof update.size === "string") {
    update.size = JSON.parse(update.size);
  }
  const newProduct = await product.findByIdAndUpdate(id, update, {
    new: true,
    runValidators: true,
  });

  return res.status(200).json({
    success: true,
    message: "Product edited successfully",
    newProduct,
  });
});

const showProducts = asyncWrapper(async (req, res) => {
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = 20;
  const search = req.query.search?.trim() || "";
  const category = req.query.category?.trim() || "";
  const query = {};

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  if (category) {
    query.category = category;
  }

  const [products, totalProducts] = await Promise.all([
    product
      .find(query)
      .skip((page - 1) * limit)
      .limit(limit),
    product.countDocuments(query),
  ]);

  return res.status(200).json({
    success: true,
    products,
    pagination: {
      page,
      limit,
      totalProducts,
      totalPages: Math.ceil(totalProducts / limit),
    },
  });
});

const showProductDetails = asyncWrapper(async (req, res) => {
  const id = req.params.id;
  const userId = req.params.userId;

  const UserCart = await Cart.findOne(
    { userId, "products.productId": id },
    { "products.$": 1 },
  );

  let isinCart = false;
  let count = 0;

  if (UserCart) {
    isinCart = true;
    count = UserCart.products[0].count;
  }

  const productDea = await product.findById(id);
  const sameProducts = await product
    .find({ category: productDea.category })
    .limit(6);

  if (!productDea) {
    return res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }

  return res.status(200).json({
    success: true,
    productDea,
    sameProducts,
    isinCart,
    count,
  });
});

const trackProductEvent = asyncWrapper(async (req, res) => {
  const { type, productId, userId } = req.body;

  await ProductEvent.create({
    product: productId,
    user: userId || null,
    type,
  });

  res.status(201).json({
    message: "Event tracked successfully",
  });
});

const analytics = asyncWrapper(async (req, res) => {
  const mostViewed = await ProductEvent.aggregate([
    {
      $match: {
        type: "view",
      },
    },

    {
      $group: {
        _id: "$product",
        views: { $sum: 1 },
      },
    },

    {
      $sort: {
        views: -1,
      },
    },

    {
      $limit: 10,
    },

    {
      $lookup: {
        from: "products",
        localField: "_id",
        foreignField: "_id",
        as: "product",
      },
    },

    {
      $unwind: "$product",
    },
  ]);

  const mostAddedToCart = await ProductEvent.aggregate([
    {
      $match: {
        type: "add_to_cart",
      },
    },

    {
      $group: {
        _id: "$product",
        addToCart: { $sum: 1 },
      },
    },

    {
      $sort: {
        addToCart: -1,
      },
    },

    {
      $limit: 10,
    },
  ]);

  const mostAddedToFavorite = await ProductEvent.aggregate([
    {
      $match: {
        type: "wishlist",
      },
    },

    {
      $group: {
        _id: "$product",
        wishlist: { $sum: 1 },
      },
    },

    {
      $sort: {
        wishlist: -1,
      },
    },

    {
      $limit: 10,
    },
  ]);

  const bestSelling = await ProductEvent.aggregate([
    {
      $match: {
        type: "purchase",
      },
    },

    {
      $group: {
        _id: "$product",

        orders: {
          $sum: 1,
        },
      },
    },

    {
      $sort: {
        orders: -1,
      },
    },

    {
      $limit: 10,
    },
  ]);

  const topRated = await Review.aggregate([
    {
      $group: {
        _id: "$productId",

        averageRating: {
          $avg: "$rating",
        },

        ratingsCount: {
          $sum: 1,
        },
      },
    },

    {
      $sort: {
        averageRating: -1,
        ratingsCount: -1,
      },
    },

    {
      $limit: 10,
    },
  ]);

  res.status(201).json({
    message: "Event tracked successfully",
  });
});

const getMostPopularProducts = asyncWrapper(async (req, res) => {
  const products = await ProductEvent.aggregate([
    {
      $group: {
        _id: "$product",

        views: {
          $sum: {
            $cond: [{ $eq: ["$type", "view"] }, 1, 0],
          },
        },

        addToCart: {
          $sum: {
            $cond: [{ $eq: ["$type", "add_to_cart"] }, 1, 0],
          },
        },

        favorites: {
          $sum: {
            $cond: [{ $eq: ["$type", "favorite"] }, 1, 0],
          },
        },

        orders: {
          $sum: {
            $cond: [{ $eq: ["$type", "purchase"] }, 1, 0],
          },
        },
      },
    },

    {
      $lookup: {
        from: "products",
        localField: "_id",
        foreignField: "_id",
        as: "product",
      },
    },

    {
      $unwind: "$product",
    },

    {
      $addFields: {
        popularityScore: {
          $add: [
            { $multiply: ["$views", 1] },
            { $multiply: ["$addToCart", 3] },
            { $multiply: ["$favorites", 2] },
            { $multiply: ["$orders", 10] },
          ],
        },
      },
    },

    {
      $sort: {
        popularityScore: -1,
      },
    },

    {
      $limit: 10,
    },

    {
      $project: {
        _id: 0,
        product: 1,
        views: 1,
        addToCart: 1,
        favorites: 1,
        orders: 1,
        popularityScore: 1,
      },
    },
  ]);

  res.status(200).json({
    success: true,
    products,
  });
});

module.exports = {
  addProduct,
  removeProduct,
  editProduct,
  showProducts,
  showProductDetails,
  trackProductEvent,
  analytics,
  getMostPopularProducts,
};
