import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './prisma/prisma.service';
import { PostsModule } from './posts/posts.module';
import { CommentsModule } from './comments/comments.module';
import { UsersModule } from './users/users.module';

@Module({
    imports: [AuthModule, PostsModule, CommentsModule, UsersModule],
    providers: [PrismaService],
})
export class AppModule {}
