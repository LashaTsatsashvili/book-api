import { DataSource, DataSourceOptions } from "typeorm";
import { config } from "dotenv";
import { ConfigService } from "@nestjs/config";
import { User, ReadingHistory, Book, Page } from "./src/entities";
import { Migrations1702073365659 } from "./migrations/1702073365659-migrations";
import { Migrations1702115267596 } from "./migrations/1702115267596-migrations";
import { Migrations1702257091028 } from "./migrations/1702257091028-migrations";

config();
const configService = new ConfigService();
export const dataSourceOptions: DataSourceOptions = {
  type: "mysql",
  host: configService.getOrThrow<string>("DATABASE_HOST"),
  port: configService.getOrThrow<number>("DATABASE_PORT"),
  database: configService.getOrThrow<string>("DATABASE_NAME"),
  username: configService.getOrThrow<string>("DATABASE_USER"),
  password: configService.getOrThrow<string>("DATABASE_PASSWORD"),
  entities: [User, Book, Page, ReadingHistory],
  migrations: [Migrations1702073365659, Migrations1702115267596, Migrations1702257091028],
  migrationsRun: true

};
const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
