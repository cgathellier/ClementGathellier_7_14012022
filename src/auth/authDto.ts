import { IsNotEmpty } from 'class-validator';

export class SignUpDto {
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsNotEmpty()
  password: string;
}

export class LoginDto {
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;
}

export class CreateAdminDto extends SignUpDto {
  admin: boolean;
}
