import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { BookDTO, UpdateBookDTO } from "./dto/book.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { Book } from "../entities/book.entity";
import { User } from "../entities";
import { PageService } from "../page/page.service";
import { Page } from "../entities/pages.entity";
import { ReadingHistoryService } from "../reading-history/reading-history.service";

@Injectable()
export class BookService {
  @InjectRepository(Book)
  private readonly repository: Repository<Book>;
  @Inject(PageService)
  private readonly pageService: PageService;

  @Inject(ReadingHistoryService)
  private readonly readingHistoryService: ReadingHistoryService;

  constructor(private dataSource: DataSource) {
  }

  async findOne(id: number): Promise<Book> {
    return this.repository.findOne({ where: { id }, relations: ["pages"] });
  }

  async findAll(): Promise<Book[]> {
    return this.repository.find({ relations: ["pages"] });
  }

  async createOrUpdateHistory(bookId: number, page: number, userId: number) {
    const pageExists = await this.pageService.findPage(bookId, page);
    if (pageExists) {
      return this.readingHistoryService.createOrUpdate(bookId, page, userId);
    }
    throw new HttpException("ასეთი წიგნის გვერდი არ არსებობს", HttpStatus.FORBIDDEN);
  }

  async delete(id: number, user: User) {
    const isPublisher = await this.repository.exist({ where: { id, uploader: { id: user.id } } });
    if (isPublisher) {
      return this.repository.softDelete({ id });
    }
    throw new HttpException("არ გაქვთ ამ წიგნის წაშლის უფლება", HttpStatus.FORBIDDEN);
  }

  async create(bookData: BookDTO, user: User): Promise<Book> {
    const { title, author, pages } = bookData;
    const newBook = await this.repository.create({ author, title, uploader: user });
    return this.save(newBook, pages);
  }

  async update(bookData: UpdateBookDTO, user: User): Promise<Book> {
    const { id, title, author, pages } = bookData;
    const isPublisher = await this.repository.exist({ where: { id, uploader: { id: user.id } } });
    if (isPublisher) {
      const ids = pages.map(page => page.id);
      const pageIds = await this.pageService.findIds(ids);
      if (ids.length != pageIds.length) {
        const differenceSet = ids.filter((id) => !pageIds.includes(id));
        throw new HttpException(`გვერდები ამ Id-ით(ებით) ${[...differenceSet]} არ არსებოს`, HttpStatus.FORBIDDEN);
      }
      const newBook = await this.repository.create({ id, author, title, uploader: user });
      return this.save(newBook, pages);
    }
    throw new HttpException("არ გაქვთ ამ წიგნის რედაქტირების უფლება", HttpStatus.FORBIDDEN);
  }

  private async save(book: Book, pages: Page[]): Promise<Book> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    const savedBook = await queryRunner.manager.save(Book, book);
    const newPages = pages.map(page => ({ ...page, book: savedBook }));
    await this.pageService.create(newPages, queryRunner);
    await queryRunner.commitTransaction();
    await queryRunner.release();
    return savedBook;
  }

}
