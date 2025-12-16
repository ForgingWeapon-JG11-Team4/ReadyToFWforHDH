import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Header.css';

/**
 * Header 컴포넌트
 * - 모든 페이지에서 공통으로 표시되는 헤더바
 * - 로고(좌측), 검색창(중앙), Home/Login/Logout(우측)
 * - 로그인 시 "닉네임 님" 표시
 */
export default function Header() {
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();
    const { user, isLoggedIn, logout } = useAuth();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <header className="app-header">
            <div className="header-content">
                {/* 좌측: 로고 */}
                <Link to="/" className="logo">
                    🎬 MovieSearch
                </Link>

                {/* 중앙: 검색창 */}
                <form className="search-box" onSubmit={handleSearch}>
                    <input
                        type="text"
                        placeholder="영화 검색..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input"
                    />
                    <button type="submit" className="search-btn">
                        🔍
                    </button>
                </form>

                {/* 우측: Home, Login/Logout */}
                <nav className="nav-links">
                    <Link to="/" className="nav-link">
                        🏠 Home
                    </Link>
                    {isLoggedIn ? (
                        <>
                            <span className="user-nickname">👤 {user?.nickname} 님</span>
                            <button className="btn-logout" onClick={handleLogout}>
                                Logout
                            </button>
                        </>
                    ) : (
                        <Link to="/login" className="btn-login">
                            Login
                        </Link>
                    )}
                </nav>
            </div>
        </header>
    );
}
