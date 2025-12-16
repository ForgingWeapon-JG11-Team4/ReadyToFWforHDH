import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

/**
 * main.ts: 애플리케이션의 진입점(Entry Point)입니다.
 * - NestFactory를 사용하여 NestJS 애플리케이션 인스턴스를 생성(Bootstrap)합니다.
 * - 생성된 인스턴스를 특정 포트(3000)에서 실행하여 들어오는 HTTP 요청을 수신 대기합니다.
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Enable CORS to allow requests from Frontend (localhost:5173)
  app.enableCors();

  // Graceful Shutdown Hook: 
  // Ctrl+C, SIGINT, SIGTERM 시그널을 받았을 때 서버를 안전하게 종료하고 포트를 반환하도록 합니다.
  // 이 설정이 없으면 윈도우/터미널 환경에 따라 프로세스가 좀비처럼 남아 포트 충돌(EADDRINUSE)을 일으킬 수 있습니다.
  app.enableShutdownHooks();

  // app.listen: 웹 서버를 구동하고 환경 변수(PORT) 또는 기본값 3000번 포트에서 요청을 기다립니다.
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
