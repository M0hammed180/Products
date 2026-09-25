import { io } from "socket.io-client";

const socket = io("http://192.168.1.5:3000", {
  transports: ["websocket", "polling"],
});

export default socket;

//https://products-production-b803.up.railway.app
