import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

/**
 * AuthService: 인증 관련 비즈니스 로직
 * - 회원가입: 비밀번호 해싱 후 저장
 * - 로그인: 아이디(username) + 비밀번호 검증 후 JWT 발급
 * - 아이디 중복 체크
 */
@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
    ) { }

    /**
     * 회원가입
     * @param username 로그인용 아이디
     * @param password 비밀번호
     * @param nickname 댓글에 노출될 닉네임
     * @param email 이메일 (선택)
     */
    async register(username: string, password: string, nickname: string, email?: string) {
        // 아이디 중복 체크
        const existingUser = await this.prisma.user.findUnique({ where: { username } });
        if (existingUser) {
            throw new ConflictException('이미 사용 중인 아이디입니다.');
        }

        // 비밀번호 해싱
        const hashedPassword = await bcrypt.hash(password, 10);

        // 사용자 생성
        const user = await this.prisma.user.create({
            data: {
                username,
                password: hashedPassword,
                nickname,
                email: email || null,
            },
        });

        // 비밀번호 제외하고 반환
        const { password: _, ...result } = user;
        return result;
    }

    /**
     * 로그인: 아이디(username) + 비밀번호 검증 후 JWT 발급
     */
    async login(username: string, password: string) {
        // 사용자 찾기
        const user = await this.prisma.user.findUnique({ where: { username } });
        if (!user) {
            throw new UnauthorizedException('아이디 또는 비밀번호가 올바르지 않습니다.');
        }

        // 비밀번호 검증
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('아이디 또는 비밀번호가 올바르지 않습니다.');
        }

        // JWT 토큰 생성 (nickname 포함)
        const payload = { sub: user.id, username: user.username, nickname: user.nickname };
        const accessToken = this.jwtService.sign(payload);

        return {
            accessToken,
            user: {
                id: user.id,
                username: user.username,
                nickname: user.nickname,
            },
        };
    }

    /**
     * 아이디 중복 체크
     */
    async checkUsername(username: string): Promise<boolean> {
        const user = await this.prisma.user.findUnique({ where: { username } });
        return !!user; // true = 이미 존재함
    }

    /**
     * JWT 토큰에서 사용자 정보 조회
     */
    async validateUser(userId: number) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user) return null;
        const { password: _, ...result } = user;
        return result;
    }
}
