const express = require("express");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");
const { config } = require("dotenv");
config();
const http = require("http");
const { Server } = require("socket.io");
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});
const setupSocket = require("./socket/socket");
setupSocket(io);
const userRoutes = require("./routes/user.route");
const productRoutes = require("./routes/product.route");
const categoryRoutes = require("./routes/category.route");
const commentRoute = require("./routes/comments.route");
const cartRoute = require("./routes/cart.route");
const favouritesRoute = require("./routes/favourites.route");
const orderRoute = require("./routes/order.route");
const messageRouter = require("./routes/message.route");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

//routes
app.use("/user", userRoutes);
app.use("/product", productRoutes);
app.use("/category", categoryRoutes);
app.use("/comment", commentRoute);
app.use("/cart", cartRoute);
app.use("/favourites", favouritesRoute);
app.use("/order", orderRoute);
app.use("/messages", messageRouter);

// global error handler
app.use((error, req, res, next) => {
  res.status(error.statusCode || 500).json({
    status: error.statusText || "error",
    message: error.message,
    code: error.statusCode || 500,
    data: null,
  });
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("connect sucsess");
  })
  .catch((e) => {
    console.log(`error with connect db is ${e}`);
  });

server.listen(process.env.PORT, () => {
  console.log("lam listening in port" + " " + process.env.PORT);
});
