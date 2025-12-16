import { Controller, Get, Post, Delete, Param, Body, UseGuards, Request } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { AuthGuard } from '@nestjs/passport';

/**
 * CommentsController: 댓글/대댓글 API 엔드포인트
 * - GET /comments/:movieId: 영화별 댓글 목록
 * - POST /comments: 댓글 작성 (로그인 필요)
 * - POST /comments/:id/reply: 대댓글 작성 (로그인 필요)
 * - POST /comments/:id/like: 좋아요
 * - POST /comments/:id/dislike: 싫어요
 * - DELETE /comments/:id: 댓글 삭제 (본인만)
 */
@Controller('comments')
export class CommentsController {
    constructor(private readonly commentsService: CommentsService) { }

    /**
     * 영화별 댓글 목록 조회
     * GET /comments/:movieId
     */
    @Get(':movieId')
    async getComments(@Param('movieId') movieId: string) {
        return this.commentsService.getCommentsByMovie(parseInt(movieId));
    }

    /**
     * 댓글 작성 (로그인 필요)
     * POST /comments
     * Body: { movieId, content, rating? }
     */
    @Post()
    @UseGuards(AuthGuard('jwt'))
    async createComment(
        @Request() req: any,
        @Body('movieId') movieId: number,
        @Body('content') content: string,
        @Body('rating') rating?: number,
    ) {
        return this.commentsService.createComment(req.user.userId, movieId, content, rating);
    }

    /**
     * 대댓글 작성 (로그인 필요)
     * POST /comments/:id/reply
     * Body: { content }
     */
    @Post(':id/reply')
    @UseGuards(AuthGuard('jwt'))
    async createReply(
        @Request() req: any,
        @Param('id') parentId: string,
        @Body('content') content: string,
    ) {
        return this.commentsService.createReply(req.user.userId, parseInt(parentId), content);
    }

    /**
     * 좋아요
     * POST /comments/:id/like
     */
    @Post(':id/like')
    async likeComment(@Param('id') id: string) {
        return this.commentsService.likeComment(parseInt(id));
    }

    /**
     * 싫어요
     * POST /comments/:id/dislike
     */
    @Post(':id/dislike')
    async dislikeComment(@Param('id') id: string) {
        return this.commentsService.dislikeComment(parseInt(id));
    }

    /**
     * 댓글 삭제 (본인만)
     * DELETE /comments/:id
     */
    @Delete(':id')
    @UseGuards(AuthGuard('jwt'))
    async deleteComment(@Request() req: any, @Param('id') id: string) {
        return this.commentsService.deleteComment(parseInt(id), req.user.userId);
    }
}
