import { Controller, Post, Body, UseInterceptors, ClassSerializerInterceptor, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto, RegisterDto } from "./dto/auth.dto";
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { signIn, signUpResponse } from "./swagger/swagger-responses";

@ApiTags('auth')
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {
  }

  @ApiOperation({ summary: "მომხმარებლის რეგისტრაცია" })
  @ApiBody({ type: RegisterDto })
  @ApiResponse(signUpResponse.created)
  @ApiResponse(signUpResponse.badRequest)
  @ApiResponse(signUpResponse.conflict)
  @Post("signup")
  @UseInterceptors(ClassSerializerInterceptor)
  signUp(@Body() body: RegisterDto): Promise<any> {
    return this.authService.signUp(body);
  }

  @ApiOperation({ summary: "ავტორიზაცია" })
  @ApiBody({ type: LoginDto })
  @ApiResponse(signIn.success)
  @ApiResponse(signIn.badRequest)
  @ApiResponse(signIn.notFound)
  @Post("signin")
  signIn(@Body() body: LoginDto) {
    return this.authService.signIn(body);
  }

}
