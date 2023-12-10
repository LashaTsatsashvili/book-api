import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Page } from "../entities/pages.entity";

@Injectable()
export class PageService {
  @InjectRepository(Page)
  private readonly repository: Repository<Page>;

  async create(pages: Page[], queryRunner): Promise<Page> {
    return queryRunner.manager.save(Page, pages);
  }

  async updateArray(pages: Page[], queryRunner) {
    const updatePromises = pages.map(({ id, pageNumber, content, book }) => {
      return queryRunner.manager
        .createQueryBuilder()
        .update(Page)
        .set({ pageNumber, content })
        .where("id = :id AND bookId=:bookId", { id, bookId: book.id })
        .execute();
    });
    await Promise.all(updatePromises);

  }

  async findPage(bookId: number, page: number): Promise<boolean> {
    return this.repository.exist({ where: { book: { id: bookId }, pageNumber: page } });
  }
}
