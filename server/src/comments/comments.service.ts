import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

/**
 * CommentsService: 댓글/대댓글 CRUD 비즈니스 로직
 * - 댓글 목록 조회 (영화별)
 * - 댓글 작성 (로그인 필요)
 * - 대댓글 작성 (로그인 필요)
 * - 좋아요/싫어요
 * - 댓글 삭제 (본인만)
 */
@Injectable()
export class CommentsService {
    constructor(private prisma: PrismaService) { }

    /**
     * 특정 영화의 댓글 목록 조회 (대댓글 포함)
     */
    async getCommentsByMovie(movieId: number) {
        // 루트 댓글만 조회 (parentId === null)
        const comments = await this.prisma.comment.findMany({
            where: {
                movieId,
                parentId: null  // 루트 댓글만
            },
            include: {
                user: {
                    select: { id: true, nickname: true }
                },
                replies: {
                    include: {
                        user: {
                            select: { id: true, nickname: true }
                        }
                    },
                    orderBy: { createdAt: 'asc' }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        return comments;
    }

    /**
     * 댓글 작성
     */
    async createComment(userId: number, movieId: number, content: string, rating?: number) {
        // 영화가 DB에 없으면 캐싱 (간단히 ID만 저장)
        const movie = await this.prisma.movie.findUnique({ where: { id: movieId } });
        if (!movie) {
            await this.prisma.movie.create({
                data: {
                    id: movieId,
                    title: `Movie ${movieId}`,  // TMDB에서 가져오거나 placeholder
                }
            });
        }

        return this.prisma.comment.create({
            data: {
                content,
                rating,
                userId,
                movieId,
            },
            include: {
                user: {
                    select: { id: true, nickname: true }
                }
            }
        });
    }

    /**
     * 대댓글 작성
     */
    async createReply(userId: number, parentId: number, content: string) {
        const parentComment = await this.prisma.comment.findUnique({ where: { id: parentId } });
        if (!parentComment) {
            throw new NotFoundException('부모 댓글을 찾을 수 없습니다.');
        }

        return this.prisma.comment.create({
            data: {
                content,
                userId,
                movieId: parentComment.movieId,
                parentId,
            },
            include: {
                user: {
                    select: { id: true, nickname: true }
                }
            }
        });
    }

    /**
     * 좋아요
     */
    async likeComment(commentId: number) {
        return this.prisma.comment.update({
            where: { id: commentId },
            data: { likes: { increment: 1 } }
        });
    }

    /**
     * 싫어요
     */
    async dislikeComment(commentId: number) {
        return this.prisma.comment.update({
            where: { id: commentId },
            data: { dislikes: { increment: 1 } }
        });
    }

    /**
     * 댓글 삭제 (본인만)
     */
    async deleteComment(commentId: number, userId: number) {
        const comment = await this.prisma.comment.findUnique({ where: { id: commentId } });
        if (!comment) {
            throw new NotFoundException('댓글을 찾을 수 없습니다.');
        }
        if (comment.userId !== userId) {
            throw new ForbiddenException('본인의 댓글만 삭제할 수 있습니다.');
        }

        // 대댓글도 함께 삭제
        await this.prisma.comment.deleteMany({ where: { parentId: commentId } });
        return this.prisma.comment.delete({ where: { id: commentId } });
    }
}
