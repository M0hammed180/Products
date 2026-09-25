const Cart = require("../models/cartSchema");
const asyncWrapper = require("../middleware/asyncWrapper");
const Event = require("../models/eventSchema");

const addtoCart = asyncWrapper(async (req, res) => {
  const { productId, userId, count } = req.body;

  const updatedCart = await Cart.findOneAndUpdate(
    { userId, "products.productId": productId },
    { $inc: { "products.$.count": count } },
    { new: true },
  );
  const existingEvent = await Event.findOne({
    userId,
    productId,
    type: "add_to_cart",
  });

  if (!existingEvent) {
    await Event.create({
      userId,
      productId,
      type: "add_to_cart",
    });
  }

  if (!updatedCart) {
    const cartExist = await Cart.findOne({ userId });

    if (cartExist) {
      await Cart.findByIdAndUpdate(cartExist._id, {
        $push: { products: { productId, count } },
      });
    } else {
      await Cart.create({ userId, products: [{ productId, count }] });
    }
  }

  res.status(201).json({
    success: true,
    message: "Product Added Successfully in Cart",
  });
});

const showCart = asyncWrapper(async (req, res) => {
  const userId = req.params.userId;
  const cartExist = await Cart.findOne({ userId });
  let myCart = [];
  let message = "";
  if (cartExist) {
    myCart = cartExist;
    message = "cart";
  } else {
    message = "no cart";
  }

  res.status(201).json({
    success: true,
    message,
    myCart,
  });
});

const showCartwithPro = asyncWrapper(async (req, res) => {
  const userId = req.params.userId;
  const cartExist = await Cart.findOne({ userId }).populate(
    "products.productId",
  );
  let myCart = [];
  let message = "";
  if (cartExist) {
    myCart = cartExist;
    message = "cart";
  } else {
    message = "no cart";
  }

  res.status(201).json({
    success: true,
    message,
    myCart,
  });
});

const removeProductFromCart = asyncWrapper(async (req, res) => {
  const { productId, userId } = req.body;

  const cart = await Cart.findOneAndUpdate(
    { userId },
    { $pull: { products: { productId } } },
    { new: true },
  );

  res.status(200).json({
    success: true,
    message: "Product removed successfully",
    data: cart,
  });
});

const updateCartQuantity = asyncWrapper(async (req, res) => {
  const { productId, userId, type } = req.body;
  let cart = null;
  if (type == "increase") {
    cart = await Cart.findOneAndUpdate(
      { userId, "products.productId": productId },
      { $inc: { "products.$.count": 1 } },
      { new: true },
    );
  } else if (type == "decrease") {
    cart = await Cart.findOneAndUpdate(
      { userId, "products.productId": productId },
      { $inc: { "products.$.count": -1 } },
      { new: true },
    );
  }

  res.status(200).json({
    success: true,
    message: "Quantity updated successfully",
    data: cart,
  });
});

module.exports = {
  addtoCart,
  showCart,
  showCartwithPro,
  removeProductFromCart,
  updateCartQuantity,
};
