import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schemas/user.schema';
import { UpdateUseInfoDto } from './dto/updateUser.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async updateUserInfo(
    id: string,
    updateUserDto: UpdateUseInfoDto,
  ): Promise<User> {
    if (updateUserDto.password) {
      const salt = await bcrypt.genSalt(10);
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, salt);
    }
    const user = await this.userModel.findByIdAndUpdate(id, updateUserDto, {
      new: true,
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.password = undefined;
    return user;
  }

  async deleteAccount(id: string): Promise<{ message: string }> {
    await this.userModel.findByIdAndDelete(id);
    return { message: 'Account deleted Successfully' };
  }
}
