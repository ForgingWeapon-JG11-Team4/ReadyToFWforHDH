import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import './SignupPage.css';

/**
 * SignupPage: 회원가입 페이지
 * - ID(이메일), 비밀번호, 비밀번호 확인, 닉네임 입력
 * - 이메일 중복 체크
 * - 회원가입 성공 시 로그인 페이지로 이동
 */
export default function SignupPage() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [emailChecked, setEmailChecked] = useState(false);
    const [emailAvailable, setEmailAvailable] = useState(false);

    const { register } = useAuth();
    const navigate = useNavigate();

    const API_URL = 'http://localhost:3000';

    // 이메일 중복 체크
    const checkEmail = async () => {
        if (!email) {
            setError('이메일을 입력해주세요.');
            return;
        }
        try {
            const response = await axios.get(`${API_URL}/auth/check-email?email=${encodeURIComponent(email)}`);
            setEmailChecked(true);
            setEmailAvailable(!response.data.exists);
            if (response.data.exists) {
                setError('이미 사용 중인 이메일입니다.');
            } else {
                setError('');
            }
        } catch (err) {
            setError('이메일 확인 중 오류가 발생했습니다.');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // 유효성 검사
        if (!emailChecked || !emailAvailable) {
            setError('이메일 중복 확인을 해주세요.');
            return;
        }
        if (password !== confirmPassword) {
            setError('비밀번호가 일치하지 않습니다.');
            return;
        }
        if (password.length < 6) {
            setError('비밀번호는 6자 이상이어야 합니다.');
            return;
        }

        setLoading(true);

        try {
            await register(username, email, password);
            alert('회원가입이 완료되었습니다! 로그인해주세요.');
            navigate('/login');
        } catch (err: any) {
            setError(err.response?.data?.message || '회원가입에 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="signup-page">
            <div className="signup-container">
                <h1>🎬 회원가입</h1>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="username">닉네임</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="닉네임 입력"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">이메일</label>
                        <div className="email-check-row">
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    setEmailChecked(false);
                                    setEmailAvailable(false);
                                }}
                                placeholder="example@email.com"
                                required
                            />
                            <button type="button" className="btn-check" onClick={checkEmail}>
                                중복 확인
                            </button>
                        </div>
                        {emailChecked && (
                            <span className={emailAvailable ? 'check-ok' : 'check-fail'}>
                                {emailAvailable ? '✓ 사용 가능한 이메일입니다.' : '✗ 이미 사용 중인 이메일입니다.'}
                            </span>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">비밀번호</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="비밀번호 (6자 이상)"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">비밀번호 확인</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="비밀번호 재입력"
                            required
                        />
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <button type="submit" className="btn-signup-submit" disabled={loading}>
                        {loading ? '가입 중...' : '회원가입'}
                    </button>
                </form>

                <div className="login-link">
                    이미 계정이 있으신가요? <Link to="/login">로그인</Link>
                </div>
            </div>
        </div>
    );
}
