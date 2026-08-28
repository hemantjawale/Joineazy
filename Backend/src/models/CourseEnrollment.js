import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const CourseEnrollment = sequelize.define("CourseEnrollment", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  studentId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: "student_id",
  },
  courseId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: "course_id",
  },
});

export default CourseEnrollment;
