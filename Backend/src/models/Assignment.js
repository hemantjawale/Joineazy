import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Assignment = sequelize.define("Assignment", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  dueDate: {
    type: DataTypes.DATE,
    allowNull: false,
    field: "due_date",
  },
  oneDriveLink: {
    type: DataTypes.STRING(500),
    allowNull: false,
    field: "one_drive_link",
  },
  type: {
    type: DataTypes.ENUM("individual", "group"),
    defaultValue: "individual",
  },
  targetScope: {
    type: DataTypes.ENUM("all", "specific"),
    defaultValue: "all",
    field: "target_scope",
  },
  professorId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: "professor_id",
  },
  courseId: {
    type: DataTypes.UUID,
    allowNull: true, // Allow true for now to avoid breaking existing data immediately
    field: "course_id",
  }
});

export default Assignment;
