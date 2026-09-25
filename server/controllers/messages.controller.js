const Message = require("../models/messageSchema");
const asyncWrapper = require("../middleware/asyncWrapper");

const getMessages = asyncWrapper(async (req, res) => {
  const { orderId } = req.params;

  const messages = await Message.find({ orderId }).sort({ createdAt: 1 });

  return res.status(200).json({
    success: true,
    messages,
  });
});

const unReadMessages = asyncWrapper(async (req, res) => {
  const { orderId, userId } = req.params;

  const messages = await Message.find({
    orderId,
    senderId: { $ne: userId },
    seenBy: false,
  }).sort({
    createdAt: -1,
  });

  const lastMessage = await Message.findOne({ orderId }).sort({
    createdAt: -1,
  });

  return res.status(200).json({
    success: true,
    unReadedMessages: messages.length,
    lastMessage,
  });
});

module.exports = {
  getMessages,
  unReadMessages,
};
