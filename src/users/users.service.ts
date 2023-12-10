import { Injectable } from "@nestjs/common";
import { User } from "../entities";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class UsersService {

  @InjectRepository(User)
  private readonly repository: Repository<User>;

  create(user: User) {
    return this.repository.save(user);
  }

  findOne(email: string) {
    return this.repository.findOne({ where: { email } });
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
