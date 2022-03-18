import { IsNotEmpty } from 'class-validator';

export class CreateCommentDto {
  @IsNotEmpty()
  text: string;
}

export class UpdateCommentDto {
  @IsNotEmpty()
  text: string;
}
