import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Course = sequelize.define("Course", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  joinCode: {
    type: DataTypes.STRING(10),
    allowNull: true, // Allow true so Sequelize can add column to existing records
    unique: true,
    field: "join_code",
  },
  professorId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: "professor_id",
  },
});

export default Course;
