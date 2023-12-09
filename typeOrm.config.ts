import { DataSource, DataSourceOptions } from "typeorm";
import { config } from "dotenv";
import { ConfigService } from "@nestjs/config";
import { User } from "./src/entities";
import { Book } from "./src/entities/book.entity";
import { Page } from "./src/entities/pages.entity";
import { Migrations1702073365659 } from "./migrations/1702073365659-migrations";
import { ReadingHistory } from "./src/entities/reading-history.entity";
import { Migrations1702115267596 } from "./migrations/1702115267596-migrations";

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
  migrations: [Migrations1702073365659, Migrations1702115267596],
  migrationsRun: true

};
const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
