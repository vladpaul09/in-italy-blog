import { Dialect, Sequelize } from "sequelize";
import "dotenv/config";

const sequelizeConnector = new Sequelize(
  process.env.DB_NAME as string, 
  process.env.DB_USERNAME as string, 
  process.env.DB_PASSWORD as string, 
  {
    host: process.env.DB_HOST as string, 
    dialect: process.env.DB_DIALECT as Dialect,
    logging: false
  }
);

export default sequelizeConnector;