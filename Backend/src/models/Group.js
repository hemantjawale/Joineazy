import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Group = sequelize.define("Group", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  createdById: {
    type: DataTypes.UUID,
    allowNull: false,
    field: "created_by_id",
  },
});

export default Group;
