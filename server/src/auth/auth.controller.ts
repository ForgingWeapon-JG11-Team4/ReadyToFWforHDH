import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { AuthService } from './auth.service';

/**
 * AuthController: 인증 관련 API 엔드포인트
 * - POST /auth/register: 회원가입
 * - POST /auth/login: 로그인 (JWT 발급)
 * - GET /auth/check-username: 아이디 중복 체크
 */
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    /**
     * 회원가입
     * POST /auth/register
     * Body: { username, password, nickname, email? }
     */
    @Post('register')
    async register(
        @Body('username') username: string,
        @Body('password') password: string,
        @Body('nickname') nickname: string,
        @Body('email') email?: string,
    ) {
        return this.authService.register(username, password, nickname, email);
    }

    /**
     * 로그인
     * POST /auth/login
     * Body: { username, password }
     * Returns: { accessToken, user: { id, username, nickname } }
     */
    @Post('login')
    async login(
        @Body('username') username: string,
        @Body('password') password: string,
    ) {
        return this.authService.login(username, password);
    }

    /**
     * 아이디 중복 체크
     * GET /auth/check-username?username=xxx
     * Returns: { exists: boolean }
     */
    @Get('check-username')
    async checkUsername(@Query('username') username: string) {
        const exists = await this.authService.checkUsername(username);
        return { exists };
    }
}
