import { Trim } from 'class-sanitizer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Match } from "../decorators";

export class RegisterDto {
  @Trim()
  @IsNotEmpty({ message: 'მეილის ველი არ უნდა იყოს ცარიელი' })
  @IsEmail({}, { message: 'შეიყვანეთ მეილი' })
  public readonly email: string;

  @IsNotEmpty({ message: 'პაროლის ველი არ უნდა იყოს ცარიელი' })
  @IsString()
  @MinLength(8, { message: 'პაროლი უნდა შეიცავდეს მინიმუმ 8 სიმბოლოს' })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'პაროლი უნდა შეიცავდეს მინიმუმ ერთ დიდ ასოს,მინიმუმ ერთ პატარა ასოს და მინიმუმ ერთ რიცხვს ან მინიმუმ ერთ სიმბოლოს',
  })
  public readonly password: string;

  @IsNotEmpty({ message: 'უნდა გაიმეოროთ პაროლი' })
  @IsString()
  @MinLength(8, {
    message: 'გამეორებული პაროლი უნდა შეიცავდეს მინიმუმ 8 სიმბოლოს',
  })
  @Match('password', { message: 'გამეორებული პაროლი უნდა ემთხვეოდეს პაროლს' })
  public readonly confirm_password: string;

  @IsString()
  @IsNotEmpty({ message: 'უნდა შეიყვანოთ სახელი' })
  public readonly firstName?: string;

  @IsString()
  @IsNotEmpty({ message: 'უნდა შეიყვანოთ გვარი' })
  public readonly lastName?: string;

  @IsString()
  @IsOptional()
  @MinLength(9, { message: 'ტელეფონის ნომერი უნდა შედგებოდეს 9 სიმბოლოსგან' })
  @MaxLength(9, { message: 'ტელეფონის ნომერი უნდა შედგებოდეს 9 სიმბოლოსგან' })
  public readonly phone?: string;
}

export class LoginDto {
  @Trim()
  @IsEmail()
  public readonly email: string;

  @IsString()
  public readonly password: string;
}
