# algo-flow

스택부터 백트래킹까지, 알고리즘을 쉬운 단계부터 순서대로 배우는 학습 플랫폼. 마스코트는 새싹 노드 **노디** 🌱

- 설계 문서: [docs/README.md](docs/README.md)
- 지원 언어: Python, JavaScript

## 실행

Node.js 22.13 이상이 필요합니다 (`packageManager`로 고정한 pnpm 11의 요구 사항).

```bash
pnpm install
pnpm dev          # http://localhost:3000
```

| 명령                        | 설명                                                                                                                  |
| --------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `pnpm dev`                  | 개발 서버                                                                                                             |
| `pnpm build` / `pnpm start` | 프로덕션 빌드 / 실행                                                                                                  |
| `pnpm typecheck`            | 라우트 타입 생성 + `tsc`                                                                                              |
| `pnpm lint`                 | ESLint                                                                                                                |
| `pnpm test`                 | Vitest (진도 규칙, 채점기, JS·Python 하네스, 콘텐츠 무결성, 시각화 generator·플레이어, 개념 학습 화면, 마스코트 렌더) |
| `pnpm validate:content`     | 모든 문제의 Python·JS 정답 코드를 실제 하네스로 실행해 기대값 검증 (Pyodide)                                          |
| `pnpm format`               | Prettier                                                                                                              |

개발 서버에서는 화면 오른쪽 아래 🔧 버튼(개발용 도구)으로 예시 진도 불러오기 · XP 추가 · 축하 연출 · 진도 초기화를 할 수 있습니다. 프로덕션 빌드에는 나타나지 않습니다.

## 구조

```
src/
  app/            라우트 ((app) 그룹 = 사이드바/하단탭 셸)
  components/     common · mascot · layout · dashboard · roadmap · topic · learn · visualizer · workspace · ui(shadcn)
  content/        토픽 · 개념 카드·퀴즈 · 시각화 예시 · 문제 · 유형 신호 (정적 콘텐츠)
  lib/            진도 규칙(xp, streak, unlock, concept) · 시각화(재생 상태 머신, generators) · 실행기 · 날짜 · 모션 · 기능 플래그
  stores/         zustand (게스트 진도는 localStorage)
  types/          데이터 모델 (docs/04와 동일)
content-solutions/  문제별 Python·JS 정답 코드 (클라이언트 번들 제외)
tests/
```
