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
import { CreateCommentDto, UpdateCommentDto } from './commentsDto';

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

  @Patch('/:id')
  updatePost(
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
    @GetUser() user: User,
  ): Promise<Comment> {
    return this.commentsService.updatePost(+id, updateCommentDto, user);
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
