import { Controller, Post, Body, UseInterceptors, ClassSerializerInterceptor, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto, RegisterDto } from "./dto/auth.dto";
import { ApiBody, ApiOperation, ApiResponse } from "@nestjs/swagger";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {
  }

  @ApiOperation({ summary: "User Registration" })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({
    status: 201,
    description: "იუზერის წარმატებული რეგისტრაცია",
    schema: {
      properties: {
        id: { type: "number", example: 1 },
        firstName: { type: "string", example: "John" },
        lastName: { type: "string", example: "Doe" },
        email: { type: "string", example: "john.doe@example.com" },
        phone: { type: "string", example: "1234567890" },
        createdAt: { type: "date", example: "2023-12-08T18:10:56.176Z" },
        updatedAt: { type: "date", example: "2023-12-08T18:10:56.176Z" },
        deletedAt: { example: "null" }
      }
    }
  })
  @ApiResponse({
    status: 400, description: "ცუდი რექვესტი", schema: {
      properties: {
        statusCode: { type: "number", example: 400 },
        message: { type: "array", example: ["ვალიდაციის შეცდომა"] },
        error: { type: "string", example: "Bad Request" }
      }
    }
  })
  @ApiResponse({ status: 409, description: "ასეთი მომხმარებელი უკვე არსებობს" })
  @Post("signup")
  @UseInterceptors(ClassSerializerInterceptor)
  signUp(@Body() body: RegisterDto): Promise<any> {
    return this.authService.signUp(body);
  }

  @ApiOperation({ summary: "User Login" })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: "მომხმარებლის წარმატებული ავტორიზაცია",
    schema: {
      properties: {
        token: { type: "string", example: "ტოკენი" }
      }
    }
  })
  @ApiResponse({
    status: 400, description: "ცუდი რექვესტი", schema: {
      properties: {
        statusCode: { type: "number", example: 400 },
        message: { type: "array", example: ["ვალიდაციის შეცდომა"] },
        error: { type: "string", example: "Bad Request" }
      }
    }
  })
  @ApiResponse({ status: 404, description: "მომხმარებელი ვერ მოიძებნა" })
  @Post("signin")
  signIn(@Body() body: LoginDto) {
    return this.authService.signIn(body);
  }

}
