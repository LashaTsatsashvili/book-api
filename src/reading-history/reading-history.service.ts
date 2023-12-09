import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ReadingHistory } from "../entities/reading-history.entity";
import { Repository } from "typeorm";

@Injectable()
export class ReadingHistoryService {
  @InjectRepository(ReadingHistory)
  private readonly repository: Repository<ReadingHistory>;

  async createOrUpdate(bookId, page, userId) {
    const dbReadingHistory = await this.repository.findOne({ where: { book: { id: bookId }, user: { id: userId } } });
    if (dbReadingHistory) {
      return this.repository.update({ book: { id: bookId }, user: { id: userId } }, { lastReadPage: page });
    }
    const readingHistory = this.repository.create({ book: bookId, user: userId, lastReadPage: page });
    return this.repository.save(readingHistory);
  }
}
