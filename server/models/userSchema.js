const mongoose = require("mongoose");

const DEFAULT_AVATAR =
  "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_1280.png";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },

  phone: {
    type: String,
    required: true,
    unique: true,
  },

  role: {
    type: String,
    required: true,
    enum: ["user", "admin"],
    default: "user",
  },

  avatar: {
    type: String,
    default: DEFAULT_AVATAR,
  },

  interests: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },

      score: {
        type: Number,
        default: 0,
      },
    },
  ],
  myAddresses: [
    {
      street: {
        type: String,
        required: true,
        trim: true,
      },
      city: {
        type: String,
        required: true,
        trim: true,
      },
      region: {
        type: String,
        required: true,
        trim: true,
      },
    },
  ],
});

const User = mongoose.model("User", userSchema);

module.exports = User;
