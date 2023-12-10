import { MiddlewareConsumer, Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { dataSourceOptions } from "../typeOrm.config";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { PassportModule } from "@nestjs/passport";
import { BookModule } from "./book/book.module";
import { PageModule } from "./page/page.module";
import { APP_FILTER } from "@nestjs/core";
import { MySQLExceptionFilter } from "./filters/mysql-exception.filter";
import { ReadingHistoryModule } from "./reading-history/reading-history.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(dataSourceOptions),
    PassportModule.register({ defaultStrategy: "jwt", property: "user" }),
    AuthModule,
    UsersModule,
    BookModule,
    PageModule,
    ReadingHistoryModule
  ],
  controllers: [],
  providers: [{
    provide: APP_FILTER,
    useClass: MySQLExceptionFilter
  }]
})
export class AppModule {
}
