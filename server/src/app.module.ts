import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

/**
 * @Module: 클래스를 모듈로 정의하는 데코레이터입니다.
 * - 모듈은 애플리케이션의 구조를 구성하는 메타데이터를 제공합니다.
 * - NestJS는 이 루트 모듈(AppModule)을 시작점으로 의존성 그래프를 생성합니다.
 */
@Module({
  // imports: 이 모듈이 의존하는 다른 모듈 목록입니다.
  imports: [],
  // controllers: 이 모듈에서 정의된, 인스턴스화되어야 하는 컨트롤러 목록입니다.
  controllers: [AppController],
  // providers: Nest 인젝터에 의해 인스턴스화되고, 의존성 주입(DI)이 가능한 클래스(서비스 등) 목록입니다.
  providers: [AppService],
})
export class AppModule { }
