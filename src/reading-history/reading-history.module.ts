import { Module } from "@nestjs/common";
import { ReadingHistoryService } from "./reading-history.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ReadingHistory } from "../entities";

@Module({
  imports: [
    TypeOrmModule.forFeature([ReadingHistory])
  ],
  providers: [ReadingHistoryService],
  exports: [ReadingHistoryService]
})
export class ReadingHistoryModule {
}
