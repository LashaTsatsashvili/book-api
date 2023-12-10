import { Trim } from "class-sanitizer";
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength
} from "class-validator";
import { Match } from "../decorators";
import { ApiProperty } from "@nestjs/swagger";

export class RegisterDto {
  @ApiProperty({
    type: "string",
    format: "email",
    required: true,
    description: "User email"
  })
  @Trim()
  @IsNotEmpty({ message: "მეილის ველი არ უნდა იყოს ცარიელი" })
  @IsEmail({}, { message: "შეიყვანეთ მეილი" })
  public readonly email: string;

  @ApiProperty({
    type: "string",
    required: true,
    description: "User password"
  })
  @IsNotEmpty({ message: "პაროლის ველი არ უნდა იყოს ცარიელი" })
  @IsString()
  @MinLength(8, { message: "პაროლი უნდა შეიცავდეს მინიმუმ 8 სიმბოლოს" })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      "პაროლი უნდა შეიცავდეს მინიმუმ ერთ დიდ ასოს,მინიმუმ ერთ პატარა ასოს და მინიმუმ ერთ რიცხვს ან მინიმუმ ერთ სიმბოლოს"
  })
  public readonly password: string;

  @ApiProperty({
    type: "string",
    required: true,
    description: "Confirm password"
  })
  @IsNotEmpty({ message: "უნდა გაიმეოროთ პაროლი" })
  @IsString()
  @MinLength(8, {
    message: "გამეორებული პაროლი უნდა შეიცავდეს მინიმუმ 8 სიმბოლოს"
  })
  @Match("password", { message: "გამეორებული პაროლი უნდა ემთხვეოდეს პაროლს" })
  public readonly confirm_password: string;

  @ApiProperty({
    type: "string",
    required: true,
    description: "User first name"
  })
  @IsString()
  @IsNotEmpty({ message: "უნდა შეიყვანოთ სახელი" })
  public readonly firstName: string;

  @ApiProperty({
    type: "string",
    required: true,
    description: "User last name"
  })
  @IsString()
  @IsNotEmpty({ message: "უნდა შეიყვანოთ გვარი" })
  public readonly lastName: string;

  @ApiProperty({
    type: "number",
    required: true,
    description: "User phone number"
  })
  @IsString()
  @IsOptional()
  @MinLength(9, { message: "ტელეფონის ნომერი უნდა შედგებოდეს 9 სიმბოლოსგან" })
  @MaxLength(9, { message: "ტელეფონის ნომერი უნდა შედგებოდეს 9 სიმბოლოსგან" })
  public readonly phone?: string;
}

export class LoginDto {
  @ApiProperty({
    type: "string",
    format: "email",
    required: true,
    description: "User email"
  })
  @Trim()
  @IsEmail()
  public readonly email: string;

  @ApiProperty({
    type: "string",
    required: true,
    description: "User password"
  })
  @IsString()
  public readonly password: string;
}
