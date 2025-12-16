import { useState } from 'react';
import './CommentCard.css';

interface Reply {
    id: number;
    content: string;
    likes: number;
    dislikes: number;
    createdAt: string;
    user: {
        id: number;
        nickname: string;
    };
}

interface Comment {
    id: number;
    content: string;
    rating: number | null;
    likes: number;
    dislikes: number;
    createdAt: string;
    user: {
        id: number;
        nickname: string;
    };
    replies: Reply[];
}

interface CommentCardProps {
    comment: Comment;
    currentUserId?: number;
    isLoggedIn: boolean;
    onLike: (id: number) => void;
    onDislike: (id: number) => void;
    onReply: (parentId: number, content: string) => void;
    onDelete: (id: number) => void;
}

/**
 * CommentCard: 개별 댓글 카드 컴포넌트
 * - 작성자, 작성시간, 별점, 내용 표시
 * - 좋아요/싫어요 버튼
 * - 대댓글 토글 및 작성
 */
export default function CommentCard({
    comment,
    currentUserId,
    isLoggedIn,
    onLike,
    onDislike,
    onReply,
    onDelete,
}: CommentCardProps) {
    const [showReplies, setShowReplies] = useState(false);
    const [replyContent, setReplyContent] = useState('');
    const [showReplyForm, setShowReplyForm] = useState(false);

    const isOwner = currentUserId === comment.user.id;

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const handleReplySubmit = () => {
        if (!replyContent.trim()) return;
        onReply(comment.id, replyContent);
        setReplyContent('');
        setShowReplyForm(false);
    };

    return (
        <div className="comment-card">
            <div className="comment-header">
                <span className="comment-author">👤 {comment.user.nickname}</span>
                {comment.rating && (
                    <span className="comment-rating">{'⭐'.repeat(Math.round(comment.rating))}</span>
                )}
                <span className="comment-date">{formatDate(comment.createdAt)}</span>
            </div>

            <p className="comment-content">{comment.content}</p>

            <div className="comment-actions">
                <button className="btn-action" onClick={() => onLike(comment.id)}>
                    👍 {comment.likes}
                </button>
                <button className="btn-action" onClick={() => onDislike(comment.id)}>
                    👎 {comment.dislikes}
                </button>
                {comment.replies.length > 0 && (
                    <button className="btn-action" onClick={() => setShowReplies(!showReplies)}>
                        💬 답글 {comment.replies.length}개 {showReplies ? '숨기기' : '보기'}
                    </button>
                )}
                {isLoggedIn && (
                    <button className="btn-action" onClick={() => setShowReplyForm(!showReplyForm)}>
                        ✏️ 답글 쓰기
                    </button>
                )}
                {isOwner && (
                    <button className="btn-delete" onClick={() => onDelete(comment.id)}>
                        🗑️ 삭제
                    </button>
                )}
            </div>

            {/* 답글 작성 폼 */}
            {showReplyForm && isLoggedIn && (
                <div className="reply-form">
                    <textarea
                        placeholder="답글을 작성하세요..."
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        rows={2}
                    />
                    <button onClick={handleReplySubmit}>답글 등록</button>
                </div>
            )}

            {/* 대댓글 목록 */}
            {showReplies && comment.replies.length > 0 && (
                <div className="replies-list">
                    {comment.replies.map((reply) => (
                        <div key={reply.id} className="reply-card">
                            <div className="reply-header">
                                <span className="reply-author">↳ {reply.user.nickname}</span>
                                <span className="reply-date">{formatDate(reply.createdAt)}</span>
                            </div>
                            <p className="reply-content">{reply.content}</p>
                            <div className="reply-actions">
                                <button className="btn-action-sm" onClick={() => onLike(reply.id)}>
                                    👍 {reply.likes}
                                </button>
                                <button className="btn-action-sm" onClick={() => onDislike(reply.id)}>
                                    👎 {reply.dislikes}
                                </button>
                                {currentUserId === reply.user.id && (
                                    <button className="btn-delete-sm" onClick={() => onDelete(reply.id)}>
                                        🗑️
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
