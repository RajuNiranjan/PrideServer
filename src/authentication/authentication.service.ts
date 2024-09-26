import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/signup.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthenticationService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly jwtService: JwtService,
  ) {}

  async signup(signUpDto: SignUpDto): Promise<{ token: string }> {
    const { dob, email, gender, mobileNumber, password, profilePic, userName } =
      signUpDto;

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
      userName,
    });

    const token = this.jwtService.sign({ id: newUser._id });
    return { token };
  }
}
