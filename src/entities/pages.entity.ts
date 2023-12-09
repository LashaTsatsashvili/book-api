import { Entity, Column, ManyToOne, Index, Unique } from "typeorm";
import { Base } from "./base.entity";
import { Book } from "./book.entity";

@Entity("pages")
@Unique(['book', 'pageNumber'])
// @Index(['book', 'pageNumber'], { unique: true })
export class Page extends Base {
  @Column()
  content: string;

  @ManyToOne(() => Book, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE"
  })
  book: Book;

  @Column()
  pageNumber: number;
}
