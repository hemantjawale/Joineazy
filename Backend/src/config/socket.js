import { Server } from "socket.io";
import jwt from "jsonwebtoken";

let io;

export const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:5173",
      methods: ["GET", "POST"],
    },
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error("Authentication required"));
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      socket.userRole = decoded.role;
      next();
    } catch {
      next(new Error("Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    socket.on("join-group", (groupId) => {
      socket.join(`group-${groupId}`);
    });

    socket.on("leave-group", (groupId) => {
      socket.leave(`group-${groupId}`);
    });

    socket.on("send-message", (data) => {
      io.to(`group-${data.groupId}`).emit("receive-message", {
        id: data.id,
        content: data.content,
        senderId: socket.userId,
        senderName: data.senderName,
        groupId: data.groupId,
        createdAt: new Date().toISOString(),
      });
    });

    socket.on("disconnect", () => {});
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.IO not initialized");
  }
  return io;
};
