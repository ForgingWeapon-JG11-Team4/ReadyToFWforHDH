# Implementation Plan: Login & Comment Features

## Overview
헤더바 개선, 로그인/회원가입 기능, 그리고 영화 상세 페이지에 댓글/대댓글 기능을 추가합니다.

---

## Phase 1: Header Bar Update

### 1.1 Header Component 수정
#### [MODIFY] `client/src/components/Header.tsx`
- **Search**: 검색 버튼/입력창 추가
- **Home**: 홈으로 이동하는 링크
- **Login/Logout**: 로그인 상태에 따라 버튼 변경

```
[Header Layout]
┌─────────────────────────────────────────────────────┐
│  🎬 Logo   |   Home   |   Search   |   Login/Logout │
└─────────────────────────────────────────────────────┘
```

---

## Phase 2: Authentication (Backend)

### 2.1 Database Schema Update
#### [MODIFY] `server/prisma/schema.prisma`
```prisma
model User {
  id        Int       @id @default(autoincrement())
  username  String    @unique
  password  String    // hashed
  email     String    @unique
  createdAt DateTime  @default(now())
  comments  Comment[]
  replies   Reply[]
}
```

### 2.2 Auth Module 생성
#### [NEW] `server/src/auth/`
- `auth.module.ts`: AuthModule 정의
- `auth.controller.ts`: 
  - `POST /auth/register`: 회원가입
  - `POST /auth/login`: 로그인 (JWT 발급)
  - `GET /auth/check-username/:username`: 아이디 중복 체크
- `auth.service.ts`: 비밀번호 해싱(bcrypt), JWT 생성/검증

### 2.3 Dependencies
```bash
npm install @nestjs/jwt @nestjs/passport passport passport-jwt bcrypt
npm install -D @types/passport-jwt @types/bcrypt
```

---

## Phase 3: Login & Sign-up Pages (Frontend)

### 3.1 Login Page
#### [NEW] `client/src/pages/LoginPage.tsx`
```
┌────────────────────────────┐
│         🎬 Login           │
│  ┌──────────────────────┐  │
│  │ ID:                  │  │
│  └──────────────────────┘  │
│  ┌──────────────────────┐  │
│  │ PW:                  │  │
│  └──────────────────────┘  │
│  [ Login ]                 │
│  [ Sign Up ]               │
└────────────────────────────┘
```

### 3.2 Sign-up Page
#### [NEW] `client/src/pages/SignUpPage.tsx`
```
┌────────────────────────────┐
│       🎬 Sign Up           │
│  ┌──────────────────────┐  │
│  │ ID: [Check Duplicate]│  │
│  └──────────────────────┘  │
│  ┌──────────────────────┐  │
│  │ PW:                  │  │
│  └──────────────────────┘  │
│  ┌──────────────────────┐  │
│  │ Re-PW:               │  │
│  └──────────────────────┘  │
│  ┌──────────────────────┐  │
│  │ Email:               │  │
│  └──────────────────────┘  │
│  [ Sign Up ] [ Cancel ]    │
└────────────────────────────┘
```

### 3.3 Auth Context
#### [NEW] `client/src/context/AuthContext.tsx`
- 전역 로그인 상태 관리 (React Context)
- `user`, `login()`, `logout()`, `isLoggedIn` 제공

### 3.4 Routing Update
#### [MODIFY] `client/src/App.tsx`
- `/login` -> `LoginPage`
- `/signup` -> `SignUpPage`

---

## Phase 4: Comment System (Backend)

### 4.1 Database Schema
#### [MODIFY] `server/prisma/schema.prisma`
```prisma
model Comment {
  id        Int       @id @default(autoincrement())
  movieId   Int       // TMDB Movie ID
  authorId  Int
  author    User      @relation(fields: [authorId], references: [id])
  content   String
  rating    Float     // 별점 (0.0 ~ 5.0)
  likes     Int       @default(0)
  dislikes  Int       @default(0)
  createdAt DateTime  @default(now())
  replies   Reply[]
}

model Reply {
  id        Int       @id @default(autoincrement())
  commentId Int
  comment   Comment   @relation(fields: [commentId], references: [id])
  authorId  Int
  author    User      @relation(fields: [authorId], references: [id])
  content   String
  likes     Int       @default(0)
  dislikes  Int       @default(0)
  createdAt DateTime  @default(now())
}
```

### 4.2 Comments Module
#### [NEW] `server/src/comments/`
- `comments.module.ts`
- `comments.controller.ts`:
  - `GET /comments/:movieId`: 특정 영화의 댓글 목록
  - `POST /comments`: 댓글 작성 (Auth 필요)
  - `POST /comments/:id/like`: 좋아요
  - `POST /comments/:id/dislike`: 싫어요
  - `DELETE /comments/:id`: 댓글 삭제 (본인만)
- `comments.service.ts`: CRUD 로직

### 4.3 Replies Module
#### [NEW] `server/src/replies/`
- `replies.controller.ts`:
  - `POST /replies`: 대댓글 작성 (Auth 필요)
  - `POST /replies/:id/like`: 좋아요
  - `POST /replies/:id/dislike`: 싫어요
  - `DELETE /replies/:id`: 대댓글 삭제 (본인만)

---

## Phase 5: Comment UI (Frontend)

### 5.1 Comment Section Component
#### [NEW] `client/src/components/CommentSection.tsx`
- 댓글 목록 표시
- 로그인 시: 댓글 작성 폼 활성화
- 비로그인 시: 읽기 전용 (작성 폼 숨김 또는 비활성화)

### 5.2 Comment Card Component
#### [NEW] `client/src/components/CommentCard.tsx`
- 작성자, 작성시간, 별점, 내용 표시
- 좋아요/싫어요 버튼
- 대댓글 토글

### 5.3 Reply Component
#### [NEW] `client/src/components/ReplyCard.tsx`
- 대댓글 표시 (작성자, 시간, 내용)
- 좋아요/싫어요 버튼

### 5.4 MovieDetailPage Update
#### [MODIFY] `client/src/pages/MovieDetailPage.tsx`
- `<CommentSection movieId={id} />` 추가

---

## Verification Plan

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Header에서 Login 클릭 | `/login` 페이지로 이동 |
| 2 | Sign Up 후 로그인 | JWT 토큰 저장, Header에 Logout 표시 |
| 3 | 영화 상세 페이지에서 댓글 작성 | 댓글 목록에 추가됨 |
| 4 | 비로그인 상태로 댓글 시도 | 작성 불가 (readonly) |
| 5 | 좋아요/싫어요 클릭 | 카운트 업데이트 |

---

## File Summary

| Location | Files | Description |
|----------|-------|-------------|
| `server/src/auth/` | 3 files | 인증 모듈 (JWT, bcrypt) |
| `server/src/comments/` | 3 files | 댓글 CRUD |
| `server/src/replies/` | 3 files | 대댓글 CRUD |
| `client/src/pages/` | 2 files | LoginPage, SignUpPage |
| `client/src/components/` | 3 files | CommentSection, CommentCard, ReplyCard |
| `client/src/context/` | 1 file | AuthContext |
