import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import axios from 'axios';

/**
 * AuthContext: 전역 인증 상태 관리
 * - user: 현재 로그인한 사용자 정보
 * - login: 로그인 함수
 * - logout: 로그아웃 함수
 * - isLoggedIn: 로그인 여부
 */

interface User {
    id: number;
    email: string;
    username: string;
}

interface AuthContextType {
    user: User | null;
    isLoggedIn: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    register: (username: string, email: string, password: string) => Promise<void>;
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

    const login = async (email: string, password: string) => {
        const response = await axios.post(`${API_URL}/auth/login`, { email, password });
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

    const register = async (username: string, email: string, password: string) => {
        await axios.post(`${API_URL}/auth/register`, { username, email, password });
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
