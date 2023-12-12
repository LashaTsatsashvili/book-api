import {
  IsArray,
  IsNotEmpty, IsNumber,
  IsString, ValidateNested
} from "class-validator";
import { Type } from "class-transformer";
import { IsUnique } from "../decorators/unique.decorator";
import { Page } from "../../entities";
import { ApiProperty } from "@nestjs/swagger";

export class pagesDTO {
  @ApiProperty({ description: "გვერდის კონტენტი" })
  @IsString()
  @IsNotEmpty({ message: "შეიყვანეთ ტექსტი" })
  content: string;

  @ApiProperty({ description: "გვერდის რიცხვი" })
  @IsNumber()
  @IsNotEmpty({ message: "შეიყვანეთ გვერდი " })
  pageNumber: number;

}

export class BookDTO {
  @ApiProperty({ description: "წიგნის სათაური" })
  @IsString()
  @IsNotEmpty({ message: "შეიყვანეთ წიგნის დასახელება" })
  public readonly title: string;

  @ApiProperty({ description: "წიგნის ავტორი" })
  @IsString()
  @IsNotEmpty({ message: "შეიყვანეთ წიგნის ავტორი" })
  public readonly author: string;

  @ApiProperty({
    isArray: true,
    type: pagesDTO,
    description: "წიგნის გვერდების მასივი"
  })
  @IsArray()
  @Type(() => pagesDTO)
  @ValidateNested({ each: true })
  @IsUnique("pageNumber")
  public readonly pages: Page[];
}

export class updatePagesDTO extends pagesDTO {
  @ApiProperty({ description: "გვერდის ID" })
  @IsNotEmpty({ message: "გვერდის განახლებისთვის საჭიროა id" })
  public readonly id: number;
}

export class UpdateBookDTO extends BookDTO {
  public readonly id?: number;

  @ApiProperty({
    isArray: true,
    type: updatePagesDTO,
    description: "წიგნის გვერდების განახლებული მასივი"
  })
  @IsArray()
  @Type(() => updatePagesDTO)
  @ValidateNested({ each: true })
  @IsUnique("pageNumber")
  @IsUnique("id")
  public readonly pages: Page[];
}

