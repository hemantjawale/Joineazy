import { io } from "socket.io-client";

let socket = null;

export const getSocket = () => {
  if (!socket) {
    const token = localStorage.getItem("joineazy_token");
    const socketUrl = import.meta.env.VITE_API_URL || window.location.origin;
    socket = io(socketUrl, {
      auth: { token },
      transports: ["websocket", "polling"],
    });
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
