const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    discountPrice: {
      type: Number,
      min: 0,
      default: null,
    },

    images: [
      {
        type: String,
        required: true,
      },
    ],

    category: {
      type: String,
      enum: ["tshirts", "pantalons", "shoes"],
      required: true,
    },

    colors: {
      type: String,
      enum: [
        "Black",
        "White",
        "Sand",
        "Olive",
        "Navy",
        "Charcoal",
        "Cream",
        "Rust",
        "Stone",
        "Denim blue",
      ],
    },

    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    size: [
      {
        size: String,
        available: { type: Boolean, default: true },
      },
    ],

    // Reviews
    ratingAverage: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    ratingCount: {
      type: Number,
      default: 0,
    },

    Selling: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Product", productSchema);
// // Analytics
// views: {
//   type: Number,
//   default: 0,
// },

// wishlistCount: {
//   type: Number,
//   default: 0,
// },

// cartCount: {
//   type: Number,
//   default: 0,
// },

// orderCount: {
//   type: Number,
//   default: 0,
// },

// searchCount: {
//   type: Number,
//   default: 0,
// },
