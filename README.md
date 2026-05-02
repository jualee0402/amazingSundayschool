# 큰은혜교회 소년부 선생님 도우미

교회 소년부 출석 체크와 달란트 관리를 위해 제작된 PWA(Progressive Web App)입니다.

## 핵심 기능

*   출석 관리: 학생 및 교사 명단 관리, 간편한 출석 체크 프로세스
*   달란트 통장: 활동별 달란트 부여 및 학생별 누적 데이터 관리
*   행사 일정: 월별 주요 행사 등록 및 조회
*   PWA 지원: 홈 화면 설치를 통한 앱 환경 제공 및 오프라인 접근성 확보
*   데이터 관리: 월별 집계 PDF 출력 및 JSON 파일 기반 백업/복원

## 기술 스택

*   프레임워크: React 18, Vite 5
*   라우팅: React Router v6
*   스타일링: Tailwind CSS 3, Pretendard Font
*   PWA: Vite PWA Plugin
*   데이터 저장: LocalStorage (Key: `amazingGraceSundaySchool`)
*   PDF 생성: jsPDF, jsPDF-AutoTable

## 설치 및 실행

```bash
# 패키지 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build
```

## 프로젝트 구조

```text
src/
├── App.jsx              # 레이아웃 및 라우터 설정
├── main.jsx             # 진입점
├── index.css            # 스타일 정의 및 공통 클래스
├── components/          # 공통 컴포넌트 (Navbar, Modal 등)
├── pages/               # 주요 화면 (Attendance, Talent, Event, Settings 등)
├── hooks/               # 커스텀 훅 (PWA 설치 관리 등)
└── utils/               # 유틸리티 (Storage CRUD, 데이터 처리)
```

## 디자인 설정

`tailwind.config.js`를 통해 일관된 UI 요소를 정의합니다.

*   색상: `ink-900` (#0F172A) 및 기본 Slate/Amber/Emerald/Rose 팔레트 활용
*   효과: 카드형 UI(`shadow-card`) 및 모달용(`shadow-pop`) 그림자 설정
*   전환: `slide-up`, `fade-in` 등 화면 전환 애니메이션 적용

## 데이터 스키마

데이터는 아래의 JSON 구조로 LocalStorage에 유지됩니다.

```json
{
  "students": [{ "id": "", "name": "", "grade": "", "phone": "", "parentPhone": "", "birthday": "", "notes": "" }],
  "teachers": [{ "id": "", "name": "", "role": "", "phone": "", "notes": "" }],
  "attendance": { "YYYY-MM-DD_studentId": true },
  "talents": { "YYYY-MM-DD_studentId": { "attendance": 10, "prayer": 10 } },
  "events": [{ "id": "", "title": "", "date": "", "time": "", "description": "" }],
  "lastBackup": "ISO_TIMESTAMP"
}
