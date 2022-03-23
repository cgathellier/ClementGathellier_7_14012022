import { IsEmail } from 'class-validator';

export class UserContext {
  id: number;
  email: string;
  isAdmin: boolean;
}

export class UpdateUserInfosDto {
  @IsEmail()
  email: string;

  firstName: string;
  lastName: string;
}

export class UpdateUserPasswordDto {
  password: string;
}
