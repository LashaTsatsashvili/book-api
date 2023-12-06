import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule } from "@nestjs/config";
// import { User } from "./entities";
import { TypeOrmModule } from "@nestjs/typeorm";
import dataSource, { dataSourceOptions } from "../typeOrm.config";
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    // TypeOrmModule.forFeature([User]),
    TypeOrmModule.forRoot(dataSourceOptions),
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {
}
