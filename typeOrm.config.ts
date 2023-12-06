import { DataSource, DataSourceOptions } from "typeorm";
import { config } from "dotenv";
import { ConfigService } from "@nestjs/config";
import { User } from "./src/entities";
import { Users1701875579257 } from "./migrations/1701875579257-users";

config();
const configService = new ConfigService();
export const dataSourceOptions : DataSourceOptions = {
  type: "mysql",
  host: configService.getOrThrow<string>("DATABASE_HOST"),
  port: configService.getOrThrow<number>("DATABASE_PORT"),
  database: configService.getOrThrow<string>("DATABASE_NAME"),
  username: configService.getOrThrow<string>("DATABASE_USER"),
  password: configService.getOrThrow<string>("DATABASE_PASSWORD"),
  entities: [User],
  migrations: [Users1701875579257],
  migrationsRun:true,

}
const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
