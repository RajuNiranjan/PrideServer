import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './dto/createUser.dto';
import * as bcrypt from 'bcrypt';
import { LogInDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async register(
    createUserDto: CreateUserDto,
  ): Promise<{ token: string; user: User }> {
    try {
      const { userName, email, password } = createUserDto;

      const user = await this.userModel.findOne({ email });

      if (user) {
        throw new UnauthorizedException('email already existed');
      }

      const hashPassword = await bcrypt.hash(password, 10);

      const newUser = await this.userModel.create({
        userName,
        email,
        password: hashPassword,
      });

      const token = this.jwtService.sign({ id: newUser._id });
      return { token, user: newUser };
    } catch (error) {
      console.log(error);
    }
  }

  async login(logInDto: LogInDto): Promise<{ token: string; user: User }> {
    try {
      const { email, password } = logInDto;

      const user = await this.userModel.findOne({ email });

      if (!user) {
        throw new UnauthorizedException('Invalid email address');
      }

      const validPassword = await bcrypt.compare(password, user.password);

      if (!validPassword) {
        throw new UnauthorizedException('Invalid email or password');
      }

      const token = this.jwtService.sign({ id: user._id });

      return { token, user: user };
    } catch (error) {
      console.log(error);
    }
  }
}
