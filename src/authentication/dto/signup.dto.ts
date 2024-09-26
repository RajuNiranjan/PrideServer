import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
} from 'class-validator';
import { GenderIdentity } from 'src/utils/enums';

export class SignUpDto {
  @IsNotEmpty()
  @IsString()
  userName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  mobileNumber: string;

  @IsNotEmpty()
  @IsString()
  dob: string;

  @IsNotEmpty()
  @IsEnum(GenderIdentity)
  gender: GenderIdentity;

  @IsNotEmpty()
  @IsString()
  profilePic: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsBoolean()
  isVerified: boolean = false;

  @IsNotEmpty()
  @IsBoolean()
  isPrivate: boolean = false;
}
