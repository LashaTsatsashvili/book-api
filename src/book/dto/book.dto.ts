import {
  IsArray,
  IsNotEmpty, IsNumber,
  IsString, ValidateNested
} from "class-validator";
import { Type } from "class-transformer";
import { IsUnique } from "../decorators/unique.decorator";
import { Page } from "../../entities/pages.entity";

export class BookDTO {
  @IsString()
  @IsNotEmpty({ message: "შეიყვანეთ წიგნის დასახელება" })
  public readonly title: string;

  @IsString()
  @IsNotEmpty({ message: "შეიყვანეთ წიგნის ავტორი" })
  public readonly author: string;

  @IsArray()
  @Type(() => pagesDTO)
  @ValidateNested({ each: true })
  @IsUnique("pageNumber")
  public readonly pages: Page[];
}

export class pagesDTO {
  @IsString()
  @IsNotEmpty({ message: "შეიყვანეთ ტექსტი" })
  content: string;

  @IsNumber()
  @IsNotEmpty({ message: "შეიყვანეთ გვერდი " })
  pageNumber: number;

}
export class UpdateBookDTO extends BookDTO {
  @IsNotEmpty({ message: "წიგნის განახლებისთვის საჭიროა id" })
  public readonly id:number

  @IsArray()
  @Type(() => updatePagesDTO)
  @ValidateNested({ each: true })
  @IsUnique("pageNumber")
  @IsUnique("id")
  public readonly pages: Page[];
}

export class updatePagesDTO extends pagesDTO{
  @IsNotEmpty({ message: "გვერდის განახლებისთვის საჭიროა id" })
  public readonly id:number
}
