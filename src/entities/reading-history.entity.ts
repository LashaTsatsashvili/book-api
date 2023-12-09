import { Entity, Column, ManyToOne, Index, Unique } from "typeorm";
import { Base } from "./base.entity";
import { Book } from "./book.entity";
import { User } from "./user.entity";

@Entity("reading_history")
export class ReadingHistory extends Base {

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => Book)
  book: Book;

  @Column({ default: null })
  lastReadPage: number;
}
