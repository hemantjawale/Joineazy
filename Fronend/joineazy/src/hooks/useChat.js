import { useState, useEffect, useCallback } from "react";
import api from "@/lib/api";
import { useSocket } from "@/context/SocketContext";

export function useChat(groupId) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const socket = useSocket();

  const fetchMessages = useCallback(async () => {
    if (!groupId) return;
    setLoading(true);
    try {
      const res = await api.get(`/chat/${groupId}/messages`);
      setMessages(res.data.messages);
    } finally {
      setLoading(false);
    }
  }, [groupId]);

  const sendMessage = useCallback(
    async (content, senderName) => {
      const res = await api.post("/chat", { groupId, content });
      const message = res.data.message;

      if (socket) {
        socket.emit("send-message", {
          id: message.id,
          content: message.content,
          groupId,
          senderName,
        });
      }

      return message;
    },
    [groupId, socket]
  );

  useEffect(() => {
    if (!socket || !groupId) return;

    socket.emit("join-group", groupId);

    const handleReceive = (message) => {
      setMessages((prev) => {
        const exists = prev.some((m) => m.id === message.id);
        if (exists) return prev;
        return [...prev, message];
      });
    };

    socket.on("receive-message", handleReceive);

    return () => {
      socket.emit("leave-group", groupId);
      socket.off("receive-message", handleReceive);
    };
  }, [socket, groupId]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  return {
    messages,
    loading,
    sendMessage,
    fetchMessages,
  };
}
