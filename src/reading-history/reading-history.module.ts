import { Module } from "@nestjs/common";
import { ReadingHistoryService } from "./reading-history.service";
import { ReadingHistoryController } from "./reading-history.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ReadingHistory } from "../entities/reading-history.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([ReadingHistory])
  ],
  controllers: [ReadingHistoryController],
  providers: [ReadingHistoryService],
  exports: [ReadingHistoryService]
})
export class ReadingHistoryModule {
}
