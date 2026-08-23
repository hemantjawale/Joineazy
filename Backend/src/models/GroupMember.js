import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const GroupMember = sequelize.define("GroupMember", {
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
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: "user_id",
  },
  role: {
    type: DataTypes.ENUM("leader", "member"),
    defaultValue: "member",
  },
});

export default GroupMember;
