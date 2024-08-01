import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  readonly userName: string;

  @IsNotEmpty()
  @IsEmail({}, { message: 'please enter email' })
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  readonly password: string;
}
