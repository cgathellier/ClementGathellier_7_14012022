import { IsNotEmpty } from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty()
  text: string;
}

export class UpdatePostDto {
  @IsNotEmpty()
  text: string;
}
