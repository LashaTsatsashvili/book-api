import { Entity, Column, OneToMany } from "typeorm";
import { Base } from "./base.entity";
import { Book } from "./book.entity";
import { ReadingHistory } from "./reading-history.entity";

@Entity("users")
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

  @OneToMany(() => Book, (book) => book.uploader)
  books: Book[];

  @OneToMany(() => ReadingHistory, (readingHistory) => readingHistory.user)
  readingHistory: ReadingHistory[];
}
