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

로그인 없이 바로 쓸 수 있고, 진도는 이 브라우저(localStorage)에 저장됩니다.

### 환경 변수

`.env.example`을 `.env.local`로 복사해 채웁니다. 비워 두면 해당 기능만 꺼지고 화면에 안내가 나옵니다.

| 변수                                    | 용도                                                                                      |
| --------------------------------------- | ----------------------------------------------------------------------------------------- |
| `ANTHROPIC_API_KEY`                     | AI 코치 · AI 맞춤 문제 생성                                                               |
| `AI_COACH_MODEL` / `AI_GENERATOR_MODEL` | 모델 ID (기본 `claude-opus-5`)                                                            |
| `AI_MOCK=1`                             | 개발 전용 모의 AI. 키 없이 코치 스트리밍·가드 재작성, 생성 → 검증 실패 → 재생성 흐름 확인 |

## 명령

| 명령                        | 설명                                                                                                                        |
| --------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `pnpm dev`                  | 개발 서버                                                                                                                   |
| `pnpm build` / `pnpm start` | 프로덕션 빌드 / 실행                                                                                                        |
| `pnpm typecheck`            | 라우트 타입 생성 + `tsc`                                                                                                    |
| `pnpm lint`                 | ESLint                                                                                                                      |
| `pnpm test`                 | Vitest (진도 규칙, 채점기, JS·Python 하네스, 시각화, 개념 학습 화면, AI 코치 가드·문제 생성 파이프라인·서버 Python 러너 등) |
| `pnpm validate:content`     | 모든 문제의 Python·JS 정답 코드를 실제 하네스로 실행해 기대값 검증 (Pyodide)                                                |
| `pnpm ai:smoke [횟수]`      | 실제 Claude API로 AI 문제를 여러 번(기본 10회) 생성·검증해 통과율 확인 (API 비용 발생)                                      |
| `pnpm format`               | Prettier                                                                                                                    |

개발 서버에서는 화면 오른쪽 아래 🔧 버튼(개발용 도구)으로 예시 진도 불러오기 · XP 추가 · 축하 연출 · 진도 초기화를 할 수 있습니다. 프로덕션 빌드에는 나타나지 않습니다.

## 구조

```
src/
  app/            라우트 ((app) 그룹 = 사이드바/하단탭 셸, (workspace) = 풀이 화면, api/ = AI 코치·문제 생성)
  components/     common · mascot · layout · dashboard · roadmap · topic · learn · visualizer · workspace · coach · ai-lab · ui(shadcn)
  content/        토픽 · 개념 카드·퀴즈 · 시각화 예시 · 문제 · 유형 신호 · 패턴 이름 (정적 콘텐츠)
  lib/            진도 규칙 · 시각화 · 실행기(브라우저) · runner-node(서버 Python) · ai(코치·생성 파이프라인) · server · 날짜 · 모션
  stores/         zustand (게스트 진도·코드 초안·코치 대화는 localStorage)
  types/          데이터 모델 (docs/04와 동일)
content-solutions/  문제별 Python·JS 정답 코드 (클라이언트 번들 제외)
tests/
```
