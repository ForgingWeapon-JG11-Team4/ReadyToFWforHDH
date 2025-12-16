# 프로젝트 작업 계획 (Project Architecture & Plan)

요청하신 대로 **NestJS(서버)**와 **React(프론트엔드)**를 기반으로 한 영화 검색 사이트 구축 계획입니다.

## 1. 프로젝트 초기화 (Project Initialization)
1. **서버 (Backend)**: NestJS CLI를 사용하여 `server` 디렉토리에 프로젝트 생성.
2. **클라이언트 (Frontend)**: Vite를 사용하여 `client` 디렉토리에 React 프로젝트 생성.
3. **환경 설정**: `.env` 파일 설정 (TMDB API Key, OpenAI API Key, DB URL).

## 2. 데이터베이스 설계 (Database Design)
- **ORM**: Prisma 사용 (NestJS와 호환성 우수).
- **데이터베이스**: SQLite (개발 용이성).
- **Schema**:
    - `User`: 사용자 ID, 닉네임, 비밀번호(해시).
    - `Movie`: 영화 ID (TMDB ID 참조), 캐시된 기본 정보.
    - `Comment`: ID, 내용, 작성자(User), 영화(Movie), 부모댓글ID(대댓글용), 작성일.
    - `Rating`: 유저별 영화 평점 (1~5).

## 3. 백엔드 개발 (NestJS)
1. **Movie Module**:
    - TMDB API를 통해 최신 영화, 검색, 상세 정보 조회 기능 구현.
    - 로컬 DB에 필요한 정보 캐싱 전략 수립.
2. **Community Module**:
    - 댓글(Comment) CRUD 구현 & 대댓글(Reply) 구조 지원.
    - 영화 평점(Rating) 저장 및 평균 평점 계산 로직.
3. **AI Module**:
    - OpenAI API 연동.
    - "이 영화와 비슷한 영화 추천해줘" 등의 프롬프트 처리 컨트롤러 구현.

## 4. 프론트엔드 개발 (React)
1. **기본 레이아웃 & 스타일링**:
    - Vanilla CSS 사용.
    - 모바일 퍼스트 반응형 레이아웃 (Media Queries).
    - 공통 `Header` (로고, 네비게이션, 검색바).
2. **페이지 구현**:
    - **Home**: 최신 영화 그리드 뷰.
    - **Search**: 카테고리별 필터 버튼 및 검색 결과 리스트.
    - **Detail**: 영화 포스터, 줄거리, 출연진 정보 표시.
3. **기능 연동**:
    - **커뮤니티**: 상세 페이지 하단에 댓글 목록, 입력 폼, 대댓글 토글 UI 구현.
    - **AI 챗봇**: 화면 우측 하단 플로팅 버튼으로 AI와 대화하는 모달/팝업 구현.

## 5. 검증 및 배포 준비 (Verification)
1. **반응형 테스트**: 모바일(375px), 태블릿(768px), 데스크탑(1024px+) 해상도별 UI 점검.
2. **기능 테스트**:
    - 영화 검색 결과 정확도 확인.
    - 댓글/대댓글 저장 및 조회 계층 구조 확인.
    - AI 응답 속도 및 적절성 확인.

---

## 작업 로그 (Work Log)

### 1-1. 서버 프로젝트 초기화 (Server Initialization)
- **작업 내용**: NestJS 프로젝트 생성 및 핵심 파일 코드 분석.
- **주요 파일 설명**:
    1.  **`main.ts` (Entry Point)**: 애플리케이션의 진입점입니다. `NestFactory`를 통해 앱 인스턴스를 생성하고, 포트를 열어 서버를 구동합니다.
    2.  **`app.module.ts` (Root Module)**: 애플리케이션의 루트 모듈입니다. 컨트롤러와 프로바이더(서비스)를 묶어 관리하며, NestJS의 의존성 주입 컨테이너가 참고하는 설정 메타데이터를 제공합니다.
    3.  **`app.controller.ts` (Controller)**: 클라이언트의 HTTP 요청(Request)을 수신하고, 적절한 로직을 수행한 뒤 응답(Response)을 반환하는 역할을 합니다. `@Get()` 등의 데코레이터로 라우팅을 정의합니다.
    4.  **`app.service.ts` (Provider/Service)**: 실제 비즈니스 로직을 담당합니다. `@Injectable()` 데코레이터가 붙어 있어 컨트롤러나 다른 서비스에 주입(Injection)되어 사용될 수 있습니다.

### 1-1-1. 파일 정리 (File Cleanup)
- **작업 내용**: 테스트 관련 파일 및 디렉토리 삭제.
- **삭제 목록**:
    - `src/app.controller.spec.ts`: 유닛 테스트용 파일.
    - `test/`: E2E(End-to-End) 테스트용 폴더.
- **관리 제외**: `.gitignore`에 `node_modules` 등을 추가하여 버전 관리에서 제외.

### 1-2. 클라이언트 프로젝트 초기화 (Client Initialization)
- **작업 내용**: Vite를 사용하여 React + TypeScript 기반의 `client` 프로젝트를 생성하고, 불필요한 초기 파일을 정리했습니다.
- **주요 파일 설명**:
    1.  **`vite.config.ts`**: Vite 빌드 도구 설정 파일입니다.
    2.  **`src/main.tsx`**: React 애플리케이션의 진입점입니다. `index.html`의 root 요소에 React 앱을 마운트합니다.
    3.  **`src/App.tsx`**: 메인 컴포넌트입니다. 현재는 초기화 메시지만 출력하도록 단순화되었습니다.
- **파일 정리**: 사용하지 않는 기본 로고(`react.svg`)와 기본 스타일(`App.css`)을 초기화하여 백지상태에서 시작할 수 있도록 준비했습니다.

