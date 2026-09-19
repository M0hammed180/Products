const Message = require("../models/messageSchema");

const setupSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("Connected:", socket.id);

    // =========================
    // Join Order Room
    // =========================

    socket.on("join_order", async ({ orderId, userId }) => {
      const room = `order_${orderId}`;

      socket.join(room);

      socket.orderId = orderId;
      socket.userId = userId;

      await Message.updateMany(
        {
          orderId,
          senderId: { $ne: userId },
          seenBy: false,
        },
        {
          $set: {
            seenBy: true,
          },
        },
      );
    });

    // =========================
    // Send Message
    // =========================

    socket.on("send_message", async ({ orderId, senderId, text }) => {
      try {
        if (!text?.trim()) return;
        console.log({ orderId, senderId, text });

        const message = await Message.create({
          orderId,
          senderId,
          text: text.trim(),
        });
        console.log(message);

        io.to(`order_${orderId}`).emit("receive_message", message);
      } catch (error) {
        console.error(error);
      }
    });

    socket.on("disconnect", () => {
      console.log("Disconnected:", socket.id);
    });
  });
};

module.exports = setupSocket;
