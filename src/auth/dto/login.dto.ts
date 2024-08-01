import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail({}, { message: 'please enter email' })
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  readonly password: string;
}
