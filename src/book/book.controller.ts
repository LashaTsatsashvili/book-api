import { Body, Controller, Get, Post, Put, UseGuards, Request, UseFilters, Param, Delete } from "@nestjs/common";
import { BookService } from "./book.service";
import { AuthGuard } from "../guards";
import { BookDTO, UpdateBookDTO } from "./dto/book.dto";
import { MySQLExceptionFilter } from "../filters/mysql-exception.filter";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import {
  createOrUpdateHistoryResponse,
  createResponses,
  deleteResponse,
  getAllResponses,
  getOneResponses,
  updateResponse
} from "./swagger/book.swagger.responses";

@Controller("books")
@UseFilters(MySQLExceptionFilter)
@ApiBearerAuth("JWT-auth")
@UseGuards(AuthGuard)
@ApiTags("books")
export class BookController {
  constructor(private readonly bookService: BookService) {
  }

  @ApiOperation({ summary: "კონკერტული წიგნის წამოღება" })
  @ApiResponse(getOneResponses.success)
  @ApiResponse(getOneResponses.notFound)
  @Get(":id")
  getOne(@Param("id") id: number) {
    return this.bookService.findOne(id);
  }

  @ApiOperation({ summary: "ყველა წიგნის წამოღება" })
  @ApiResponse(getAllResponses.success)
  @Get()
  getAll() {
    return this.bookService.findAll();
  }

  @ApiOperation({ summary: "წიგნის შექმნა" })
  @ApiResponse(createResponses.created)
  @ApiResponse(createResponses.badRequest)
  @Post()
  create(@Request() req, @Body() book: BookDTO) {
    return this.bookService.create(book, req.user);
  }

  @ApiOperation({ summary: "წიგნის განახლება" })
  @ApiResponse(updateResponse.success)
  @ApiResponse(updateResponse.forbidden)
  @ApiResponse(updateResponse.badRequest)
  @ApiResponse(updateResponse.internalServerError)
  @Put()
  update(@Request() req, @Body() book: UpdateBookDTO) {
    return this.bookService.update(book, req.user);
  }

  @ApiOperation({ summary: "წიგნის წაშლა" })
  @ApiResponse(deleteResponse.success)
  @ApiResponse(deleteResponse.forbidden)
  @Delete(":id")
  delete(@Request() req, @Param("id") id: number) {
    return this.bookService.delete(id, req.user);
  }

  @ApiOperation({ summary: "წიგნის ისტორიის განახლება" })
  @ApiResponse(createOrUpdateHistoryResponse.success)
  @ApiResponse(createOrUpdateHistoryResponse.forbidden)
  @Post("history/:bookId/:page")
  createOrUpdateHistory(@Request() req, @Param("bookId") bookId: number, @Param("page") page: number) {
    return this.bookService.createOrUpdateHistory(bookId, page, req.user.id);
  }
}
