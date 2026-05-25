import "reflect-metadata";
import { FastifyInstance } from "fastify";

import dbConnection from "typeorm-fastify-plugin";
import path from "path";

export function registerDb(fastify: FastifyInstance) {
  fastify.register(dbConnection, {
    type: "mysql",
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || "3306"),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: false,
    entities: [path.join(__dirname, "..", "app", "entities", "*{.js,.ts}")],
    logging: process.env.NODE_ENV === "production" ? false : true,
  });
}
