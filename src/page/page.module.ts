import { Module } from "@nestjs/common";
import { PageService } from "./page.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Page } from "../entities";

@Module({
  imports: [
    TypeOrmModule.forFeature([Page])
  ],
  providers: [PageService],
  exports: [PageService]
})
export class PageModule {
}
