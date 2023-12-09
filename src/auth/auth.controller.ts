import { Controller, Post, Body, UseInterceptors, ClassSerializerInterceptor, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto, RegisterDto } from "./dto/auth.dto";
import { AuthGuard } from "../guards";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {
  }

  @Post('signup')
  @UseInterceptors(ClassSerializerInterceptor)
  signUp(@Body() body: RegisterDto): Promise<any> {
    return this.authService.signUp(body);
  }


  @Post('signin')
  signIn(@Body() body : LoginDto ) {
    return this.authService.signIn(body);
  }

}
