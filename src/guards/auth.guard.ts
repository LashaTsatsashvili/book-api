import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = AuthGuard.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    //TODO get secret from config
    try {
      request["user"] = await this.jwtService.verifyAsync(
        token,
        {
          secret: "dev"
        }
      );
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private static extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(" ") ?? [];
    return type === "Bearer" ? token : undefined;
  }
}
