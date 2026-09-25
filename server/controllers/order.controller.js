const Order = require("../models/orderSchema");
const Cart = require("../models/cartSchema");
const Event = require("../models/eventSchema");

const asyncWrapper = require("../middleware/asyncWrapper");
const mongoose = require("mongoose");
const User = require("../models/userSchema");
const Message = require("../models/messageSchema");
const productSchema = require("../models/productSchema");

const makeOrder = asyncWrapper(async (req, res) => {
  const { userId, address, deliveryDate, total } = req.body;

  const cart = await Cart.findOne({ userId });
  if (!cart || cart.products.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Cart is empty",
    });
  }

  await Promise.all(
    cart.products.map(async (c) => {
      const product = await productSchema.findByIdAndUpdate(c.productId, {
        $inc: {
          stock: -c.count,
        },
      });

      for (let i = 0; i < c.count; i++) {
        await Event.create({
          userId,
          productId: c.productId,
          type: "purchase",
        });
      }
    }),
  );

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

  let orders = [];

  const user = await User.findById(userId);

  if (user?.role == "admin") {
    orders = await Order.find()
      .populate("userId", "name avatar ")
      .populate("products.productId", "name images price");
  } else {
    orders = await Order.find({ userId }).populate(
      "products.productId",
      "name images price",
    );
  }

  const ordersWithMessages = await Promise.all(
    orders.map(async (order) => {
      const messages = await Message.countDocuments({
        orderId: order._id,
        senderId: { $ne: userId },
        seenBy: false,
      });

      const lastMessage = await Message.findOne({
        orderId: order._id,
      }).sort({
        createdAt: -1,
      });

      return {
        ...order.toObject(),
        messages,
        lastMessage,
      };
    }),
  );

  res.status(200).json({
    success: true,
    orders: ordersWithMessages,
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

const editStatus = asyncWrapper(async (req, res) => {
  const { id, status } = req.body;

  await Order.findByIdAndUpdate(id, { status });

  res.status(201).json({
    success: true,
  });
});

module.exports = { makeOrder, showMyOrders, showMyOrder, editStatus };
