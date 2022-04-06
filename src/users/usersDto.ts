import { IsEmail, IsNotEmpty } from 'class-validator';
import { Post } from '@prisma/client';

export class UserContext {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  isAdmin: boolean;
}

export class UpdateUserInfosDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;
}

export class UpdateUserPasswordDto {
  @IsNotEmpty()
  password: string;
}

export class GetUserByIdReturnObj {
  id: number;
  firstName: string;
  lastName: string;
  posts: Post[];
}
