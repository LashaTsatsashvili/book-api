import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, In } from "typeorm";
import { Page } from "../entities/pages.entity";

@Injectable()
export class PageService {
  @InjectRepository(Page)
  private readonly repository: Repository<Page>;

  async create(pages: any, queryRunner): Promise<Page> {
    return queryRunner.manager.update(Page, pages);
  }

  async findIds(ids: number[]): Promise<number[]> {
    return this.repository.findBy({ id: In(ids) }).then((pages) => pages.map((page) => page.id));
  }

  async findPage(bookId: number, page: number): Promise<boolean> {
    return this.repository.exist({ where: { book: { id: bookId }, pageNumber: page } });
  }
}
