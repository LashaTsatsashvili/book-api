import { Body, Controller, Get, Post, Put, UseGuards, Request, UseFilters, Param, Delete } from "@nestjs/common";
import { BookService } from "./book.service";
import { AuthGuard } from "../guards";
import { BookDTO, UpdateBookDTO } from "./dto/book.dto";
import { MySQLExceptionFilter } from "../filters/mysql-exception.filter";

@Controller("books")
@UseFilters(MySQLExceptionFilter)
export class BookController {
  constructor(private readonly bookService: BookService) {
  }

  @UseGuards(AuthGuard)
  @Get(":id")
  getOne(@Param("id") id: number) {
    console.log(id);
    return this.bookService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @Get()
  getAll() {
    return this.bookService.findAll();
  }

  @UseGuards(AuthGuard)
  @Post()
  create(@Request() req, @Body() book: BookDTO) {
    return this.bookService.create(book, req.user);
  }

  @UseGuards(AuthGuard)
  @Put()
  update(@Request() req, @Body() book: UpdateBookDTO) {
    return this.bookService.update(book, req.user);
  }

  @UseGuards(AuthGuard)
  @Delete(":id")
  delete(@Request() req, @Param("id") id: number) {
    return this.bookService.delete(id, req.user);
  }

  @UseGuards(AuthGuard)
  @Post("history/:bookId/:page")
  createOrUpdateHistory(@Request() req, @Param("bookId") bookId: number, @Param("page") page: number) {
    return this.bookService.createOrUpdateHistory(bookId, page, req.user.id);
  }
}
