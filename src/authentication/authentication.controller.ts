import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { SignUpDto } from './dto/signup.dto';
import { LogInDto } from './dto/login.dto';
import { JwtAuthGuard } from '../jwt/jwt-auth.guard';

@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly userService: AuthenticationService) {}

  @Post('register')
  SignUp(@Body() singUpDto: SignUpDto): Promise<{ token: string }> {
    return this.userService.signup(singUpDto);
  }

  @Post('login')
  LogIn(@Body() loginDto: LogInDto): Promise<{ token: string }> {
    return this.userService.logIn(loginDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  GetProfie(@Request() req) {
    return req.user;
  }
}
