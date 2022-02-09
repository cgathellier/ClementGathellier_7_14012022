import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Post, Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostDto } from './postsDto';

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

  async deletePost(id: number, user: User): Promise<Post> {
    try {
      const { id: authorId } = user;
      const deletedPost = await this.prisma.post.delete({
        where: {
          postIdAuthorId: {
            id,
            authorId,
          },
        },
      });

      return deletedPost;
    } catch (error) {
      throw new NotFoundException(error);
    }
  }
}
