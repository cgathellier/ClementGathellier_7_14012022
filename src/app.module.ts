import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './prisma/prisma.service';
import { PostsModule } from './posts/posts.module';

@Module({
  imports: [TasksModule, AuthModule, PostsModule],
  providers: [PrismaService],
})
export class AppModule {}
