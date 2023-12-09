import { Entity, Column, OneToMany, ManyToOne } from "typeorm";
import { Base } from "./base.entity";
import { Page } from "./pages.entity";
import { User } from "./user.entity";
import { ReadingHistory } from "./reading-history.entity";

@Entity("books")
export class Book extends Base {
  @Column()
  title: string;

  @Column()
  author: string;

  @ManyToOne(() => User)
  uploader: User;

  @OneToMany(() => Page, (page) => page.book)
  pages: Page[];

  @OneToMany(()=>ReadingHistory, (readingHistory)=>readingHistory.book)
  readingHistory : ReadingHistory[];
}
