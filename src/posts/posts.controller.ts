import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PostsService } from './posts.service';
import { Post as PostSchema, User } from '@prisma/client';
import { CreatePostDto } from './postsDto';
import { GetUser } from 'src/auth/get-user.decorator';
@Controller('posts')
@UseGuards(AuthGuard())
export class PostsController {
  constructor(private postsService: PostsService) {}

  @Get()
  getAllPosts(): Promise<PostSchema[]> {
    return this.postsService.getAllPosts();
  }

  @Post()
  createPost(
    @Body() createPostDto: CreatePostDto,
    @GetUser() user: User,
  ): Promise<PostSchema> {
    return this.postsService.createPost(createPostDto, user);
  }

  @Delete('/:id')
  deletePost(
    @Param('id') id: string,
    @GetUser() user: User,
  ): Promise<PostSchema> {
    return this.postsService.deletePost(+id, user);
  }
}
