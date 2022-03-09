import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Post, Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostDto, UpdatePostDto } from './postsDto';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  async getAllPosts(): Promise<Post[]> {
    const posts = await this.prisma.post.findMany({
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        comments: {
          include: {
            author: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        likes: {},
      },
    });

    if (posts.length === 0) {
      throw new NotFoundException("Aucun post n'a été trouvé...");
    } else {
      return posts;
    }
  }

  async createPost(createPostDto: CreatePostDto, user: User): Promise<Post> {
    try {
      const { text } = createPostDto;
      const { id } = user;
      const post = await this.prisma.post.create({
        data: {
          text,
          authorId: id,
        },
      });

      return post;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async updatePost(
    id: number,
    updatePostDto: UpdatePostDto,
    user: User,
  ): Promise<Post> {
    try {
      const { text } = updatePostDto;
      const { id: authorId } = user;
      const post = await this.prisma.post.update({
        where: {
          postIdAuthorId: {
            id,
            authorId,
          },
        },
        data: {
          text,
        },
      });

      return post;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async likePost(id: number, user: User): Promise<void> {
    try {
      const { id: userId } = user;

      const likesOnPosts = await this.prisma.likesOnPosts.findFirst({
        where: {
          userId,
          postId: id,
        },
      });

      if (likesOnPosts) {
        await this.prisma.likesOnPosts.deleteMany({
          where: {
            userId,
            postId: id,
          },
        });
      } else {
        await this.prisma.likesOnPosts.createMany({
          data: {
            userId,
            postId: id,
          },
        });
      }
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async deletePost(id: number, user: User): Promise<Post> {
    try {
      const { id: userId, admin } = user;
      let deletedPost: Post;
      if (admin) {
        deletedPost = await this.prisma.post.delete({
          where: { id },
        });
      } else {
        deletedPost = await this.prisma.post.delete({
          where: {
            postIdAuthorId: {
              id,
              authorId: userId,
            },
          },
        });
      }

      return deletedPost;
    } catch (error) {
      throw new NotFoundException(error);
    }
  }
}
