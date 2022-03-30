import { IsEmail } from 'class-validator';
import { Post, Comment } from '@prisma/client';

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

  firstName: string;
  lastName: string;
}

export class UpdateUserPasswordDto {
  password: string;
}

export class GetUserByIdReturnObj {
  id: number;
  firstName: string;
  lastName: string;
  posts: Post[];
}
