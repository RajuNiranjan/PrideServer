import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../schemas/user.schema';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/signup.dto';
import * as bcrypt from 'bcrypt';
import { LogInDto } from './dto/login.dto';

@Injectable()
export class AuthenticationService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly jwtService: JwtService,
  ) {}

  async signup(signUpDto: SignUpDto): Promise<{ token: string }> {
    const {
      dob,
      email,
      gender,
      mobileNumber,
      password,
      profilePic,
      profileBannerPic,
      userName,
    } = signUpDto;

    const existUser = await this.userModel.findOne({
      $or: [{ email }, { userName }, { mobileNumber }],
    });

    if (existUser) {
      throw new ConflictException(
        'User already exists with this email, username, or mobile number',
      );
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const newUser = await this.userModel.create({
      dob,
      email,
      gender,
      mobileNumber,
      password: hashPassword,
      profilePic,
      profileBannerPic,
      userName,
    });

    const token = this.jwtService.sign({ id: newUser._id });
    return { token };
  }

  async logIn(loginDto: LogInDto): Promise<{ token: string }> {
    const { usernameOremail, password } = loginDto;
    let user: User | null = null;

    if (/\S+@\S+\.\S+/.test(usernameOremail)) {
      user = await this.userModel.findOne({ email: usernameOremail }).exec();
    } else {
      // Otherwise, assume it's a username
      user = await this.userModel.findOne({ userName: usernameOremail }).exec();
    }

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      throw new UnauthorizedException('Invalid Credentials');
    }

    const token = this.jwtService.sign({ id: user._id });
    return { token };
  }
}
