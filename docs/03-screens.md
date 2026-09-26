# 03. 화면 목록 & 컴포넌트 분할

## 0. 화면 맵

| 화면 | 경로 | 셸 | 핵심 질문 (사용자가 이 화면에서 알아야 할 것) |
| --- | --- | --- | --- |
| 대시보드 | `/` | App | "오늘 뭘 하면 되지?" |
| 로드맵 | `/roadmap` | App | "나는 어디까지 왔고, 다음은 뭐지?" |
| 주제 홈 | `/topics/[topic]` | App | "이 주제는 어떤 순서로 배우지?" |
| 개념 학습 | `/topics/[topic]/learn` | App | "이게 뭐고, 어떻게 움직이고, 문제에서 어떻게 알아보지?" |
| 문제 풀이 | `/problems/[slug]`, `/ai-lab/problems/[id]` | Workspace | "어떻게 접근하지? 내 코드는 맞았나?" |
| 섞어 풀기 | `/practice` | App | "토픽을 모르고 문제만 봐도 알아볼 수 있나?" |
| 랭킹 | `/ranking` | App | "이번 주 나는 몇 등이지?" |
| AI 문제 생성 | `/ai-lab` | App | "내 약점에 맞는 문제를 더 풀고 싶어" |
| 마이페이지 | `/me` | App | "나는 뭘 잘하고 뭘 못하지?" |
| 로그인 | `/auth/login` | 없음 | "진도를 저장하고 싶어" (게스트도 모든 학습 가능) |

## 1. 공통 셸

```
Desktop (≥1024)                              Mobile (<768)
┌────────┬──────────────────────────┐        ┌────────────────────┐
│ 🌱노디  │ TopBar: 페이지 제목   🔥3 ⭐240│        │ TopBar  🔥3 ⭐240   │
│ 홈      │                          │        │                    │
│ 로드맵  │        <page />          │        │     <page />       │
│ AI 랩   │                          │        │                    │
│ 마이    │                          │        ├────────────────────┤
│ ─────   │                          │        │ 🏠  🗺️  ✨  🙂       │ ← BottomTabBar
│ 테마토글│                          │        └────────────────────┘
└────────┴──────────────────────────┘
```

```
AppShell
├─ SideNav (lg+)           : NavItem × 4, MiniNodi(idle), ThemeToggle
├─ TopBar                  : PageTitle, StreakFlame, XpPill, UserMenu(로그인/게스트 배지)
├─ BottomTabBar (<lg)      : NavItem × 4 (활성 탭은 primary-soft 알약 배경 + 통통 이동)
└─ <main>                  : 페이지
Celebration (포털)          : 정답·레벨업·배지 연출 전역 레이어
```

---

## 2. 대시보드 `/`

```
┌─────────────────────────────────────────────────────────┐
│ GreetingHero  [노디 idle]  "좋은 아침이에요! 오늘도 한 칸 전진해요" │
│               DailyGoalCard: 오늘 목표 30XP ▓▓▓▓░░ 20/30      │
├──────────────────────────────┬──────────────────────────┤
│ ContinueCard                 │ StatStrip                 │
│ "DFS Lv3 · 꽃밭 구역 나누기"   │ 🔥 연속 3일  ⭐ 240XP  🏅 4 │
│ 힌트 2/4 사용 · [이어서 풀기]  │ WeekActivity (월~일 7칸)   │
├──────────────────────────────┴──────────────────────────┤
│ RecommendCard (약점 기반): "BFS 최단 거리가 조금 약해요 → AI 문제 받아보기" │
├─────────────────────────────────────────────────────────┤
│ TopicProgressRow: 토픽 16개 가로 스크롤 카드 (진행률 링)           │
└─────────────────────────────────────────────────────────┘
```

