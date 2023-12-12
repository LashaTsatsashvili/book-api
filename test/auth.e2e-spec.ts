import { Test, TestingModule } from "@nestjs/testing";
import * as request from "supertest";
import { AppModule } from "../src/app.module";
import dataSource from "../typeOrm.config";
import { User } from "../src/entities";
import * as bcrypt from "bcryptjs";
import { ValidationPipe } from "@nestjs/common";
import { Repository } from "typeorm";

describe("AuthController (e2e)", () => {
  let app;
  let userRepository: Repository<User>;
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();
    await dataSource.initialize();
    userRepository = await dataSource.getRepository(User);
  });

  describe("/auth/signup (POST", () => {
    it("user registration success", async () => {
      const res = await request(app.getHttpServer())
        .post("/auth/signup")
        .send({
          firstName: "testName",
          lastName: "TestLastname",
          email: "test.test@test.com",
          password: "Password123!",
          confirm_password: "Password123!",
          phone: "123456789"
        })
        .expect((res) => {
          expect(res.body).toEqual(expect.objectContaining(
            {
              id: expect.any(Number),
              firstName: expect.any(String),
              lastName: expect.any(String),
              email: expect.any(String),
              phone: expect.any(String),
              deletedAt: null,
              createdAt: expect.any(String),
              updatedAt: expect.any(String)

            }));
        }).expect(201);
      await userRepository.delete({ id: res.body.id });
    });
    it("user registration badRequest", () => {
      return request(app.getHttpServer())
        .post("/auth/signup")
        .send({
          firstName: "testName",
          lastName: "TestLastname",
          email: "test.testtest.com",
          password: "password123!",
          phone: "123456789"
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
    it("user registration conflict", async () => {
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
      await request(app.getHttpServer())
        .post("/auth/signup")
        .send({
          firstName: "testName",
          lastName: "TestLastname",
          email: "unitTestUser@test.com",
          password: "Password123!",
          confirm_password: "Password123!",
          phone: "123456789"
        })
        .expect((res) => {
          expect(res.body).toEqual(expect.objectContaining(
            {
              message: expect.any(String),
              statusCode: expect.any(Number)
            }));
        }).expect(409);
      await userRepository.delete({ id: newUser.id });
    });
  });

  describe("/auth/signin (POST)", () => {
    let newUser: User;
    beforeEach(async () => {
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
    });
    it("user signin succes", async () => {
      return request(app.getHttpServer())
        .post("/auth/signin")
        .send({
          email: newUser.email,
          password: "password123!"
        })
        .expect((res) => {
          expect(res.statusCode).toBe(201);
          expect(res.body).toEqual(expect.objectContaining({ token: expect.any(String) }));
        });
    });
    it("user signin bad request", async () => {
      return request(app.getHttpServer())
        .post("/auth/signin")
        .send({
          password: "password123!"
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
    it("user signin user not found", async () => {
      return request(app.getHttpServer())
        .post("/auth/signin")
        .send({
          email: newUser.email,
          password: "pa1ssword123!"
        })
        .expect((res) => {
          expect(res.body).toEqual(
            expect.objectContaining({
              statusCode: expect.any(Number),
              message: expect.any(String)
            })
          );
        }).expect(404);
    });
    afterEach(async () => {
      await userRepository.delete({ id: newUser.id });
    });
  });

  afterEach(async () => {
    await dataSource.destroy();
  });
  afterAll(async () => {
    await app.close();
  });
});
