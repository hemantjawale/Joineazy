import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const ChatMessage = sequelize.define("ChatMessage", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  groupId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: "group_id",
  },
  senderId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: "sender_id",
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});

export default ChatMessage;
