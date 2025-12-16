# 프로젝트 작업 계획 (Project Architecture & Plan)

 **NestJS(서버)**와 **React(프론트엔드)**를 기반으로 한 영화 검색 사이트 구축 계획입니다.

## 실행 방법
1. 서버 실행: `cd server` 후 `npm run start`.
2. 클라이언트 실행: `cd client` 후 `npm run dev`.

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


### 2. 백엔드 개발 (Backend Development)
- **작업 내용**: 데이터베이스 스키마 정의(`Prisma`) 및 영화 데이터 API(`MoviesModule`) 구현.
- **주요 파일 설명**:
    1.  **`schema.prisma`**: 사용자(User), 영화(Movie), 댓글(Comment) 등의 데이터 모델을 정의했습니다.
    2.  **`movies.service.ts`**: Axios를 사용하여 TMDB 외부 API를 호출합니다. '최근 개봉 영화'를 가져오기 위해 `/movie/now_playing` 엔드포인트를 사용했습니다.
    3.  **`movies.controller.ts`**: `/movies/top-rated` 주소로 요청이 오면 서비스에게 영화 목록을 달라고 시킵니다.

### 3. 프론트엔드 - 메인 화면 (Frontend - Main)
- **작업 내용**: 서버의 영화 API를 호출하여 화면에 그리드 형태로 보여주는 메인 페이지를 구현했습니다.
- **주요 파일 설명**:
    1.  **`Header.tsx`**: 사이트 상단의 로고와 네비게이션을 담당하는 컴포넌트입니다.
    2.  **`MovieCard.tsx`**: 영화 하나하나를 포스터와 함께 예쁜 카드로 보여주는 컴포넌트입니다. 포스터가 없으면 대체 이미지를 보여줍니다.
    3.  **`HomePage.tsx`**: 메인 페이지 핵심 로직이 들어있습니다. `axios`를 사용해 백엔드(`localhost:3000/movies/top-rated`)에서 데이터를 가져오고, '이전/다음' 버튼으로 페이지를 넘길 수 있게 페이징 기능을 구현했습니다.

### 4. 헤더 업데이트 (Header Update)
- **작업 내용**: 헤더바를 개선하여 검색창, Home, Login/Logout 버튼을 추가했습니다.
- **레이아웃**: `[로고] --- [검색창(중앙)] --- [Home | Login]`
- **주요 변경사항**:
    1.  **검색창**: 텍스트 입력 + 🔍 버튼을 헤더 중앙에 배치.
    2.  **Home/Login**: 우측 정렬.
    3.  **로그인 상태 반영**: `AuthContext`를 통해 로그인 시 "👤 닉네임 님" + Logout 버튼 표시.

### 5. 로그인/회원가입 기능 (Login & Signup)
- **작업 내용**: JWT 기반 인증 시스템 구현 (백엔드 + 프론트엔드).
- **로그인 방식**: 아이디(username) + 비밀번호 (이메일은 선택적 정보로 변경).
- **백엔드 파일**:
    1.  **`auth.service.ts`**: 회원가입(비밀번호 bcrypt 해싱), 로그인(JWT 발급), 아이디 중복 체크 로직.
    2.  **`auth.controller.ts`**: `/auth/register`, `/auth/login`, `/auth/check-username` 엔드포인트.
    3.  **`auth.module.ts`**: JWT 모듈 설정 (7일 유효기간).
    4.  **`jwt.strategy.ts`**: Passport JWT 토큰 검증 전략.
- **프론트엔드 파일**:
    1.  **`AuthContext.tsx`**: 전역 로그인 상태 관리 (user, login, logout, register).
    2.  **`LoginPage.tsx`**: 아이디/비밀번호 입력 폼.
    3.  **`SignupPage.tsx`**: 아이디(중복체크), 비밀번호(확인), 닉네임, 이메일(선택) 입력 폼.
