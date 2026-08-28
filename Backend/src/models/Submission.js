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
  proofText: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: "proof_text",
  },
  gradeR1: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: "grade_r1",
  },
  gradeR2: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: "grade_r2",
  },
  gradeR3: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: "grade_r3",
  },
  totalScore: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: "total_score",
  },
  feedback: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM("pending", "confirmed", "graded"),
    defaultValue: "pending",
  },
  confirmedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: "confirmed_at",
  },
});

export default Submission;
