import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import { Model } from 'mongoose';
import { SignUpDto } from './dto/signUp.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userService: Model<User>,
    private jwtService: JwtService,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<{ token: string }> {
    try {
      const { userName, email, password } = signUpDto;

      const hashPassword = await bcrypt.hash(password, 10);

      const user = await this.userService.create({
        userName,
        email,
        password: hashPassword,
      });

      const token = this.jwtService.sign({ id: user._id });
      return { token };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
