import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';

@Module({
    imports: [AuthModule],
    controllers: [PostsController],
    providers: [PostsService, PrismaService],
})
export class PostsModule {}
