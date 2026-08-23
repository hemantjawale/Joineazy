import { io } from "socket.io-client";

let socket = null;

export const getSocket = () => {
  if (!socket) {
    const token = localStorage.getItem("joineazy_token");
    socket = io(window.location.origin, {
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
