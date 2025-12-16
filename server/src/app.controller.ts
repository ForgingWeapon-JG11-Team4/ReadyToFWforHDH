import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

/**
 * @Controller: 들어오는 요청(Request)을 처리하고 클라이언트에 응답(Response)을 반환하는 역할을 합니다.
 * - 인자로 라우트 경로 접두사(prefix)를 받을 수 있습니다. (현재는 루트 경로 '/')
 */
@Controller()
export class AppController {
  /**
   * 의존성 주입(Dependency Injection):
   * - 생성자를 통해 AppService의 인스턴스를 주입받습니다.
   * - 'this.appService'를 통해 비즈니스 로직에 접근할 수 있습니다.
   */
  constructor(private readonly appService: AppService) { }

  /**
   * @Get(): HTTP GET 메서드에 대한 핸들러임을 정의합니다.
   * - 루트 경로('/')로 들어오는 GET 요청을 이 메소드가 처리합니다.
   * - 반환값은 자동으로 200 OK 상태 코드와 함께 클라이언트로 전송됩니다.
   */
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
