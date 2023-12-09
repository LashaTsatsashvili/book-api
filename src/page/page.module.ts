import { Module } from '@nestjs/common';
import { PageService } from './page.service';
import { PageController } from './page.controller';
import { TypeOrmModule } from "@nestjs/typeorm";
import { Page } from "../entities/pages.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([Page])
  ],
  controllers: [PageController],
  providers: [PageService],
  exports: [PageService]
})
export class PageModule {}
