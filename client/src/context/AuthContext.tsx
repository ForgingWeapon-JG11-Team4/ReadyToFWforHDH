import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import axios from 'axios';

/**
 * AuthContext: 전역 인증 상태 관리
 * - user: 현재 로그인한 사용자 정보 (id, username, nickname)
 * - login: 로그인 함수 (username + password)
 * - logout: 로그아웃 함수
 * - isLoggedIn: 로그인 여부
 */

interface User {
    id: number;
    username: string;
    nickname: string;
}

interface AuthContextType {
    user: User | null;
    isLoggedIn: boolean;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
    register: (username: string, password: string, nickname: string, email?: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = 'http://localhost:3000';

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);

    // 앱 로드 시 localStorage에서 토큰 확인
    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        const savedUser = localStorage.getItem('user');
        if (token && savedUser) {
            setUser(JSON.parse(savedUser));
        }
    }, []);

    const login = async (username: string, password: string) => {
        const response = await axios.post(`${API_URL}/auth/login`, { username, password });
        const { accessToken, user: userData } = response.data;

        // 토큰 및 사용자 정보 저장
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        setUser(null);
    };

    const register = async (username: string, password: string, nickname: string, email?: string) => {
        await axios.post(`${API_URL}/auth/register`, { username, password, nickname, email });
    };

    return (
        <AuthContext.Provider value={{ user, isLoggedIn: !!user, login, logout, register }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
