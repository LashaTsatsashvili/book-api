import { HttpException, HttpStatus, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { BookDTO, UpdateBookDTO } from "./dto/book.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { Book } from "../entities/book.entity";
import { User } from "../entities";
import { PageService } from "../page/page.service";
import { Page } from "../entities/pages.entity";
import { ReadingHistoryService } from "../reading-history/reading-history.service";

//TODO upsert-ზე რეპოების გადახედვა
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
    //TODO კონკრეტული იუზერის ისტორიის წამოღება
    const book = await this.repository.findOne({ where: { id }, relations: ["pages", "readingHistory"] });
    if (book) {
      return book;
    }
    throw new HttpException("წიგნი ვერ მოიძებნა", HttpStatus.NOT_FOUND);
  }

  async findAll(): Promise<Book[]> {
    return this.repository.find({ relations: ["pages"] });
  }

  async createOrUpdateHistory(bookId: number, page: number, userId: number) {
    const pageExists = await this.pageService.findPage(bookId, page);
    if (pageExists) {
      const update = await this.readingHistoryService.createOrUpdate(bookId, page, userId);
      if (update)
        throw new HttpException("ისტორია წარმატებით განახლდა", HttpStatus.CREATED);
    }
    throw new HttpException("ასეთი წიგნის გვერდი არ არსებობს", HttpStatus.FORBIDDEN);
  }

  async delete(id: number, user: User) {
    const isPublisher = await this.repository.exist({ where: { id, uploader: { id: user.id } } });
    if (isPublisher) {
      const deleteRecord = await this.repository.softDelete({ id });
      if (!deleteRecord) {
        throw new HttpException(`წიგნი ${id}-ით არ მოიძებნა`, HttpStatus.NOT_FOUND);
      }
      return { message: "წიგნი წარმატებით წაიშალა" };
    }
    throw new HttpException("არ გაქვთ ამ წიგნის წაშლის უფლება", HttpStatus.FORBIDDEN);
  }

  async create(bookData: BookDTO, user: User): Promise<Book> {
    const { title, author, pages } = bookData;
    const newBook = await this.repository.create({ author, title, uploader: user });
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const savedBook = await queryRunner.manager.save(Book, newBook);
      const newPages = pages.map(page => ({ ...page, book: savedBook }));
      await this.pageService.create(newPages, queryRunner);
      await queryRunner.commitTransaction();
      await queryRunner.release();
      return savedBook;
    } catch (error) {
      if (error.code === "ER_DUP_ENTRY") {
        await queryRunner.rollbackTransaction();
        throw new HttpException("ჩანაწერის დუბლიკატი. გთხოვთ, მიუთითოთ უნიკალური მნიშვნელობები", HttpStatus.INTERNAL_SERVER_ERROR);
      } else {
        await queryRunner.rollbackTransaction();
        console.log(error);
      }
    }
  }

  async update(bookData: UpdateBookDTO, user: User): Promise<Book> {
    const { id, title, author, pages } = bookData;
    const isPublisher = await this.repository.exist({ where: { id, uploader: { id: user.id } } });
    if (isPublisher) {
      const newBook = await this.repository.create({ id, author, title, uploader: user });
      const queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
      try {
        const savedBook = await queryRunner.manager.save(Book, newBook);
        const newPages = pages.map(page => ({ ...page, book: savedBook }));
        await this.pageService.updateArray(newPages, queryRunner);
        await queryRunner.commitTransaction();
        await queryRunner.release();
        return savedBook;
      } catch (error) {
        if (error.code === "ER_DUP_ENTRY") {
          await queryRunner.rollbackTransaction();
          throw new HttpException("ჩანაწერის დუბლიკატი. გთხოვთ, მიუთითოთ უნიკალური მნიშვნელობები", HttpStatus.INTERNAL_SERVER_ERROR);
        } else {
          await queryRunner.rollbackTransaction();
          console.log(error);
        }
      }
    }
    throw new HttpException("არ გაქვთ ამ წიგნის რედაქტირების უფლება", HttpStatus.FORBIDDEN);
  }

}
