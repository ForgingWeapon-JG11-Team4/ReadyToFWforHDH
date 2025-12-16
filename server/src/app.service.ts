import { Injectable } from '@nestjs/common';

/**
 * @Injectable: 의존성 주입(DI) 시스템에서 관리되는 프로바이더(Provider)임을 선언합니다.
 * - 이 데코레이터가 붙은 클래스는 다른 컴포넌트(Controller 등)에 주입될 수 있습니다.
 * - 데이터 처리, DB 접근 등 실제 비즈니스 로직을 담당합니다.
 */
@Injectable()
export class AppService {
  /**
   * 단순한 문자열을 반환하는 비즈니스 로직 예시입니다.
   */
  getHello(): string {
    return 'Hello World!';
  }
}
