import { Sequelize } from "sequelize";

const sequelize = process.env.DATABASE_URL
  ? new Sequelize(process.env.DATABASE_URL, {
      dialect: "postgres",
      logging: process.env.NODE_ENV === "development" ? console.log : false,
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      },
      pool: { max: 10, min: 2, acquire: 30000, idle: 10000 },
      define: { timestamps: true, underscored: true },
    })
  : new Sequelize(
      process.env.DB_NAME,
      process.env.DB_USER,
      process.env.DB_PASSWORD,
      {
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT || "5432", 10),
        dialect: "postgres",
        logging: process.env.NODE_ENV === "development" ? console.log : false,
        pool: { max: 10, min: 2, acquire: 30000, idle: 10000 },
        define: { timestamps: true, underscored: true },
      }
    );

export default sequelize;
