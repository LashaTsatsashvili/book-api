import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { LoginDto, RegisterDto } from "./dto/auth.dto";
import { UsersService } from "../users/users.service";
import { User } from "../entities";
import * as bcrypt from "bcryptjs";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {

  @Inject(JwtService)
  private readonly jwt: JwtService;

  @Inject(UsersService)
  private readonly usersService: UsersService;

  constructor(jwt: JwtService) {
    this.jwt = jwt;
  }

  async signIn(body: LoginDto) {
    const { email, password } = body;
    const user: User = await this.usersService.findOne(email);

    if (!user) {
      throw new HttpException("მომხმარებელი ვერ მოიძებნა", HttpStatus.NOT_FOUND);
    }

    const isPasswordValid: boolean = bcrypt.compareSync(password, user.password);

    if (!isPasswordValid) {
      throw new HttpException("მომხმარებელი ვერ მოიძებნა", HttpStatus.NOT_FOUND);
    }
    return {
      token: await this.generateToken(user)
    };
  }

  async signUp(body: RegisterDto) {
    const { firstName, lastName, email, password, phone }: RegisterDto = body;
    let user: User = await this.usersService.findOne(email);

    if (user) {
      throw new HttpException("ასეთი მომხმარებელი უკვე არსებობს", HttpStatus.CONFLICT);
    }
    user = new User();
    user.firstName = firstName;
    user.lastName = lastName;
    user.email = email;
    user.phone = phone;
    user.password = await this.encodePassword(password);
    return this.usersService.create(user);
  }

  async generateToken(user: User): Promise<string> {
    return this.jwt.sign({ id: user.id, email: user.email, phone: user.phone });
  }

  async encodePassword(password: string): Promise<string> {
    const salt: string = bcrypt.genSaltSync(10);

    return bcrypt.hashSync(password, salt);
  }
}
