import { Body, Controller, Get, Post, Put, UseGuards, Request, UseFilters, Param, Delete } from "@nestjs/common";
import { BookService } from "./book.service";
import { AuthGuard } from "../guards";
import { BookDTO, UpdateBookDTO } from "./dto/book.dto";
import { MySQLExceptionFilter } from "../filters/mysql-exception.filter";
import { ApiBearerAuth, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiResponse } from "@nestjs/swagger";

//TODO გარდის ყველაზე დადება
@Controller("books")
@UseFilters(MySQLExceptionFilter)
@ApiBearerAuth("JWT-auth")
@UseGuards(AuthGuard)
export class BookController {
  constructor(private readonly bookService: BookService) {
  }

  @ApiResponse({
    status: 200,
    description: "კონკრეტული წიგნის წამოღება.",
    schema: {
      type: "object",
      properties: {
        id: { type: "number" },
        title: { type: "string" },
        author: { type: "string" },
        createdAt: { type: "string" },
        updatedAt: { type: "string" },
        deletedAt: { type: "string" },
        pages: {
          type: "array", items: {
            type: "object", example: {
              id: "number",
              content: "string",
              pageNumber: "number"
            }
          }
        }
      }
    }
  })
  @ApiResponse({
    status: 404,
    description: "წიგნი ვერ მოიძებნა.",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "number", example: 404 },
        message: { type: "string", example: "message" }
      }
    }
  })
  @Get(":id")
  getOne(@Param("id") id: number) {
    return this.bookService.findOne(id);
  }

  @ApiResponse({
    status: 200,
    description: "ყველა წიგნის წამოღება",
    schema: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "number" },
          title: { type: "string" },
          author: { type: "string" },
          createdAt: { type: "string" },
          updatedAt: { type: "string" },
          deletedAt: { type: "string" },
          pages: {
            type: "array", items: {
              type: "object", example: {
                id: "number",
                content: "string",
                pageNumber: "number"
              }
            }
          }
        }
      }
    }
  })
  @Get()
  getAll() {
    return this.bookService.findAll();
  }

  @ApiResponse({
    status: 201,
    description: "ახალი წიგნის შექმნა",
    schema: {
      type: "object",
      properties: {
        id: { type: "number" },
        title: { type: "string" },
        author: { type: "string" },
        createdAt: { type: "string" },
        updatedAt: { type: "string" },
        deletedAt: { example: null },
        uploader: {
          properties: {
            id: { type: "number" },
            email: { type: "string" },
            phone: { type: "string" }
          }
        }
      }
    }
  })
  @ApiResponse({
    status: 400, description: "ცუდი რექვესტი", schema: {
      properties: {
        statusCode: { type: "number", example: 400 },
        message: { type: "array", example: ["ვალიდაციის შეცდომა"] },
        error: { type: "string", example: "Bad Request" }
      }
    }
  })
  @Post()
  create(@Request() req, @Body() book: BookDTO) {
    return this.bookService.create(book, req.user);
  }

  @ApiResponse({
    status: 200,
    description: "ახალი წიგნის შექმნა",
    schema: {
      type: "object",
      properties: {
        id: { type: "number" },
        title: { type: "string" },
        author: { type: "string" },
        updatedAt: { type: "string" },
        deletedAt: { example: null },
        uploader: {
          properties: {
            id: { type: "number" },
            email: { type: "string" },
            phone: { type: "string" }
          }
        }
      }
    }
  })
  @ApiResponse({
    status: 403, description: "ცუდი რექვესტი", schema: {
      properties: {
        statusCode: { type: "number", example: 403 },
        message: { type: "string", example: "message" }
      }
    }
  })
  @ApiResponse({
    status: 400, description: "ცუდი რექვესტი", schema: {
      properties: {
        statusCode: { type: "number", example: 400 },
        message: { type: "array", example: ["ვალიდაციის შეცდომა"] },
        error: { type: "string", example: "Bad Request" }
      }
    }
  })
  @ApiResponse({
    status: 500, description: "ცუდი რექვესტი", schema: {
      properties: {
        statusCode: { type: "number", example: 500 },
        message: { type: "string", example: "message" }
      }
    }
  })
  @Put()
  update(@Request() req, @Body() book: UpdateBookDTO) {
    return this.bookService.update(book, req.user);
  }

  @ApiResponse({
    status: 200,
    description: "Delete a book",
    schema: {
      type: "object",
      properties: {
        message: { type: "string" }
      }
    }
  })
  @ApiResponse({
    status: 404,
    description: "არ გაქვთ ამ წიგნის წაშლის უფლება",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "number", example: 404 },
        message: { type: "string", example: "message" }
      }
    }
  })
  @Delete(":id")
  delete(@Request() req, @Param("id") id: number) {
    return this.bookService.delete(id, req.user);
  }

  @ApiResponse({
    status: 200,
    description: "Create or update reading history for a book",
    schema: {
      type: "object",
      properties: {
        message: { type: "string" }
      }
    }
  })
  @ApiResponse({
    status: 403, description: "ცუდი რექვესტი", schema: {
      properties: {
        statusCode: { type: "number", example: 403 },
        message: { type: "string", example: "message" }
      }
    }
  })
  @Post("history/:bookId/:page")
  createOrUpdateHistory(@Request() req, @Param("bookId") bookId: number, @Param("page") page: number) {
    return this.bookService.createOrUpdateHistory(bookId, page, req.user.id);
  }
}
