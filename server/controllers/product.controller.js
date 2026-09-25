const product = require("../models/productSchema");
const ProductEvent = require("../models/eventSchema");
const Review = require("../models/commentSchema");
const asyncWrapper = require("../middleware/asyncWrapper");
const { default: mongoose } = require("mongoose");
const Cart = require("../models/cartSchema");
const Order = require("../models/orderSchema");

const addProduct = asyncWrapper(async (req, res) => {
  const { name, description, price, category, stock, size } = req.body;

  const images = req.files?.map((file) => file.path) || [];

  const newProduct = await product.create({
    name,
    description: description || "",
    price,
    discountPrice: 0,
    category,
    stock,
    isActive: true,
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
      .sort({ createdAt: -1 })
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
    .find({ category: productDea.category, _id: { $ne: id } })
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

const showProductDetailsNoLogin = asyncWrapper(async (req, res) => {
  const id = req.params.id;

  const productDea = await product.findById(id);
  const sameProducts = await product
    .find({ category: productDea.category, _id: { $ne: id } })
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
  });
});

const showProductinNoLogin = asyncWrapper(async (req, res) => {
  const id = req.params.id;

  const productDea = await product.findById(id);

  if (!productDea) {
    return res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }

  return res.status(200).json({
    success: true,
    productDea,
  });
});

const trackProductEvent = asyncWrapper(async (req, res) => {
  const { productId, userId } = req.body;
  let existingEvent = null;

  if (userId) {
    existingEvent = await ProductEvent.findOne({
      userId,
      productId,
      type: "product_view",
    });
  }

  if (!existingEvent) {
    await ProductEvent.create({
      productId: productId,
      userId: userId || null,
      type: "product_view",
    });
  }

  res.status(201).json({
    message: "Event tracked successfully",
  });
});

const analytics = asyncWrapper(async (req, res) => {
  const mostViewed = await ProductEvent.aggregate([
    {
      $match: {
        type: "product_view",
      },
    },

    {
      $group: {
        _id: "$productId",
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
        _id: "$productId",
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

  const mostAddedToFavorite = await ProductEvent.aggregate([
    {
      $match: {
        type: "wishlist",
      },
    },

    {
      $group: {
        _id: "$productId",
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

  const bestSelling = await ProductEvent.aggregate([
    {
      $match: {
        type: "purchase",
      },
    },

    {
      $group: {
        _id: "$productId",
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

  const products = await ProductEvent.aggregate([
    {
      $group: {
        _id: "$productId",

        views: {
          $sum: {
            $cond: [{ $eq: ["$type", "product_view"] }, 1, 0],
          },
        },

        addToCart: {
          $sum: {
            $cond: [{ $eq: ["$type", "add_to_cart"] }, 1, 0],
          },
        },

        favorites: {
          $sum: {
            $cond: [{ $eq: ["$type", "wishlist"] }, 1, 0],
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
            { $multiply: ["$favorites", 5] },
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
      $limit: 9,
    },

    {
      $project: {
        _id: 0,
        product: 1,
        score: {
          views: "$views",
          addToCart: "$addToCart",
          favorites: "$favorites",
          orders: "$orders",
        },
        popularityScore: 1,
      },
    },
  ]);

  const salesAnalytics = await Order.aggregate([
    {
      $unwind: "$products",
    },

    {
      $group: {
        _id: "$products.productId",

        soldQuantity: {
          $sum: "$products.count",
        },
      },
    },

    {
      $project: {
        _id: 0,
        soldQuantity: 1,
      },
    },
  ]);

  const totalSalesAnalytics = salesAnalytics.reduce(
    (acc, item) => {
      acc.soldQuantity += item.soldQuantity || 0;
      return acc;
    },
    {
      soldQuantity: 0,
    },
  );

  const totalSales = await Order.aggregate([
    {
      $group: {
        _id: null,
        totalSales: {
          $sum: "$price",
        },
      },
    },
  ]);

  const orders = await Order.countDocuments();

  res.status(201).json({
    message: "Event tracked successfully",
    mostViewed,
    mostAddedToCart,
    mostAddedToFavorite,
    bestSelling,
    products,
    totalSalesAnalytics,
    totalSales,
    orders,
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
  showProductinNoLogin,
  showProductDetailsNoLogin,
};
