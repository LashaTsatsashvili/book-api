import { Test, TestingModule } from "@nestjs/testing";
import * as request from "supertest";
import { AppModule } from "../src/app.module";
import { Repository } from "typeorm";
import { Book, Page, User } from "../src/entities";
import { ValidationPipe } from "@nestjs/common";
import dataSource from "../typeOrm.config";
import * as bcrypt from "bcryptjs";
import { JwtModule } from "@nestjs/jwt";
import { JwtService } from "@nestjs/jwt";

describe("BookController (e2e)", () => {
  let app;
  let jwtService: JwtService;
  let userRepository: Repository<User>;
  let authToken: string;
  let newUser: User;
  let bookRepository: Repository<Book>;
  let pagesRepository: Repository<Page>;
  let savedBook: Book;
  let savedPages: Page[];
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        JwtModule.register({
          global: true,
          secret: "dev",
          signOptions: {
            expiresIn: "365d"
          }
        })
      ]
    })
      .compile();
    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();
    jwtService = app.get(JwtService);
    await dataSource.initialize();
    userRepository = await dataSource.getRepository(User);
    const user = await userRepository.create({
      firstName: "firstName",
      lastName: "lastName",
      email: "unitTestUser@test.com",
      password: "password123!",
      phone: "123456789"
    });
    const salt: string = bcrypt.genSaltSync(10);
    user.password = await bcrypt.hashSync(user.password, salt);
    newUser = await userRepository.save(user);
    authToken = jwtService.sign({ id: newUser.id, email: newUser.email });
    bookRepository = await dataSource.getRepository(Book);
    pagesRepository = await dataSource.getRepository(Page);
    const book = await bookRepository.create({ title: "title", author: "author", uploader: newUser });
    const pages = pagesRepository.create([{ pageNumber: 1, content: "some content" }, {
      pageNumber: 2,
      content: "some content also"
    }]);
    savedBook = await bookRepository.save(book);
    const newPages = pages.map(page => ({ ...page, book: savedBook }));
    savedPages = await pagesRepository.save(newPages);
  });
  describe("/books/:id (GET)", () => {
    it("get book success ", async () => {
      return request(app.getHttpServer())
        .get(`/books/${savedBook.id}`)
        .set("Authorization", `Bearer ${authToken}`)
        .expect((res) => {
          expect(res.body).toEqual(expect.objectContaining(
            {
              id: expect.any(Number),
              title: expect.any(String),
              author: expect.any(String),
              deletedAt: null,
              createdAt: expect.any(String),
              updatedAt: expect.any(String),
              pages: expect.arrayContaining([
                expect.objectContaining(
                  {
                    id: expect.any(Number),
                    content: expect.any(String),
                    pageNumber: expect.any(Number)
                  }
                )
              ])
            }));
        }).expect(200);
    });
    it("get book not found ", async () => {
      return request(app.getHttpServer())
        .get(`/books/${savedBook.id + 10000000000}`)
        .set("Authorization", `Bearer ${authToken}`)
        .expect((res) => {
          expect(res.body).toEqual(expect.objectContaining(
            {
              statusCode: expect.any(Number),
              message: expect.any(String)
            }));
        }).expect(404);
    });
  });
  describe("/books/ (GET)", () => {
    it("get all books success", () => {
      return request(app.getHttpServer())
        .get("/books")
        .set("Authorization", `Bearer ${authToken}`)
        .expect((res) => {
          expect(res.body).toEqual(
            expect.arrayContaining([
              expect.objectContaining(
                {
                  id: expect.any(Number),
                  title: expect.any(String),
                  author: expect.any(String),
                  deletedAt: null,
                  createdAt: expect.any(String),
                  updatedAt: expect.any(String),
                  pages: expect.arrayContaining([
                    expect.objectContaining(
                      {
                        id: expect.any(Number),
                        content: expect.any(String),
                        pageNumber: expect.any(Number)
                      }
                    )
                  ])
                })]));
        }).expect(200);
    });
  });
  describe("/books/ (DELETE)", () => {
    it("delete book success", async () => {
      return request(app.getHttpServer())
        .delete(`/books/${savedBook.id}`)
        .set("Authorization", `Bearer ${authToken}`)
        .expect((res) => {
          expect(res.body).toEqual(expect.objectContaining(
            {
              message: expect.any(String)
            }));
        }).expect(200);
    });
    it("delete book permission", async () => {
      return request(app.getHttpServer())
        .delete(`/books/${savedBook.id + 1000000000}`)
        .set("Authorization", `Bearer ${authToken}`)
        .expect((res) => {
          expect(res.body).toEqual(expect.objectContaining(
            {
              statusCode: expect.any(Number),
              message: expect.any(String)
            }));
        }).expect(403);
    });

  });
  describe("/books/ (POST)", () => {
    it("add new book success ", async () => {
      const response = await request(app.getHttpServer())
        .post(`/books`)
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          title: "new title",
          author: "new authir",
          uploader: newUser,
          pages: [
            {
              content: "string",
              pageNumber: 1
            }
          ]
        })
        .expect((res) => {
          expect(res.body).toEqual(expect.objectContaining(
            {
              id: expect.any(Number),
              title: expect.any(String),
              author: expect.any(String),
              deletedAt: null,
              createdAt: expect.any(String),
              updatedAt: expect.any(String),
              uploader: expect.objectContaining(
                {
                  id: expect.any(Number),
                  email: expect.any(String)
                }
              )

            }));
        }).expect(201);
      await bookRepository.delete({ id: response.body.id });
    });
    it("add new book badRequest", () => {
      return request(app.getHttpServer())
        .post(`/books`)
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          author: "new authir",
          uploader: newUser,
          pages: [
            {
              content: "string",
              pageNumber: 1
            }
          ]
        })
        .expect((res) => {
          expect(res.body).toEqual(
            expect.objectContaining({
              statusCode: expect.any(Number),
              message: expect.any(Array),
              error: expect.any(String)
            })
          );
        }).expect(400);
    });
  });
  describe("/books/ (PUT)", () => {
    it("add new book success", () => {
      return request(app.getHttpServer())
        .put(`/books/${savedBook.id}`)
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          author: "new authir",
          title: "updated title",
          pages: [
            {
              id: savedPages[0].id,
              content: "string",
              pageNumber: 1
            }
          ]
        }).expect((res) => {
          expect(res.body).toEqual(expect.objectContaining(
            {
              id: expect.any(Number),
              title: expect.any(String),
              author: expect.any(String),
              deletedAt: null,
              updatedAt: expect.any(String),
              uploader: expect.objectContaining(
                {
                  id: expect.any(Number),
                  email: expect.any(String)
                }
              )

            }));
        }).expect(200);
    });
    it("add new book bad request", () => {
      return request(app.getHttpServer())
        .put(`/books/${savedBook.id}`)
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          author: "new authir",
          pages: [
            {
              id: savedPages[0].id,
              content: "string",
              pageNumber: 1
            }
          ]
        })
        .expect((res) => {
          expect(res.body).toEqual(
            expect.objectContaining({
              statusCode: expect.any(Number),
              message: expect.any(Array),
              error: expect.any(String)
            })
          );
        }).expect(400);
    });
    it("add new book bad permission", async () => {
      const user = await userRepository.create({
        firstName: "firstName",
        lastName: "lastName",
        email: "unitTestUser@test.com",
        password: "password123!",
        phone: "123456789"
      });
      const salt: string = bcrypt.genSaltSync(10);
      user.password = await bcrypt.hashSync(user.password, salt);
      const newUser = await userRepository.save(user);
      const book = await bookRepository.create({ title: "title", author: "author", uploader: newUser });
      const pages = pagesRepository.create([{ pageNumber: 1, content: "some content" }, {
        pageNumber: 2,
        content: "some content also"
      }]);
      const dbdBook = await bookRepository.save(book);
      const newPages = pages.map(page => ({ ...page, book: dbdBook }));
      const dbPages = await pagesRepository.save(newPages);
      request(app.getHttpServer())
        .put(`/books/${dbdBook.id}`)
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          id: dbdBook.id,
          author: "new authir",
          title: "update title",
          pages: [
            {
              id: dbPages[0].id,
              content: "string",
              pageNumber: 1
            }
          ]
        })
        .expect((res) => {
          expect(res.body).toEqual(
            expect.objectContaining({
              statusCode: expect.any(Number),
              message: expect.any(String)
            })
          );
        }).expect(403);
      await bookRepository.delete({ id: dbdBook.id });
      await userRepository.delete({ id: newUser.id });
    });
    it("add new book internal server error", () => {
      return request(app.getHttpServer())
        .put(`/books/${savedBook.id}`)
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          author: "new authir",
          title: "updated title",
          pages: [
            {
              id: savedPages[0].id,
              content: "string",
              pageNumber: 2
            },
          ]
        }).expect((res) => {
          expect(res.body).toEqual(expect.objectContaining(
            {
              statusCode: expect.any(Number),
              message: expect.any(String)
            }));
        }).expect(500);
    });
  });
  describe("/books/history/:bookId/:pageNumber (POST)", () => {
    it("update history success", () => {
      return request(app.getHttpServer())
        .post(`/books/history/${savedBook.id}/${savedPages[0].pageNumber}`)
        .set("Authorization", `Bearer ${authToken}`)
        .expect((res) => {
          expect(res.body).toEqual(
            expect.objectContaining({
              message: expect.any(String)
            })
          );
        }).expect(201);
    });
    it("update history forbidden", () => {
      return request(app.getHttpServer())
        .post(`/books/history/${savedBook.id + 1000000}/${savedPages[0].pageNumber}`)
        .set("Authorization", `Bearer ${authToken}`)
        .expect((res) => {
          expect(res.body).toEqual(
            expect.objectContaining({
              message: expect.any(String)
            })
          );
        }).expect(403);
    });
  });
  afterEach(async () => {
    await bookRepository.delete({ id: savedBook.id });
    await userRepository.delete({ id: newUser.id });
    await dataSource.destroy();
  });
  afterAll(async () => {
    await app.close();
  });
});
