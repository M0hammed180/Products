const Message = require("../models/messageSchema");
const asyncWrapper = require("../middleware/asyncWrapper");

const getMessages = asyncWrapper(async (req, res) => {
  const { orderId } = req.params;

  const messages = await Message.find({ orderId })
    .sort({ createdAt: 1 });

  return res.status(200).json({
    success: true,
    messages,
  });
});

module.exports = {
  getMessages,
};