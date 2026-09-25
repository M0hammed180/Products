const Message = require("../models/messageSchema");
const orderSchema = require("../models/orderSchema");

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

      io.to(`order_${orderId}`).emit("readMessage", userId);
    });

    socket.on("admin", () => {
      socket.join(`admin`);
    });

    socket.on("leave_order", ({ orderId }) => {
      socket.leave(`order_${orderId}`);
    });

    socket.on(
      "check_user_in_room",
      async ({ orderId, userId, role }, callback) => {
        const room = io.sockets.adapter.rooms.get(`order_${orderId}`);

        if (!room) {
          return callback(false);
        }
        if (role == "user") {
          const userExists = [...room].some((socketId) => {
            const s = io.sockets.sockets.get(socketId);
            return s?.userId == "6a9bf1bb73fe601a016814de";
          });

          callback(userExists);
        } else {
          const order = await orderSchema.findById(orderId, "userId");
          const otherUserId = order.userId;
          const userExists = [...room].some((socketId) => {
            const s = io.sockets.sockets.get(socketId);
            return s?.userId == otherUserId;
          });

          callback(userExists);
        }
      },
    );

    // =========================
    // Send Message
    // =========================

    socket.on("send_message", async ({ orderId, senderId, text, role }) => {
      try {
        if (!text?.trim()) return;

        const roomName = `order_${orderId}`;
        const room = io.sockets.adapter.rooms.get(roomName);

        let seenBy = false;

        if (room) {
          if (role === "user") {
            const adminExists = [...room].some((socketId) => {
              const s = io.sockets.sockets.get(socketId);

              return s?.userId === "6a9bf1bb73fe601a016814de";
            });

            seenBy = adminExists;
          } else {
            const order = await orderSchema.findById(orderId, "userId");

            if (order) {
              const userExists = [...room].some((socketId) => {
                const s = io.sockets.sockets.get(socketId);

                return String(s?.userId) === String(order.userId);
              });

              seenBy = userExists;
            }
          }
        }

        const message = await Message.create({
          orderId,
          senderId,
          seenBy,
          text: text.trim(),
        });

        io.to(roomName).emit("receive_message", message);

        io.to("admin").emit("new_order_message", message);
      } catch (error) {
        console.error(error);
      }
    });

    socket.on("edit_message", async (data) => {
      try {
        const { messageId, senderId, text, id } = data;
        const roomName = `order_${id}`;

        const message = await Message.findOneAndUpdate(
          {
            _id: messageId,
            senderId,
            text: { $ne: text },
          },
          {
            text,
            edited: true,
          },
          { new: true },
        );

        if (!message) return;

        io.to(roomName).emit("message_edited", message);
      } catch (error) {
        console.error("Error in editMessage:", error);
      }
    });

    socket.on("delete_message", async (data) => {
      try {
        const { messageId, senderId, id } = data;
        const roomName = `order_${id}`;

        const message = await Message.findOneAndDelete({
          _id: messageId,
          senderId,
        });

        if (!message) return;

        io.to(roomName).emit("message_deleted", { messageId });
      } catch (error) {
        console.error("Error in deleteMessage:", error);
      }
    });

    socket.on("disconnect", () => {
      console.log("Disconnected:", socket.id);
    });
  });
};

module.exports = setupSocket;
