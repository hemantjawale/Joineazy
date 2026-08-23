import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Submission = sequelize.define("Submission", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  assignmentId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: "assignment_id",
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: "user_id",
  },
  groupId: {
    type: DataTypes.UUID,
    allowNull: true,
    field: "group_id",
  },
  status: {
    type: DataTypes.ENUM("pending", "confirmed"),
    defaultValue: "pending",
  },
  confirmedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: "confirmed_at",
  },
});

export default Submission;
