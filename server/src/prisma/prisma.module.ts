import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma.service';

/**
 * PrismaModule: 전역 Prisma 모듈
 * - @Global() 데코레이터로 전역 제공
 * - 다른 모듈에서 import 없이 PrismaService 주입 가능
 */
@Global()
@Module({
    providers: [PrismaService],
    exports: [PrismaService],
})
export class PrismaModule { }
