import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './prisma/prisma.service';
import { PostsModule } from './posts/posts.module';
import { CommentsModule } from './comments/comments.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [TasksModule, AuthModule, PostsModule, CommentsModule, UsersModule],
  providers: [PrismaService],
})
export class AppModule {}
