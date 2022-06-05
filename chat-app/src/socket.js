import io from "socket.io-client";

// const socket = io();
const socket = io("localhost:8888", { transports: ["websocket"] });

export default socket;
