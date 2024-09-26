import { Body, Controller, Post } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { SignUpDto } from './dto/signup.dto';

@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly userService: AuthenticationService) {}

  @Post('/register')
  SignUp(@Body() singUpDto: SignUpDto): Promise<{ token: string }> {
    return this.userService.signup(singUpDto);
  }
}