- **Prisma 스키마 변경**:
    - `User.username`: `@unique` (로그인용 PK 역할).
    - `User.nickname`: 댓글에 노출되는 닉네임.
    - `User.email`: 선택적 정보 (`String?`).

### 6. 댓글/대댓글 기능 (Comments & Replies)
- **작업 내용**: 영화 상세 페이지에 댓글/대댓글 CRUD 기능 구현.
- **댓글 정보**: 영화ID, 작성자(닉네임), 작성시간, 별점(0~5), 좋아요/싫어요.
- **대댓글 정보**: 부모댓글ID, 작성자, 작성시간, 좋아요/싫어요.
- **백엔드 파일**:
    1.  **`comments.service.ts`**: 댓글 목록 조회, 댓글/대댓글 작성, 좋아요/싫어요, 삭제 로직.
    2.  **`comments.controller.ts`**: API 엔드포인트:
        - `GET /comments/:movieId` - 영화별 댓글 목록 (대댓글 포함).
        - `POST /comments` - 댓글 작성 (로그인 필요, JWT Guard).
        - `POST /comments/:id/reply` - 대댓글 작성.
        - `POST /comments/:id/like`, `/dislike` - 좋아요/싫어요.
        - `DELETE /comments/:id` - 삭제 (본인만).
    3.  **`comments.module.ts`**: 모듈 정의.
- **프론트엔드 파일**:
    1.  **`CommentSection.tsx`**: 댓글 목록 + 작성 폼 (로그인 시 writable, 비로그인 시 readonly).
    2.  **`CommentCard.tsx`**: 개별 댓글 카드 (별점, 좋아요/싫어요 버튼, 대댓글 토글).
    3.  **`MovieDetailPage.tsx`**: `<CommentSection movieId={id} />` 추가.
- **Prisma 스키마 변경**:
    - `Comment.rating`: 별점 (`Float?`, 대댓글은 null).
    - `Comment.likes`, `Comment.dislikes`: 좋아요/싫어요 카운트 (`Int @default(0)`).

### 7. 검색 기능 (Search Feature)
- **작업 내용**: 텍스트 검색 + 카테고리(장르) 필터 기능 구현.
- **검색 유형**:
    - **전체 검색 (Multi)**: 영화 제목, 배우, 제작사 통합 검색.
    - **영화 제목 검색 (Movie)**: TMDB `/search/movie` API.
    - **배우 검색 (Person)**: TMDB `/search/person` API.
    - **제작사 검색 (Company)**: TMDB `/search/company` API.
    - **장르별 탐색 (Discover)**: TMDB `/discover/movie` API.
- **LLM 연동 대비**: `structuredSearch()` 메서드로 타입/쿼리/장르를 구조화하여 처리. 추후 LLM이 자연어를 파싱해 이 메서드 호출 가능.
- **백엔드 파일**:
    1.  **`movies.service.ts`**: 검색 메서드 추가 (searchMulti, searchMovies, searchPerson, searchCompany, getGenres, discoverByGenre, structuredSearch).
    2.  **`movies.controller.ts`**: API 엔드포인트:
        - `GET /movies/search?q=검색어&type=multi&page=1` - 통합 검색.
        - `GET /movies/genres` - 장르 목록 조회.
        - `GET /movies/discover?genres=28,12&page=1` - 장르별 영화 탐색.
- **프론트엔드 파일**:
    1.  **`SearchPage.tsx`**: 검색 페이지.
        - 검색 타입 라디오 버튼 (전체/영화/배우/제작사).
        - 텍스트 검색 입력.
        - 장르 태그 버튼 (다중 선택 가능).
        - 검색 결과 그리드 + 페이징.
    2.  **`SearchPage.css`**: 스타일링.
    3.  **`App.tsx`**: `/search` 라우트 추가.
- **헤더 연동**: 헤더 검색창에서 검색 시 `/search?q=검색어`로 이동.
