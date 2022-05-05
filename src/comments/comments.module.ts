import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';

@Module({
    controllers: [CommentsController],
    providers: [CommentsService, PrismaService],
    imports: [AuthModule],
})
export class CommentsModule {}
