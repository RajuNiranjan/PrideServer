import { IsNotEmpty, IsString } from 'class-validator';

export class LogInDto {
  @IsNotEmpty()
  @IsString()
  usernameOremail: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
