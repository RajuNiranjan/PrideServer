import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/createUser.dto';
import { User } from './schema/user.schema';
import { LogInDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  register(
    @Body() createUserDto: CreateUserDto,
  ): Promise<{ token: string; user: Partial<User> }> {
    return this.authService.register(createUserDto);
  }

  @Post('/login')
  logIn(
    @Body() logInDto: LogInDto,
    @Req() req: Request,
  ): Promise<{ token: string; user: Partial<User> }> {
    const token = req.headers['Authorization'];
    return this.authService.login(logInDto);
  }

  @Get('user')
  user(@Req() req: Request): Promise<{ user: Partial<User> }> {
    const token = req.headers['authorization'];
    return this.authService.getUser(token);
  }

  @Patch('/updateprofile/:id')
  updateProfile(
    @Param('id') id: string,
    @Body() updateUserDto: CreateUserDto,
  ): Promise<{ user: Partial<User> }> {
    return this.authService.updateUser(id, updateUserDto);
  }

  @Delete('/deleteuser/:id')
  deleteUser(@Param('id') id: string): Promise<User> {
    return this.authService.deleteUser(id);
  }
}
