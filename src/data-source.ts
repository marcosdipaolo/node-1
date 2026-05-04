require("reflect-metadata");
import { DataSource } from "typeorm";
import path from "path";

export default new DataSource({
  type: "mysql",
  host: process.env.MYSQL_HOST || "localhost",
  port: Number(process.env.MYSQL_PORT || 3306),
  username: process.env.MYSQL_USER || "root",
  password: process.env.MYSQL_PASSWORD || "",
  database: process.env.MYSQL_DATABASE || "app",
  synchronize: false,
  entities: [path.join(__dirname, "entity", "*.{ts,js}")],
  migrations: [path.join(__dirname, "migrations", "*.{ts,js}")],
  migrationsTableName: "migrations",
});
