import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from './auth.service';

/**
 * JwtStrategy: JWT 토큰 검증 전략
 * - Authorization 헤더에서 Bearer 토큰 추출
 * - 토큰 유효성 검증 후 사용자 정보 반환
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET || 'your-super-secret-key-change-in-production',
        });
    }

    /**
     * JWT 검증 성공 시 호출됨
     * payload: { sub: userId, username, nickname }
     */
    async validate(payload: { sub: number; username: string; nickname: string }) {
        return { userId: payload.sub, username: payload.username, nickname: payload.nickname };
    }
}
