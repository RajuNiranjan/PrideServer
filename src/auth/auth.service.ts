import {
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
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
  ): Promise<{ token: string; user: Partial<User> }> {
    try {
      const { userName, email, password } = createUserDto;

      if (!userName || !email || !password) {
        throw new UnauthorizedException('please fill missing field');
      }

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

      const userObject = newUser.toObject();

      delete userObject.password;

      return { token, user: userObject };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async login(
    logInDto: LogInDto,
  ): Promise<{ token: string; user: Partial<User> }> {
    try {
      const { email, password } = logInDto;

      if (!email || !password) {
        throw new UnauthorizedException('please fill missing field');
      }

      const user = await this.userModel.findOne({ email });

      if (!user) {
        throw new UnauthorizedException('Invalid email address');
      }

      const validPassword = await bcrypt.compare(password, user.password);

      if (!validPassword) {
        throw new UnauthorizedException('Invalid email or password');
      }

      const token = this.jwtService.sign({ id: user._id });

      const userObj = user.toObject();

      delete userObj.password;

      return { token, user: userObj };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async updateUser(
    id: string,
    updateUserDto: CreateUserDto,
  ): Promise<{ user: Partial<User> }> {
    try {
      const { userName, email, password } = updateUserDto;

      const user = await this.userModel.findById(id);
      if (!user) {
        throw new NotFoundException('user not found');
      }
      const hashPassword = await bcrypt.hash(password, 10);

      const updateUser = await this.userModel.findByIdAndUpdate(
        id,
        {
          userName,
          email,
          password: hashPassword,
        },
        {
          new: true,
        },
      );

      const userObj = updateUser.toObject();

      delete userObj.password;

      return { user: userObj };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
