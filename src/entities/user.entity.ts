import { Entity, Column } from 'typeorm';
import { Base } from "./base.entity";


@Entity('users')
export class User extends Base {
  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column()
  password: string;

  // @BeforeInsert()
  // async hashPassword() {
  //   // TODO: hash the password
  //   this.password = 'password';
  // }
}