| 컴포넌트 | 역할 | 데이터 |
| --- | --- | --- |
| `GreetingHero` | 시간대별 인사 + 노디 | `profile.nickname`, 사용자 레벨(새싹 성장) |
| `DailyGoalCard` | 오늘 XP 목표 진행 바 | `activity_days[today]`, `profile.dailyGoalXp` |
| `ContinueCard` | 마지막으로 시도한 미해결 문제 | `problem_progress` 최신 `attempted` |
| `StatStrip` | 스트릭, XP, 배지 수 | `user_stats` |
| `WeekActivity` | 이번 주 7일 학습 여부 도트 | `activity_days` |
| `RecommendCard` | 약점 패턴 1개 + AI 문제 CTA | `weakness.ts` 결과 |
| `TopicProgressRow` | 토픽 카드(잠금/진행률) | 콘텐츠 + `unlock.ts` |

빈 상태: 첫 방문 → ContinueCard 자리에 노디 `curious` + "스택부터 시작해볼까요?" [첫 개념 보러가기]

---

## 3. 로드맵 `/roadmap`

구불구불한 "숲길" 위에 토픽 노드 16개가 놓인 형태(데스크톱은 세로 지그재그, 모바일은 세로 일렬).

```
      (스택)●━━━━┓
                 ┃
        ┏━━━━●(큐/덱)
        ┃
      (재귀)●━━━━┓          ● 해제됨(토픽색)   ◐ 진행 중(진행률 링)
                 ┃          🔒 잠금(회색 + 조건 툴팁: "재귀 Lv3을 클리어하면 열려요")
   ...  🔒(백트래킹) ━━ 🔒(해시) ━━ 🔒(정렬) ━━ 🔒(이분 탐색) ━━ 🔒(DP) ━━ 🔒(그리디) ━━ 🔒(두 포인터) ━━ 🔒(힙) ━━ 🔒(다익스트라) ━━ 🔒(그래프 심화)
```

```
RoadmapPage
├─ RoadmapHeader        : 전체 진행률, 현재 위치 안내
├─ RoadmapPath (SVG)    : 길(path) + 발자국 애니메이션
│  └─ TopicNode × 16    : 아이콘, 진행률 링, 상태(locked/available/in-progress/mastered)
│     └─ LevelSteps     : (클릭 시 펼침) Lv1~Lv5 칩, 각 레벨 문제 수/해결 수
├─ LockTooltip          : 잠금 해제 조건
└─ ComingSoonNode       : 준비 중인 토픽 (흐리게, "곧 열려요"). 지금은 모든 토픽이 열려 있어 표시하지 않는다
```
노디는 사용자가 현재 있는 토픽 노드 옆에 서 있다.

---

## 4. 주제 홈 `/topics/[topic]`

```
TopicPage
├─ TopicHeader            : 토픽 색 배경, 제목·한 줄 비유("접시 쌓기"), 진행률
├─ LearningFlowStepper    : ①개념 카드 ②시각화 ③유형 인식 ④문제 풀이 ⑤AI 맞춤 문제 (현재 단계 강조)
├─ SignalPreview          : 이 토픽을 의심해야 할 신호 3개 (칩)
└─ LevelSection × 5       : Lv 배지 + 단계명(개념 이해/기본 구현/대표 유형/응용/실전) + 잠금 상태
   └─ ProblemListItem × n : 제목, 예상 시간, 상태(미시도/시도/해결 ✓), 힌트 사용 수, XP
```

---

## 5. 개념 학습 `/topics/[topic]/learn`

세 단계를 한 페이지에서 순서대로 진행(상단 스텝 탭, 주소 해시 `#visualize`·`#signals`로 바로 열기). 단계는 잠그지 않고, 완료한 단계에 체크를 표시하며 각 단계 끝의 버튼이 다음 단계로 안내한다. (카드가 아직 없는 토픽도 시각화는 볼 수 있어야 하므로)

