# 출석체크 웹 애플리케이션

React + TypeScript + Vite + MongoDB + Vercel로 구현한 출석체크 웹 애플리케이션입니다.

## 기능

- 학생 목록 관리
- 출석 체크 (출석, 지각, 미인정)
- 3일 이상 출석하지 않은 학생 목록
- MongoDB 연동

## 기술 스택

- **프론트엔드**: React, TypeScript, Vite, Material-UI
- **백엔드**: Vercel 서버리스 함수
- **데이터베이스**: MongoDB

## 설치 및 실행

1. 저장소 클론
   ```bash
   git clone https://github.com/coco1007/cake.git
   cd cake/attendance-check
   ```

2. 의존성 설치
   ```bash
   npm install
   ```

3. 환경 변수 설정
   - `.env.example` 파일을 `.env`로 복사하고 MongoDB 연결 정보 입력
   ```
   MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority
   ```

4. 개발 서버 실행
   ```bash
   npm run dev
   ```

## 배포 (Vercel)

1. Vercel CLI 설치
   ```bash
   npm install -g vercel
   ```

2. Vercel 로그인
   ```bash
   vercel login
   ```

3. 프로젝트 배포
   ```bash
   vercel
   ```

4. 환경 변수 설정
   - Vercel 대시보드에서 `MONGODB_URI` 환경 변수 등록

## API 엔드포인트

- `GET /api/students`: 학생 목록 조회
- `POST /api/students`: 학생 추가
- `GET /api/attendances`: 출석 목록 조회
- `POST /api/attendances`: 출석 추가

## 라이선스

MIT
