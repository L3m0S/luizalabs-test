import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
  type: process.env.DB_TYPE as any,
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT!,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: process.env.DB_SYNCHRONIZE === "true",
  logging: process.env.DB_LOGGING === "true",
  entities: [],
  subscribers: [],
  migrations: [],
});