```
LearnPage
├─ LearnStepTabs              : [1 개념 카드] [2 시각화 탐색] [3 유형 인식 훈련]
├─ (1) ConceptCardDeck        : 스와이프/화살표로 넘기는 카드 묶음
│     └─ ConceptCard          : ConceptIllustration(SVG) + 비유 + 설명 + 핵심 포인트 + (선택) 코드
├─ (2) VisualizationExplorer
│     ├─ PresetPicker         : "push/pop 기본", "괄호 검사" 등 프리셋
│     ├─ InputEditor          : 입력값 직접 바꾸기 (예: 괄호 문자열)
│     └─ Player               : (시각화 엔진, 7절 참고)
└─ (3) PatternSignalTrainer
      ├─ SignalCard × n       : "이런 표현이 나오면 → 이 알고리즘" + 이유 + 함정
      └─ RecognitionQuiz      : 문제 일부를 보고 알고리즘 고르기 (5문항, 80% 이상 통과)
          └─ QuizFeedback     : 정답 근거가 된 신호 문구를 형광펜처럼 하이라이트
```

---

## 6. 문제 풀이 `/problems/[slug]` ★ 핵심 화면

```
Desktop (≥1024) — ResizablePanelGroup (가로 3분할, 각 패널 최소 280px)
┌─────────────────┬───────────────────────────┬──────────────────┐
│ [문제][힌트][코치] │ CodeEditor (Monaco)        │ Visualizer        │
│                 │                           │ [예제1 ▾] 프리셋   │
│ ProblemPanel    │                           │  GridView         │
│  제목·Lv·태그     │                           │  CallStackView    │
│  설명/입출력/제약 │                           │  StepMessage      │
│  예제 표         │───────── (세로 분할) ──────│  PseudocodeView   │
│                 │ RunBar [▶ 예제 실행][제출] │ PlayerControls    │
│                 │ [콘솔][테스트 결과]          │ ⏮ ◀ ▶/⏸ ▶ ⏭ 1x  │
└─────────────────┴───────────────────────────┴──────────────────┘

Mobile · Tablet (<1024)
┌───────────────────┐
│ ← 꽃밭 구역  Lv3   │
│ [문제|힌트|AI 코치|코드|시각화] │ ← MobileTabs (한 줄, 서브탭 없음)
│                   │
│   (선택된 탭)       │
│                   │
├───────────────────┤
│ [▶ 실행] [제출]    │ ← 코드 탭에서만 고정 표시
└───────────────────┘
```

```
Workspace (problem, initialProgress)
├─ WorkspaceHeader         : 뒤로가기, 제목, LevelBadge, TopicChip, 타이머(선택), 설정
├─ ResizableLayout (lg+) / MobileTabs (<lg)
│  ├─ LeftPanel (Tabs)
│  │  ├─ ProblemPanel      : Markdown(statement), IOFormat, ConstraintList, ExampleTable
│  │  ├─ HintStack         : HintCard × 4
│  │  │   └─ HintCard      : 잠김(자물쇠 + "열면 XP -10%") → 확인 다이얼로그 → 펼침
│  │  │                      순서 강제: n번은 n-1번을 연 뒤에만 열 수 있음
│  │  └─ CoachPanel        : CoachMessage 목록(노디 아바타 mood 반영), SuggestedQuestions, CoachInput
│  ├─ CenterPanel (세로 분할)
│  │  ├─ EditorPanel       : CodeEditor(Monaco, 커스텀 파스텔 테마 light/dark), 초기화/폰트 크기
│  │  └─ OutputPanel
│  │     ├─ RunBar         : 실행/제출 버튼, 실행 중 스피너(노디 loading), 엔진 로딩 상태
│  │     ├─ VerdictBanner  : AC/WA/TLE/RE 결과 + 노디 표정 + 격려 문구
│  │     ├─ TestResultList : TestResultRow × n (통과 ✓ / 실패 시 입력·기대·실제 diff)
│  │     └─ ConsoleOutput  : print 출력, 에러 트레이스(사용자 코드 줄 번호 링크 → 에디터 이동)
│  └─ RightPanel
│     └─ Player (preset = problem.visualization)
└─ Celebration             : 정답 시 전역 연출 + LevelClearModal
```

