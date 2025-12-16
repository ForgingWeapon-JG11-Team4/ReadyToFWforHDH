import { Module } from '@nestjs/common';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { PrismaModule } from '../prisma/prisma.module';

/**
 * CommentsModule: 댓글/대댓글 모듈
 * - 댓글 CRUD 기능 제공
 */
@Module({
    imports: [PrismaModule],
    controllers: [CommentsController],
    providers: [CommentsService],
    exports: [CommentsService],
})
export class CommentsModule { }
