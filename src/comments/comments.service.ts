import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Comment, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCommentDto } from './commentsDto';

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) {}

  async createComment(
    createCommentDto: CreateCommentDto,
    user: User,
    postId: number,
  ): Promise<Comment> {
    try {
      const { text } = createCommentDto;
      const { id: authorId } = user;
      const comment = await this.prisma.comment.create({
        data: {
          text,
          authorId,
          postId,
        },
      });

      return comment;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async likeComment(id: number, user: User): Promise<void> {
    try {
      const { id: userId } = user;

      const likesOnComments = await this.prisma.likesOnComments.findFirst({
        where: {
          userId,
          commentId: id,
        },
      });

      if (likesOnComments) {
        await this.prisma.likesOnComments.deleteMany({
          where: {
            userId,
            commentId: id,
          },
        });
      } else {
        await this.prisma.likesOnComments.createMany({
          data: {
            userId,
            commentId: id,
          },
        });
      }
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async deleteComment(id: number, user: User): Promise<Comment> {
    try {
      const { id: authorId, admin } = user;
      let deletedComment: Comment;
      if (admin) {
        deletedComment = await this.prisma.comment.delete({
          where: {
            id,
          },
        });
      } else {
        deletedComment = await this.prisma.comment.delete({
          where: {
            commentIdAuthorId: {
              id,
              authorId,
            },
          },
        });
      }

      return deletedComment;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
