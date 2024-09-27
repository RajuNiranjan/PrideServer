import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from 'src/jwt/jwt-auth.guard';
import { UserService } from './user.service';
import { UpdateUseInfoDto } from './dto/updateUser.dto';
import { User } from 'src/schemas/user.schema';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@Req() req: any) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me/:id')
  async UpdateUserInfo(
    @Param('id') id: string,
    @Body() updateUserInfoDto: UpdateUseInfoDto,
  ): Promise<User> {
    return await this.userService.updateUserInfo(id, updateUserInfoDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('me/:id')
  async DeleteAccount(@Param('id') id: string): Promise<{ message: string }> {
    return this.userService.deleteAccount(id);
  }
}
