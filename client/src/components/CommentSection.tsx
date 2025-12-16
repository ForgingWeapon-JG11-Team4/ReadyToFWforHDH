import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import CommentCard from './CommentCard';
import './CommentSection.css';

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
    replies: Comment[];
}

interface CommentSectionProps {
    movieId: number;
}

const API_URL = 'http://localhost:3000';

/**
 * CommentSection: 댓글 섹션 컴포넌트
 * - 댓글 목록 표시
 * - 로그인 시 댓글 작성 폼 활성화
 * - 비로그인 시 읽기 전용
 */
export default function CommentSection({ movieId }: CommentSectionProps) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [rating, setRating] = useState<number>(5);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const { isLoggedIn, user } = useAuth();

    // 댓글 목록 불러오기
    const fetchComments = async () => {
        try {
            const response = await axios.get(`${API_URL}/comments/${movieId}`);
            setComments(response.data);
        } catch (error) {
            console.error('Failed to fetch comments:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComments();
    }, [movieId]);

    // 댓글 작성
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim() || !isLoggedIn) return;

        setSubmitting(true);
        try {
            const token = localStorage.getItem('accessToken');
            await axios.post(
                `${API_URL}/comments`,
                { movieId, content: newComment, rating },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setNewComment('');
            setRating(5);
            fetchComments(); // 목록 새로고침
        } catch (error) {
            console.error('Failed to create comment:', error);
            alert('댓글 작성에 실패했습니다.');
        } finally {
            setSubmitting(false);
        }
    };

    // 좋아요/싫어요 핸들러
    const handleLike = async (commentId: number) => {
        try {
            await axios.post(`${API_URL}/comments/${commentId}/like`);
            fetchComments();
        } catch (error) {
            console.error('Failed to like:', error);
        }
    };

    const handleDislike = async (commentId: number) => {
        try {
            await axios.post(`${API_URL}/comments/${commentId}/dislike`);
            fetchComments();
        } catch (error) {
            console.error('Failed to dislike:', error);
        }
    };

    // 대댓글 작성 핸들러
    const handleReply = async (parentId: number, content: string) => {
        try {
            const token = localStorage.getItem('accessToken');
            await axios.post(
                `${API_URL}/comments/${parentId}/reply`,
                { content },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchComments();
        } catch (error) {
            console.error('Failed to create reply:', error);
            alert('대댓글 작성에 실패했습니다.');
        }
    };

    // 댓글 삭제 핸들러
    const handleDelete = async (commentId: number) => {
        if (!window.confirm('정말 삭제하시겠습니까?')) return;
        try {
            const token = localStorage.getItem('accessToken');
            await axios.delete(`${API_URL}/comments/${commentId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchComments();
        } catch (error) {
            console.error('Failed to delete:', error);
            alert('삭제에 실패했습니다.');
        }
    };

    if (loading) return <div className="comment-loading">댓글 불러오는 중...</div>;

    return (
        <section className="comment-section">
            <h3>💬 댓글 ({comments.length})</h3>

            {/* 댓글 작성 폼 (로그인 시에만) */}
            {isLoggedIn ? (
                <form className="comment-form" onSubmit={handleSubmit}>
                    <div className="form-header">
                        <span className="user-badge">👤 {user?.nickname}</span>
                        <div className="rating-select">
                            <label>별점:</label>
                            <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
                                {[5, 4, 3, 2, 1].map(n => (
                                    <option key={n} value={n}>{'⭐'.repeat(n)}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <textarea
                        placeholder="댓글을 작성하세요..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        rows={3}
                        required
                    />
                    <button type="submit" disabled={submitting}>
                        {submitting ? '작성 중...' : '댓글 작성'}
                    </button>
                </form>
            ) : (
                <div className="login-prompt">
                    💡 댓글을 작성하려면 <a href="/login">로그인</a>하세요.
                </div>
            )}

            {/* 댓글 목록 */}
            <div className="comments-list">
                {comments.length === 0 ? (
                    <p className="no-comments">아직 댓글이 없습니다. 첫 댓글을 작성해보세요!</p>
                ) : (
                    comments.map(comment => (
                        <CommentCard
                            key={comment.id}
                            comment={comment}
                            currentUserId={user?.id}
                            isLoggedIn={isLoggedIn}
                            onLike={handleLike}
                            onDislike={handleDislike}
                            onReply={handleReply}
                            onDelete={handleDelete}
                        />
                    ))
                )}
            </div>
        </section>
    );
}
