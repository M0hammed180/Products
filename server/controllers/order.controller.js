const Order = require("../models/orderSchema");
const Cart = require("../models/cartSchema");

const asyncWrapper = require("../middleware/asyncWrapper");
const mongoose = require("mongoose");

const makeOrder = asyncWrapper(async (req, res) => {
  const { userId, address, deliveryDate, total } = req.body;

  const cart = await Cart.findOne({ userId });
  if (!cart || cart.products.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Cart is empty",
    });
  }

  const order = await Order.create({
    userId,
    ...(address ? { address } : {}),
    ...(deliveryDate ? { deliveryDate } : {}),
    products: cart.products,
    price: Number(total),
  });

  await Cart.findByIdAndDelete(cart._id);

  res.status(201).json({
    success: true,
    message: "Order created successfully",
    order,
  });
});

const showMyOrders = asyncWrapper(async (req, res) => {
  const { userId } = req.params;

  const orders = await Order.find({ userId });

  res.status(201).json({
    success: true,
    orders,
  });
});

const showMyOrder = asyncWrapper(async (req, res) => {
  const { orderId } = req.params;

  const order = await Order.findById(orderId).populate("products.productId");

  res.status(201).json({
    success: true,
    order,
  });
});

module.exports = { makeOrder, showMyOrders, showMyOrder };