상태 관리 (`workspace-store`)
| 상태 | 저장 위치 |
| --- | --- |
| 코드 초안 | 문제별 localStorage 자동 저장(500ms 디바운스), 로그인 시 `problem_progress.last_code` |
| 열린 힌트 단계 | `problem_progress.max_hint_opened` |
| 실행 결과 | 메모리 |
| 패널 비율 | `settings-store` |

---

## 7. 시각화 플레이어 (공용 컴포넌트)

```
Player (steps: VisualizationStep[], pseudocode?: string[])
├─ StageCanvas            : state에 있는 레이어만 렌더
│  ├─ StackView           : 아래에서 위로 쌓이는 접시 (layoutId로 push/pop 애니메이션)
│  ├─ QueueView / DequeView : 좌→우 줄서기, front/rear 라벨
│  ├─ GraphView           : SVG 노드/간선, 방문 순서 번호 배지, distance 라벨
│  ├─ GridView            : 격자 셀(구역별 색), 커서(노디 발자국), 검사 중인 이웃 표시
│  ├─ CallStackView       : 함수 호출 프레임 카드 (active는 위, 지역 변수 표시)
│  └─ VariablesView       : 주요 변수 값 (sizes = [3])
├─ StepMessage            : 현재 스텝 설명 (한국어 한 문장)
├─ PseudocodeView         : codeLine 하이라이트
└─ PlayerControls         : 처음 ⏮ / 이전 ◀ / 재생·일시정지 / 다음 ▶ / 끝 ⏭ / 속도(0.5x·1x·2x) / 스크럽 슬라이더
                            키보드: Space 재생, ←/→ 한 단계
```

---

## 8. AI 문제 생성 `/ai-lab`

```
AiLabPage
├─ WeaknessSummary        : 약한 패턴 Top3 (막대 + 근거: "BFS 최단 거리 문제 정답률 40%, 평균 힌트 3단계")
├─ GenerateForm           : 토픽 선택, 레벨(Lv2~Lv5), 집중 패턴(약점 자동 선택, 수정 가능), [문제 만들기]
├─ GenerationProgress     : ① 문제 쓰는 중 → ② 정답 코드로 검증 중 → ③ 완성! (노디 loading → happy)
│                           실패 재시도 시 "검증에서 떨어져서 다시 만들고 있어요 (2/3)"
└─ GeneratedProblemList   : 검증 완료 문제 카드 (제목, 토픽, 레벨, 태그, 해결 여부) → 풀이 화면
```
사용 제한: 로그인 사용자만, 하루 10회(비용 보호).

---

## 9. 마이페이지 `/me`

```
MePage
├─ ProfileCard            : 닉네임, 노디(현재 성장 단계 + 꽃), 사용자 레벨, 가입일
├─ StatsOverview          : 총 XP, 해결 문제 수, 최장 스트릭, 힌트 없이 푼 비율
├─ ActivityHeatmap        : 최근 12주 잔디(토픽 컬러 아닌 primary 농도)
├─ WeaknessChart          : 패턴별 숙련도 가로 막대 (강함→약함 정렬)
├─ BadgeShelf             : 획득/미획득 배지 (미획득은 실루엣 + 조건)
├─ SubmissionHistory      : 최근 제출 목록 (verdict 칩, 문제, 시각) → 코드 다시 보기
└─ SettingsForm           : 닉네임, 일일 목표 XP, 테마, 에디터 글꼴 크기, 게스트 데이터 가져오기
```

## 10. 섞어 풀기 `/practice`

```
PracticePage
├─ Setup     : 문제 수(5·10), 출제 범위(모든 토픽 / 열린 토픽만 — 3개 이상 열렸을 때), 지난 기록(정답률, 자주 헷갈린 토픽)
├─ Question  : 진행 막대, 문제 본문 + 제약 조건 (제목·토픽·레벨은 숨김), 4지선다 → 정답 여부 · 근거 신호 · "이 문제 풀어 보기"(새 탭)
└─ Summary   : 점수 + 노디 표정, 문제별 정답 토픽 / 내 선택, 헷갈린 토픽의 신호 다시 보기 링크, 새 문제로 다시
```
