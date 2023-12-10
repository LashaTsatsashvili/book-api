import { Entity, Column, ManyToOne, Unique } from "typeorm";
import { Base } from "./base.entity";
import { Book } from "./book.entity";
import { User } from "./user.entity";

@Entity("reading_history")
// @Unique(["user", "book"])
export class ReadingHistory extends Base {

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => Book)
  book: Book;

  @Column()
  lastReadPage: number;
}
