import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { AuthService } from './auth.service';

/**
 * AuthController: 인증 관련 API 엔드포인트
 * - POST /auth/register: 회원가입
 * - POST /auth/login: 로그인 (JWT 발급)
 * - GET /auth/check-email: 이메일 중복 체크
 */
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    /**
     * 회원가입
     * POST /auth/register
     * Body: { username, email, password }
     */
    @Post('register')
    async register(
        @Body('username') username: string,
        @Body('email') email: string,
        @Body('password') password: string,
    ) {
        return this.authService.register(username, email, password);
    }

    /**
     * 로그인
     * POST /auth/login
     * Body: { email, password }
     * Returns: { accessToken, user }
     */
    @Post('login')
    async login(
        @Body('email') email: string,
        @Body('password') password: string,
    ) {
        return this.authService.login(email, password);
    }

    /**
     * 이메일 중복 체크
     * GET /auth/check-email?email=xxx
     * Returns: { exists: boolean }
     */
    @Get('check-email')
    async checkEmail(@Query('email') email: string) {
        const exists = await this.authService.checkEmail(email);
        return { exists };
    }
}
