import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import { Model } from 'mongoose';
import { SignUpDto } from './dto/signUp.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userService: Model<User>,
    private jwtService: JwtService,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<{ token: string }> {
    try {
      const { userName, email, password } = signUpDto;

      const user = await this.userService.findOne({ email });
      if (user) {
        throw new UnauthorizedException('email already existed');
      }

      const hashPassword = await bcrypt.hash(password, 10);

      const newUser = await this.userService.create({
        userName,
        email,
        password: hashPassword,
      });

      const token = this.jwtService.sign({ id: newUser._id });
      return { token };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async logIn(logInDto: LoginDto): Promise<{ token: string }> {
    try {
      const { email, password } = logInDto;

      const user = await this.userService.findOne({ email });
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      const verifyPassword = await bcrypt.compare(password, user.password);

      if (!verifyPassword) {
        throw new UnauthorizedException('Invalid email or password ');
      }

      const token = this.jwtService.sign({ id: user._id });
      return { token };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
