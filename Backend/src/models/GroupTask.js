import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const GroupTask = sequelize.define("GroupTask", {
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
  assignmentId: {
    type: DataTypes.UUID,
    allowNull: true,
    field: "assignment_id",
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  assignedToId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: "assigned_to_id",
  },
  createdById: {
    type: DataTypes.UUID,
    allowNull: false,
    field: "created_by_id",
  },
  status: {
    type: DataTypes.ENUM("todo", "in_progress", "done"),
    defaultValue: "todo",
  },
});

export default GroupTask;
