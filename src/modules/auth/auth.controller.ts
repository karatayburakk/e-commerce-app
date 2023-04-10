import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninDto, SignupDto } from './dtos';
import { Token } from './interfaces';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signup(@Body() body: SignupDto): Promise<Token> {
    return this.authService.signup(body);
  }

  @Post('signin')
  signin(@Body() body: SigninDto): Promise<Token> {
    return this.authService.signin(body);
  }
}
