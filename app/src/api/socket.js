import { io } from "socket.io-client";

const socket = io("https://products-production-b803.up.railway.app", {
  transports: ["websocket", "polling"],
});

export default socket;
