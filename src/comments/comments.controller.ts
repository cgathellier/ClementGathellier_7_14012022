import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Comment, User } from '@prisma/client';
import { GetUser } from 'src/auth/get-user.decorator';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './commentsDto';

@Controller('comments')
@UseGuards(AuthGuard())
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  @Post('/:postId')
  createComment(
    @Param('postId') postId: string,
    @Body() createCommentDto: CreateCommentDto,
    @GetUser() user: User,
  ): Promise<Comment> {
    return this.commentsService.createComment(createCommentDto, user, +postId);
  }

  @Patch('/likes/:id')
  likeComment(@Param('id') id: string, @GetUser() user: User): Promise<void> {
    return this.commentsService.likeComment(+id, user);
  }

  @Delete('/:commentId')
  deleteComment(
    @Param('commentId') commentId: string,
    @GetUser() user: User,
  ): Promise<Comment> {
    return this.commentsService.deleteComment(+commentId, user);
  }
}
