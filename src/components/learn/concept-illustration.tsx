import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { IllustrationKey } from "@/types";

/*
 * 개념 카드 그림. 선은 currentColor(토픽 글자색)라 토픽 색 면 위에 그리고,
 * 면은 디자인 토큰만 써서 라이트/다크에 모두 맞춘다. viewBox는 160×100 고정.
 */

const PAPER = "var(--card)";
const HOT = "var(--primary)";
const DONE = "var(--success)";
const BAD = "var(--danger)";
const WAIT = "var(--info)";

const LABELS: Record<IllustrationKey, string> = {
  "stack-plates": "접시가 아래에서 위로 쌓여 있고, 맨 위에서만 넣고 꺼내는 그림",
  "stack-undo": "작업 카드가 쌓여 있고, 되돌리기 화살표가 맨 위 카드를 가리키는 그림",
  "queue-line": "사람들이 한 줄로 서서 앞에서 나가고 뒤로 들어오는 그림",
  "deque-train": "기차 칸 양쪽 끝에서 모두 넣고 뺄 수 있는 그림",
  "recursion-mirror": "거울 속에 거울이 계속 작아지며 비치는 그림",
  "recursion-dolls": "크기가 점점 작아지는 인형이 나란히 있는 그림",
  "graph-map": "동그라미 장소들이 길로 이어진 지도 그림",
  "graph-matrix": "행과 열이 노드 번호인 표에 연결된 칸이 칠해진 그림",
  "dfs-maze-dive": "한 갈래로 끝까지 내려갔다가 되돌아오는 탐색 경로 그림",
  "bfs-ripple": "가운데서 물결이 한 겹씩 퍼지며 노드를 만나는 그림",
  "backtracking-tree": "갈림길 트리에서 막힌 가지를 잘라 내는 그림",
  "hash-lockers": "이름표가 해시 함수를 거쳐 번호가 붙은 사물함 한 칸으로 바로 들어가는 그림",
  "hash-tally": "과일 이름마다 개수 막대가 붙어 있는 표 그림",
  "sorting-bars": "높이가 뒤섞인 막대들이 낮은 것부터 높은 것 순서로 정리되는 그림",
  "sorting-merge": "정렬된 두 줄의 맨 앞끼리 비교해서 한 줄로 합치는 그림",
  "bsearch-halving": "정렬된 칸들에서 가운데를 보고 절반씩 지워 가며 범위를 좁히는 그림",
  "bsearch-yes-no": "가능·가능·가능 뒤로 불가능이 이어지는 줄에서 그 경계를 찾는 그림",
  "dp-memo-notebook": "한 번 계산한 답을 수첩에 적어 두고 다시 필요할 때 꺼내 쓰는 그림",
  "dp-table-fill": "표의 칸을 왼쪽 위부터 차례로 채우며 위·왼쪽 칸의 값을 더하는 그림",
  "greedy-meetings": "시간 막대 중 일찍 끝나는 회의부터 고르고, 겹치는 회의는 건너뛰는 그림",
  "greedy-counterexample": "6원을 만들 때 큰 동전부터 쓰면 3개, 3원 두 개면 2개라 욕심이 틀리는 반례 그림",
  "tp-squeeze": "정렬된 칸의 양 끝에 손가락을 두고 가운데로 좁혀 오는 그림",
  "tp-window": "칸들 위로 창틀이 오른쪽으로 미끄러지며 늘었다 줄었다 하는 그림",
  "heap-tree": "가장 작은 값이 맨 위에 있고 부모가 자식보다 작은 트리 그림",
  "heap-emergency": "응급실에서 급한 환자가 먼저 들어가는 대기 줄 그림",
  "dijkstra-map": "곧장 가는 길은 10분, 한 마을을 거쳐 돌아가는 길은 2 + 3 = 5분이라 돌아가는 길이 더 빠른 지도 그림",
  "dijkstra-settle": "출발점에서 가까운 마을부터 거리가 확정되고, 다음 후보가 기다리는 그림",
  "uf-groups": "두 그룹이 각자 대표를 가리키고 있고, 한 대표를 다른 대표 밑에 붙여 한 그룹으로 합치는 그림",
  "topo-order": "양말·속옷을 먼저, 그다음 바지, 마지막에 신발을 신는 순서를 화살표로 이은 그림",
  "cx-growth-curves": "N이 커질 때 log N은 거의 평평하고, N은 곧게, N²은 가파르게 치솟는 세 곡선 그림",
  "cx-count-steps": "1부터 N까지 하나씩 더하는 긴 칸 줄과, 공식 한 줄로 끝나는 칸 하나를 나란히 둔 그림",
  "sim-robot-grid": "격자 위 로봇이 화살표를 따라 돌며 걷고, 벽 앞에서 멈추는 그림",
  "sim-rulebook": "번호가 붙은 규칙 목록을 한 줄씩 짚으며 따라 하는 그림",
};

/** 강조 면(HOT) 위 글자. 다크 모드에서도 밝은 보라 위에 어두운 글자가 되도록 */
const ON_HOT = "var(--primary-foreground)";

function Label({
  x,
  y,
  children,
  anchor = "middle",
  fill = "currentColor",
}: {
  x: number;
  y: number;
  children: ReactNode;
  anchor?: "start" | "middle" | "end";
  fill?: string;
}) {
  return (
    <text x={x} y={y} textAnchor={anchor} fontSize={8} fontWeight={700} fill={fill}>
      {children}
    </text>
  );
}

function Arrow({ d }: { d: string }) {
  return (
    <path
      d={d}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      markerEnd="url(#ci-arrow)"
    />
  );
}

function StackPlates() {
  const plates = [0, 1, 2, 3];
  return (
    <>
      <line x1={36} y1={88} x2={124} y2={88} stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" />
      {plates.map((i) => (
        <rect
          key={i}
          x={46 - i}
          y={74 - i * 13}
          width={68 + i * 2}
          height={10}
          rx={5}
          fill={i === 3 ? HOT : PAPER}
          stroke="currentColor"
          strokeWidth={1.8}
        />
      ))}
      <Label x={80} y={29 + 3}>
        top
      </Label>
      <Arrow d="M136 10 Q136 30 120 36" />
      <Label x={140} y={8} anchor="middle">
        push
      </Label>
      <Arrow d="M40 36 Q24 30 24 12" />
      <Label x={24} y={8}>
        pop
      </Label>
    </>
  );
}

function StackUndo() {
  const cards = [
    { x: 30, y: 52, text: "1" },
    { x: 44, y: 38, text: "2" },
    { x: 58, y: 24, text: "3" },
  ];
  return (
    <>
      {cards.map((card, i) => (
        <g key={card.text}>
          <rect
            x={card.x}
            y={card.y}
            width={58}
            height={36}
            rx={6}
            fill={i === 2 ? HOT : PAPER}
            stroke="currentColor"
            strokeWidth={1.8}
          />
          <line
            x1={card.x + 8}
            y1={card.y + 12}
            x2={card.x + 40}
            y2={card.y + 12}
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinecap="round"
            opacity={0.6}
          />
          <line
            x1={card.x + 8}
            y1={card.y + 20}
            x2={card.x + 30}
            y2={card.y + 20}
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinecap="round"
            opacity={0.6}
          />
          <Label x={card.x + 50} y={card.y + 31}>
            {card.text}
          </Label>
        </g>
      ))}
      {/* 중심 (130, 42) 반지름 13, 오른쪽 아래에서 위로 돌아 왼쪽 아래로 (↶) */}
      <Arrow d="M141.3 48.5 A13 13 0 1 0 118.7 48.5" />
      <Label x={130} y={74}>
        되돌리기
      </Label>
    </>
  );
}

function Person({ x, hot = false }: { x: number; hot?: boolean }) {
  return (
    <g>
      <circle cx={x} cy={42} r={7} fill={hot ? HOT : PAPER} stroke="currentColor" strokeWidth={1.8} />
      <path
        d={`M${x - 10} 72 Q${x - 10} 52 ${x} 52 Q${x + 10} 52 ${x + 10} 72 Z`}
        fill={hot ? HOT : PAPER}
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinejoin="round"
      />
    </g>
  );
}

function QueueLine() {
  return (
    <>
      <line
        x1={20}
        y1={76}
        x2={140}
        y2={76}
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        opacity={0.5}
      />
      {[46, 70, 94, 118].map((x, i) => (
        <Person key={x} x={x} hot={i === 0} />
      ))}
      <Arrow d="M34 60 L14 60" />
      <Arrow d="M156 60 L134 60" />
      <Label x={46} y={92}>
        front
      </Label>
      <Label x={118} y={92}>
        rear
      </Label>
    </>
  );
}

function DequeTrain() {
  return (
    <>
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <rect
            x={36 + i * 23}
            y={38}
            width={20}
            height={22}
            rx={4}
            fill={i === 0 || i === 3 ? HOT : PAPER}
            stroke="currentColor"
            strokeWidth={1.8}
          />
          <circle cx={41 + i * 23} cy={64} r={3} fill="currentColor" />
          <circle cx={51 + i * 23} cy={64} r={3} fill="currentColor" />
          {i < 3 && <line x1={56 + i * 23} y1={50} x2={59 + i * 23} y2={50} stroke="currentColor" strokeWidth={2} />}
        </g>
      ))}
      <Arrow d="M10 34 L28 44" />
      <Arrow d="M28 56 L10 66" />
      <Arrow d="M150 34 L132 44" />
      <Arrow d="M132 56 L150 66" />
      <Label x={46} y={86}>
        front
      </Label>
      <Label x={115} y={86}>
        back
      </Label>
    </>
  );
}

function RecursionMirror() {
  const frames = [0, 1, 2, 3, 4];
  return (
    <>
      {frames.map((i) => {
        const w = 120 - i * 24;
        const h = 80 - i * 16;
        return (
          <rect
            key={i}
            x={80 - w / 2}
            y={50 - h / 2}
            width={w}
            height={h}
            rx={8 - i}
            fill={i === 4 ? HOT : PAPER}
            stroke="currentColor"
            strokeWidth={1.8 - i * 0.2}
            opacity={1 - i * 0.08}
          />
        );
      })}
      <Label x={80} y={53} fill={ON_HOT}>
        n
      </Label>
    </>
  );
}

function RecursionDolls() {
  const dolls = [
    { x: 34, s: 1 },
    { x: 76, s: 0.78 },
    { x: 110, s: 0.58 },
    { x: 136, s: 0.4 },
  ];
  return (
    <>
      <line
        x1={12}
        y1={86}
        x2={150}
        y2={86}
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        opacity={0.5}
      />
      {dolls.map(({ x, s }, i) => (
        <g key={x} transform={`translate(${x} 86) scale(${s})`}>
          {/* scale로 선도 같이 얇아지므로 굵기를 되돌려 준다 */}
          <path
            d="M-20 0 Q-24 -30 -12 -40 Q-18 -58 0 -64 Q18 -58 12 -40 Q24 -30 20 0 Z"
            fill={i === 3 ? HOT : PAPER}
            stroke="currentColor"
            strokeWidth={1.8 / s}
            strokeLinejoin="round"
          />
          <circle cx={0} cy={-50} r={7} fill={PAPER} stroke="currentColor" strokeWidth={1.4 / s} />
        </g>
      ))}
      <Label x={34} y={96}>
        n
      </Label>
      <Label x={136} y={96}>
        1
      </Label>
    </>
  );
}

const MAP_NODES = [
  { x: 28, y: 30 },
  { x: 70, y: 18 },
  { x: 56, y: 70 },
  { x: 104, y: 50 },
  { x: 138, y: 22 },
  { x: 132, y: 80 },
];
const MAP_EDGES: [number, number][] = [
  [0, 1],
  [0, 2],
  [1, 3],
  [2, 3],
  [3, 4],
  [3, 5],
];

function GraphMap() {
  return (
    <>
      {MAP_EDGES.map(([a, b]) => (
        <line
          key={`${a}-${b}`}
          x1={MAP_NODES[a]!.x}
          y1={MAP_NODES[a]!.y}
          x2={MAP_NODES[b]!.x}
          y2={MAP_NODES[b]!.y}
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
        />
      ))}
      {MAP_NODES.map((node, i) => (
        <g key={i}>
          <circle
            cx={node.x}
            cy={node.y}
            r={10}
            fill={i === 3 ? HOT : i < 3 ? DONE : PAPER}
            stroke="currentColor"
            strokeWidth={1.8}
          />
          <Label x={node.x} y={node.y + 3} fill={i === 3 ? ON_HOT : undefined}>
            {i}
          </Label>
        </g>
      ))}
    </>
  );
}

const MATRIX = ["0110", "1001", "1001", "0110"];

function GraphMatrix() {
  const size = 16;
  const left = 56;
  const top = 18;
  return (
    <>
      {MATRIX.map((row, r) => (
        <g key={r}>
          <Label x={left - 8} y={top + r * size + 11}>
            {r}
          </Label>
          <Label x={left + r * size + size / 2} y={top - 4}>
            {r}
          </Label>
          {row.split("").map((cell, c) => (
            <rect
              key={c}
              x={left + c * size}
              y={top + r * size}
              width={size}
              height={size}
              fill={cell === "1" ? HOT : PAPER}
              stroke="currentColor"
              strokeWidth={1.2}
            />
          ))}
        </g>
      ))}
      <circle cx={24} cy={40} r={7} fill={PAPER} stroke="currentColor" strokeWidth={1.8} />
      <circle cx={24} cy={72} r={7} fill={PAPER} stroke="currentColor" strokeWidth={1.8} />
      <line x1={24} y1={47} x2={24} y2={65} stroke="currentColor" strokeWidth={2} />
      <Label x={24} y={43}>
        0
      </Label>
      <Label x={24} y={75}>
        1
      </Label>
      <Arrow d="M124 50 L142 50" />
      <Label x={134} y={66}>
        1 = 연결
      </Label>
    </>
  );
}

const TREE_NODES = [
  { x: 80, y: 14 },
  { x: 44, y: 40 },
  { x: 116, y: 40 },
  { x: 26, y: 66 },
  { x: 62, y: 66 },
  { x: 16, y: 90 },
  { x: 38, y: 90 },
];
const TREE_EDGES: [number, number][] = [
  [0, 1],
  [0, 2],
  [1, 3],
  [1, 4],
  [3, 5],
  [3, 6],
];

function DfsMazeDive() {
  const path = new Set([0, 1, 3, 5]);
  return (
    <>
      {TREE_EDGES.map(([a, b]) => {
        const deep = path.has(a) && path.has(b);
        return (
          <line
            key={`${a}-${b}`}
            x1={TREE_NODES[a]!.x}
            y1={TREE_NODES[a]!.y}
            x2={TREE_NODES[b]!.x}
            y2={TREE_NODES[b]!.y}
            stroke="currentColor"
            strokeWidth={deep ? 3 : 1.5}
            strokeLinecap="round"
            opacity={deep ? 1 : 0.5}
          />
        );
      })}
      {TREE_NODES.map((node, i) => (
        <circle
          key={i}
          cx={node.x}
          cy={node.y}
          r={7}
          fill={i === 5 ? HOT : path.has(i) ? DONE : PAPER}
          stroke="currentColor"
          strokeWidth={1.8}
        />
      ))}
      <path
        d="M6 82 Q2 50 30 38"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeDasharray="3 3"
        markerEnd="url(#ci-arrow)"
      />
      <Label x={156} y={70} anchor="end">
        깊이 먼저 ↓
      </Label>
      <Label x={156} y={84} anchor="end">
        막히면 ↑ 돌아오기
      </Label>
    </>
  );
}

function BfsRipple() {
  const rings = [
    { r: 18, nodes: [0, 180] },
    { r: 34, nodes: [60, 130, 250, 320] },
  ];
  return (
    <>
      <circle
        cx={80}
        cy={50}
        r={46}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.2}
        strokeDasharray="3 4"
        opacity={0.4}
      />
      {rings.map((ring, depth) => (
        <g key={ring.r}>
          <circle
            cx={80}
            cy={50}
            r={ring.r}
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            strokeDasharray="4 3"
            opacity={0.7}
          />
          {ring.nodes.map((deg) => {
            const rad = (deg * Math.PI) / 180;
            const x = 80 + ring.r * Math.cos(rad);
            const y = 50 + ring.r * Math.sin(rad);
            return (
              <g key={deg}>
                <circle cx={x} cy={y} r={6} fill={depth === 0 ? DONE : WAIT} stroke="currentColor" strokeWidth={1.6} />
                <Label x={x} y={y + 3}>
                  {depth + 1}
                </Label>
              </g>
            );
          })}
        </g>
      ))}
      <circle cx={80} cy={50} r={7} fill={HOT} stroke="currentColor" strokeWidth={1.8} />
      <Label x={80} y={53} fill={ON_HOT}>
        0
      </Label>
    </>
  );
}

function BacktrackingTree() {
  const pruned = new Set([4]);
  return (
    <>
      {TREE_EDGES.map(([a, b]) => (
        <line
          key={`${a}-${b}`}
          x1={TREE_NODES[a]!.x}
          y1={TREE_NODES[a]!.y}
          x2={TREE_NODES[b]!.x}
          y2={TREE_NODES[b]!.y}
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeDasharray={pruned.has(b) ? "3 3" : undefined}
          opacity={pruned.has(b) ? 0.55 : 1}
        />
      ))}
      <line x1={80} y1={14} x2={116} y2={40} stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
      {TREE_NODES.map((node, i) => (
        <circle
          key={i}
          cx={node.x}
          cy={node.y}
          r={7}
          fill={pruned.has(i) ? BAD : i === 6 ? HOT : PAPER}
          stroke="currentColor"
          strokeWidth={1.8}
        />
      ))}
      <path
        d={`M${TREE_NODES[4]!.x - 4} ${TREE_NODES[4]!.y - 4} l8 8 m0 -8 l-8 8`}
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
      />
      <Label x={156} y={70} anchor="end">
        고르고 들어가고
      </Label>
      <Label x={156} y={84} anchor="end">
        막히면 ✂ 되돌리기
      </Label>
    </>
  );
}

function HashLockers() {
  const lockers = [0, 1, 2, 3, 4];
  return (
    <>
      <rect x={6} y={38} width={34} height={20} rx={10} fill={PAPER} stroke="currentColor" strokeWidth={1.8} />
      <Label x={23} y={51}>
        {'"cat"'}
      </Label>
      <Arrow d="M42 48 L56 48" />
      <rect x={58} y={36} width={30} height={24} rx={6} fill={HOT} stroke="currentColor" strokeWidth={1.8} />
      <Label x={73} y={51} fill={ON_HOT}>
        hash
      </Label>
      <Arrow d="M90 48 Q104 48 110 36" />
      {lockers.map((i) => (
        <g key={i}>
          <rect
            x={106}
            y={8 + i * 17}
            width={46}
            height={15}
            rx={3}
            fill={i === 2 ? DONE : PAPER}
            stroke="currentColor"
            strokeWidth={1.6}
          />
          <Label x={114} y={18.5 + i * 17}>
            {i}
          </Label>
          <circle cx={145} cy={15.5 + i * 17} r={1.6} fill="currentColor" />
        </g>
      ))}
      <Label x={132} y={18.5 + 2 * 17}>
        cat
      </Label>
      <Label x={48} y={80}>
        번호를 계산해서
      </Label>
      <Label x={48} y={92}>
        한 칸으로 바로!
      </Label>
    </>
  );
}

function HashTally() {
  const rows = [
    { name: "apple", count: 3 },
    { name: "kiwi", count: 2 },
    { name: "plum", count: 1 },
  ];
  return (
    <>
      {rows.map((row, i) => (
        <g key={row.name}>
          <rect
            x={14}
            y={14 + i * 24}
            width={48}
            height={18}
            rx={5}
            fill={PAPER}
            stroke="currentColor"
            strokeWidth={1.6}
          />
          <Label x={38} y={26 + i * 24}>
            {row.name}
          </Label>
          <Arrow d={`M64 ${23 + i * 24} L76 ${23 + i * 24}`} />
          {Array.from({ length: row.count }, (_, k) => (
            <rect
              key={k}
              x={80 + k * 20}
              y={15 + i * 24}
              width={16}
              height={16}
              rx={4}
              fill={i === 0 ? HOT : WAIT}
              stroke="currentColor"
              strokeWidth={1.4}
            />
          ))}
          <Label x={152} y={27 + i * 24} anchor="end">
            {row.count}
          </Label>
        </g>
      ))}
      <Label x={80} y={94}>
        count[x] += 1
      </Label>
    </>
  );
}

function SortingBars() {
  const before = [5, 2, 7, 3];
  const after = [2, 3, 5, 7];
  const bar = (x: number, value: number, fill: string) => (
    <rect
      key={x}
      x={x}
      y={80 - value * 8}
      width={11}
      height={value * 8}
      rx={2}
      fill={fill}
      stroke="currentColor"
      strokeWidth={1.6}
    />
  );
  return (
    <>
      <line x1={8} y1={80} x2={70} y2={80} stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
      {before.map((v, i) => bar(14 + i * 14, v, i === 1 ? HOT : PAPER))}
      <Arrow d="M76 50 L90 50" />
      <line x1={96} y1={80} x2={156} y2={80} stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
      {after.map((v, i) => bar(100 + i * 14, v, DONE))}
      <Label x={40} y={94}>
        뒤섞임
      </Label>
      <Label x={126} y={94}>
        작은 것부터
      </Label>
    </>
  );
}

function SortingMerge() {
  const left = [1, 4, 7];
  const right = [2, 3, 9];
  const merged = [1, 2, 3, 4, 7, 9];
  const cell = (x: number, y: number, value: number, fill: string, fg: string = "currentColor") => (
    <g key={`${x}-${y}`}>
      <rect x={x} y={y} width={16} height={14} rx={3} fill={fill} stroke="currentColor" strokeWidth={1.5} />
      <Label x={x + 8} y={y + 10} fill={fg}>
        {value}
      </Label>
    </g>
  );
  return (
    <>
      {left.map((v, i) => cell(14 + i * 19, 12, v, i === 0 ? HOT : PAPER, i === 0 ? ON_HOT : "currentColor"))}
      {right.map((v, i) => cell(96 + i * 19, 12, v, i === 0 ? WAIT : PAPER))}
      <Arrow d="M40 32 Q52 48 62 56" />
      <Arrow d="M120 32 Q108 48 98 56" />
      {merged.map((v, i) => cell(24 + i * 19, 62, v, i < 2 ? DONE : PAPER))}
      <Label x={80} y={94}>
        맨 앞끼리 비교해서 작은 것부터
      </Label>
    </>
  );
}

function BsearchHalving() {
  const cells = [3, 8, 15, 21, 27, 34, 42, 56];
  const rows = [
    { y: 10, lo: 0, hi: 7, mid: 3 },
    { y: 38, lo: 4, hi: 7, mid: 5 },
    { y: 66, lo: 6, hi: 7, mid: 6 },
  ];
  return (
    <>
      {rows.map((row) =>
        cells.map((value, i) => {
          const inside = i >= row.lo && i <= row.hi;
          const isMid = i === row.mid;
          return (
            <g key={`${row.y}-${i}`} opacity={inside ? 1 : 0.3}>
              <rect
                x={8 + i * 18}
                y={row.y}
                width={16}
                height={16}
                rx={3}
                fill={isMid ? (row.y === 66 ? DONE : HOT) : PAPER}
                stroke="currentColor"
                strokeWidth={1.4}
              />
              <Label x={16 + i * 18} y={row.y + 11} fill={isMid && row.y !== 66 ? ON_HOT : "currentColor"}>
                {value}
              </Label>
            </g>
          );
        }),
      )}
      <Label x={80} y={96}>
        가운데를 보고 절반씩 버려요
      </Label>
    </>
  );
}

function BsearchYesNo() {
  const marks = ["O", "O", "O", "O", "X", "X", "X"];
  return (
    <>
      {marks.map((mark, i) => (
        <g key={i}>
          <rect
            x={10 + i * 20}
            y={34}
            width={18}
            height={22}
            rx={4}
            fill={mark === "O" ? DONE : BAD}
            stroke="currentColor"
            strokeWidth={1.6}
          />
          <Label x={19 + i * 20} y={49}>
            {mark}
          </Label>
          <Label x={19 + i * 20} y={70}>
            {i + 1}
          </Label>
        </g>
      ))}
      <line x1={89} y1={24} x2={89} y2={62} stroke="currentColor" strokeWidth={2.5} strokeDasharray="3 3" />
      <Label x={89} y={18}>
        경계
      </Label>
      <Label x={80} y={92}>
        가능한 가장 큰 값 = 4
      </Label>
    </>
  );
}

function DpMemoNotebook() {
  const notes = [
    { k: "f(2)", v: "2" },
    { k: "f(3)", v: "3" },
    { k: "f(4)", v: "5" },
  ];
  return (
    <>
      <rect x={96} y={10} width={56} height={70} rx={6} fill={PAPER} stroke="currentColor" strokeWidth={1.8} />
      <line x1={104} y1={10} x2={104} y2={80} stroke="currentColor" strokeWidth={1} opacity={0.5} />
      {notes.map((note, i) => (
        <g key={note.k}>
          <Label x={110} y={28 + i * 18} anchor="start">
            {note.k}
          </Label>
          <Label x={146} y={28 + i * 18} anchor="end">
            {note.v}
          </Label>
        </g>
      ))}
      <rect x={10} y={30} width={40} height={20} rx={10} fill={HOT} stroke="currentColor" strokeWidth={1.8} />
      <Label x={30} y={43} fill={ON_HOT}>
        f(5)?
      </Label>
      <Arrow d="M52 36 Q74 20 94 28" />
      <Arrow d="M94 64 Q74 72 52 48" />
      <Label x={70} y={94}>
        이미 푼 답은 꺼내 쓰기
      </Label>
    </>
  );
}

function DpTableFill() {
  const values = [
    [1, 1, 1, 1],
    [1, 2, 3, 4],
    [1, 3, null, null],
  ];
  return (
    <>
      {values.map((row, r) =>
        row.map((value, c) => {
          const current = r === 2 && c === 2;
          const source = (r === 1 && c === 2) || (r === 2 && c === 1);
          return (
            <g key={`${r}-${c}`}>
              <rect
                x={30 + c * 26}
                y={8 + r * 24}
                width={22}
                height={20}
                rx={4}
                fill={current ? HOT : source ? WAIT : value === null ? "none" : DONE}
                stroke="currentColor"
                strokeWidth={1.5}
                strokeDasharray={value === null && !current ? "3 3" : undefined}
              />
              <Label x={41 + c * 26} y={22 + r * 24} fill={current ? ON_HOT : "currentColor"}>
                {current ? "6" : value === null ? "" : value}
              </Label>
            </g>
          );
        }),
      )}
      <Label x={80} y={94}>
        위 + 왼쪽 = 이 칸
      </Label>
    </>
  );
}

function GreedyMeetings() {
  const bars = [
    { s: 1, e: 4, pick: true },
    { s: 3, e: 5, pick: false },
    { s: 5, e: 7, pick: true },
    { s: 6, e: 10, pick: false },
    { s: 8, e: 11, pick: true },
  ];
  const x = (t: number) => 14 + t * 12;
  return (
    <>
      <line x1={x(0)} y1={86} x2={x(11)} y2={86} stroke="currentColor" strokeWidth={1.5} opacity={0.6} />
      {bars.map((b, i) => (
        <rect
          key={i}
          x={x(b.s)}
          y={8 + i * 15}
          width={x(b.e) - x(b.s)}
          height={10}
          rx={4}
          fill={b.pick ? DONE : PAPER}
          stroke="currentColor"
          strokeWidth={1.4}
          strokeDasharray={b.pick ? undefined : "3 3"}
          opacity={b.pick ? 1 : 0.6}
        />
      ))}
      <Label x={80} y={98}>
        일찍 끝나는 것부터 고르기
      </Label>
    </>
  );
}

function GreedyCounterexample() {
  const coin = (cx: number, cy: number, value: number, fill: string) => (
    <g key={`${cx}-${cy}`}>
      <circle cx={cx} cy={cy} r={9} fill={fill} stroke="currentColor" strokeWidth={1.6} />
      <Label x={cx} y={cy + 3}>
        {value}
      </Label>
    </g>
  );
  return (
    <>
      <Label x={40} y={16}>
        욕심: 3개
      </Label>
      {[4, 1, 1].map((v, i) => coin(16 + i * 24, 36, v, BAD))}
      <path d="M14 58 l6 6 m0 -6 l-6 6" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
      <Label x={120} y={16}>
        최선: 2개
      </Label>
      {[3, 3].map((v, i) => coin(108 + i * 24, 36, v, DONE))}
      <path d="M106 62 l4 4 l8 -8" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
      <Label x={80} y={92}>
        동전 [4, 3, 1]로 6원 만들기
      </Label>
    </>
  );
}

function TpSqueeze() {
  const values = [1, 3, 4, 6, 8, 11, 14];
  return (
    <>
      {values.map((v, i) => (
        <g key={i}>
          <rect
            x={10 + i * 20}
            y={34}
            width={18}
            height={18}
            rx={4}
            fill={i === 1 || i === 5 ? HOT : PAPER}
            stroke="currentColor"
            strokeWidth={1.5}
          />
          <Label x={19 + i * 20} y={46} fill={i === 1 || i === 5 ? ON_HOT : "currentColor"}>
            {v}
          </Label>
        </g>
      ))}
      <Label x={39} y={70}>
        L
      </Label>
      <Label x={119} y={70}>
        R
      </Label>
      <Arrow d="M40 22 L52 22" />
      <Arrow d="M120 22 L108 22" />
      <Label x={80} y={92}>
        작으면 L을, 크면 R을 옮겨요
      </Label>
    </>
  );
}

function TpWindow() {
  const values = [2, 3, 1, 2, 4, 3, 1];
  return (
    <>
      {values.map((v, i) => (
        <g key={i}>
          <rect
            x={10 + i * 20}
            y={36}
            width={18}
            height={18}
            rx={4}
            fill={i >= 3 && i <= 5 ? DONE : PAPER}
            stroke="currentColor"
            strokeWidth={1.5}
          />
          <Label x={19 + i * 20} y={48}>
            {v}
          </Label>
        </g>
      ))}
      <rect
        x={67}
        y={30}
        width={66}
        height={30}
        rx={6}
        fill="none"
        stroke="currentColor"
        strokeWidth={2.2}
        strokeDasharray="5 3"
      />
      <Arrow d="M112 20 L132 20" />
      <Arrow d="M68 20 L88 20" />
      <Label x={80} y={80}>
        오른쪽을 늘리고, 왼쪽을 줄이고
      </Label>
    </>
  );
}

function HeapTree() {
  const nodes = [
    { x: 80, y: 14, v: 1 },
    { x: 48, y: 42, v: 3 },
    { x: 112, y: 42, v: 5 },
    { x: 32, y: 72, v: 7 },
    { x: 64, y: 72, v: 4 },
    { x: 96, y: 72, v: 9 },
  ];
  const parent = [-1, 0, 0, 1, 1, 2];
  return (
    <>
      {nodes.map((n, i) =>
        parent[i]! >= 0 ? (
          <line
            key={`e${i}`}
            x1={nodes[parent[i]!]!.x}
            y1={nodes[parent[i]!]!.y}
            x2={n.x}
            y2={n.y}
            stroke="currentColor"
            strokeWidth={1.8}
          />
        ) : null,
      )}
      {nodes.map((n, i) => (
        <g key={i}>
          <circle cx={n.x} cy={n.y} r={9} fill={i === 0 ? HOT : PAPER} stroke="currentColor" strokeWidth={1.8} />
          <Label x={n.x} y={n.y + 3} fill={i === 0 ? ON_HOT : "currentColor"}>
            {n.v}
          </Label>
        </g>
      ))}
      <Label x={140} y={17} anchor="end">
        가장 작은 값
      </Label>
      <Label x={80} y={96}>
        부모 ≤ 자식
      </Label>
    </>
  );
}

function HeapEmergency() {
  const queue = [
    { label: "3", fill: WAIT },
    { label: "1", fill: BAD },
    { label: "4", fill: PAPER },
    { label: "2", fill: WAIT },
  ];
  return (
    <>
      <rect x={112} y={26} width={38} height={40} rx={6} fill={PAPER} stroke="currentColor" strokeWidth={1.8} />
      <Label x={131} y={50}>
        진료실
      </Label>
      {queue.map((q, i) => (
        <g key={i}>
          <circle cx={20 + i * 22} cy={46} r={9} fill={q.fill} stroke="currentColor" strokeWidth={1.6} />
          <Label x={20 + i * 22} y={49}>
            {q.label}
          </Label>
        </g>
      ))}
      <Arrow d="M42 30 Q76 10 108 36" />
      <Label x={70} y={86}>
        도착 순서가 아니라 급한 순서(1)부터
      </Label>
    </>
  );
}

function Road({
  x1,
  y1,
  x2,
  y2,
  cost,
  hot = false,
  bad = false,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  cost: string;
  hot?: boolean;
  bad?: boolean;
}) {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  return (
    <>
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke="currentColor"
        strokeWidth={hot ? 3 : 1.6}
        strokeDasharray={bad ? "3 3" : undefined}
        strokeLinecap="round"
      />
      <rect
        x={mx - 7}
        y={my - 6}
        width={14}
        height={11}
        rx={3}
        fill={hot ? HOT : PAPER}
        stroke="currentColor"
        strokeWidth={1}
      />
      <Label x={mx} y={my + 2.5} fill={hot ? ON_HOT : "currentColor"}>
        {cost}
      </Label>
    </>
  );
}

function DijkstraMap() {
  return (
    <>
      <Road x1={22} y1={58} x2={138} y2={58} cost="10" bad />
      <Road x1={22} y1={58} x2={80} y2={20} cost="2" hot />
      <Road x1={80} y1={20} x2={138} y2={58} cost="3" hot />
      {[
        { x: 22, y: 58, label: "출발", fill: DONE },
        { x: 80, y: 20, label: "", fill: PAPER },
        { x: 138, y: 58, label: "도착", fill: DONE },
      ].map((n, i) => (
        <g key={i}>
          <circle cx={n.x} cy={n.y} r={8} fill={n.fill} stroke="currentColor" strokeWidth={1.8} />
          {n.label && (
            <Label x={n.x} y={n.y + 19}>
              {n.label}
            </Label>
          )}
        </g>
      ))}
      <Label x={80} y={94}>
        돌아가도 2 + 3 = 5 &lt; 10
      </Label>
    </>
  );
}

function DijkstraSettle() {
  const nodes = [
    { x: 18, y: 50, d: "0", fill: DONE },
    { x: 58, y: 22, d: "2", fill: DONE },
    { x: 58, y: 78, d: "3", fill: HOT },
    { x: 104, y: 30, d: "7", fill: WAIT },
    { x: 142, y: 70, d: "∞", fill: PAPER },
  ];
  const edges: [number, number][] = [
    [0, 1],
    [0, 2],
    [1, 3],
    [2, 3],
    [3, 4],
    [2, 4],
  ];
  return (
    <>
      {edges.map(([a, b]) => (
        <line
          key={`${a}-${b}`}
          x1={nodes[a]!.x}
          y1={nodes[a]!.y}
          x2={nodes[b]!.x}
          y2={nodes[b]!.y}
          stroke="currentColor"
          strokeWidth={1.6}
          strokeLinecap="round"
        />
      ))}
      {nodes.map((n, i) => (
        <g key={i}>
          <circle cx={n.x} cy={n.y} r={9} fill={n.fill} stroke="currentColor" strokeWidth={1.8} />
          <Label x={n.x} y={n.y + 3} fill={n.fill === HOT ? ON_HOT : "currentColor"}>
            {n.d}
          </Label>
        </g>
      ))}
      <Label x={40} y={98}>
        가까운 곳부터 확정
      </Label>
      <Label x={124} y={14}>
        다음 후보
      </Label>
    </>
  );
}

function UfGroups() {
  const nodes = [
    { x: 38, y: 22, fill: HOT, label: "A" },
    { x: 18, y: 62, fill: PAPER, label: "" },
    { x: 58, y: 62, fill: PAPER, label: "" },
    { x: 122, y: 22, fill: DONE, label: "B" },
    { x: 122, y: 62, fill: PAPER, label: "" },
  ];
  const parent = [-1, 0, 0, -1, 3];
  return (
    <>
      {nodes.map((n, i) =>
        parent[i]! >= 0 ? (
          <Arrow key={`e${i}`} d={`M${n.x} ${n.y - 9} L${nodes[parent[i]!]!.x} ${nodes[parent[i]!]!.y + 11}`} />
        ) : null,
      )}
      <path
        d="M112 22 L50 22"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeDasharray="4 3"
        markerEnd="url(#ci-arrow)"
      />
      {nodes.map((n, i) => (
        <g key={i}>
          <circle cx={n.x} cy={n.y} r={8} fill={n.fill} stroke="currentColor" strokeWidth={1.8} />
          {n.label && (
            <Label x={n.x} y={n.y + 3} fill={n.fill === HOT ? ON_HOT : "currentColor"}>
              {n.label}
            </Label>
          )}
        </g>
      ))}
      <Label x={80} y={14}>
        합치기
      </Label>
      <Label x={80} y={92}>
        대표끼리만 이으면 한 그룹
      </Label>
    </>
  );
}

function TopoOrder() {
  const boxes = [
    { x: 6, y: 16, label: "양말", fill: DONE },
    { x: 6, y: 58, label: "속옷", fill: DONE },
    { x: 60, y: 58, label: "바지", fill: HOT },
    { x: 114, y: 36, label: "신발", fill: PAPER },
  ];
  return (
    <>
      <Arrow d="M46 66 L58 66" />
      <Arrow d="M46 24 L112 42" />
      <Arrow d="M100 64 L112 52" />
      {boxes.map((b) => (
        <g key={b.label}>
          <rect x={b.x} y={b.y} width={40} height={16} rx={4} fill={b.fill} stroke="currentColor" strokeWidth={1.6} />
          <Label x={b.x + 20} y={b.y + 11} fill={b.fill === HOT ? ON_HOT : "currentColor"}>
            {b.label}
          </Label>
        </g>
      ))}
      <Label x={80} y={94}>
        먼저 할 일이 끝난 것부터
      </Label>
    </>
  );
}

function CxGrowthCurves() {
  return (
    <>
      <path d="M18 8 L18 88 L150 88" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" />
      <path d="M18 86 Q60 70 140 64" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
      <path d="M18 88 L140 38" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
      <path d="M18 88 Q92 86 112 10" fill="none" stroke={BAD} strokeWidth={3} strokeLinecap="round" />
      <Label x={146} y={62} anchor="end">
        log N
      </Label>
      <Label x={146} y={34} anchor="end">
        N
      </Label>
      <Label x={120} y={14} anchor="start">
        N²
      </Label>
      <Label x={150} y={98} anchor="end">
        N →
      </Label>
    </>
  );
}

function CxCountSteps() {
  return (
    <>
      {Array.from({ length: 8 }, (_, i) => (
        <rect
          key={i}
          x={8 + i * 12}
          y={24}
          width={10}
          height={14}
          rx={2}
          fill={i === 7 ? HOT : WAIT}
          stroke="currentColor"
          strokeWidth={1.2}
        />
      ))}
      <Label x={56} y={16}>
        1 + 2 + … + N
      </Label>
      <Label x={56} y={52}>
        N번
      </Label>
      <rect x={112} y={24} width={40} height={14} rx={3} fill={DONE} stroke="currentColor" strokeWidth={1.4} />
      <Label x={132} y={16}>
        공식
      </Label>
      <Label x={132} y={52}>
        1번
      </Label>
      <Label x={80} y={84}>
        같은 답, 다른 계산 횟수
      </Label>
    </>
  );
}

function SimRobotGrid() {
  const cell = 16;
  const walls = ["1-2", "2-2"];
  return (
    <>
      {Array.from({ length: 4 }, (_, r) =>
        Array.from({ length: 6 }, (_, c) => {
          const wall = walls.includes(`${r}-${c}`);
          return (
            <rect
              key={`${r}-${c}`}
              x={32 + c * cell}
              y={10 + r * cell}
              width={cell - 2}
              height={cell - 2}
              rx={2}
              fill={wall ? "currentColor" : PAPER}
              stroke="currentColor"
              strokeWidth={0.8}
              opacity={wall ? 0.7 : 1}
            />
          );
        }),
      )}
      <Arrow d="M39 17 L71 17" />
      <Arrow d="M71 17 L71 42" />
      <Arrow d="M71 49 L71 62" />
      <circle cx={71} cy={65} r={5} fill={HOT} stroke="currentColor" strokeWidth={1.4} />
      <Label x={80} y={92}>
        돌고, 걷고, 벽 앞에선 멈춰요
      </Label>
    </>
  );
}

function SimRulebook() {
  const rules = ["1. 앞칸 확인", "2. 벽이면 돌기", "3. 아니면 한 칸"];
  return (
    <>
      <rect x={30} y={8} width={100} height={66} rx={6} fill={PAPER} stroke="currentColor" strokeWidth={1.6} />
      {rules.map((rule, i) => (
        <g key={rule}>
          <rect
            x={38}
            y={16 + i * 19}
            width={84}
            height={14}
            rx={3}
            fill={i === 1 ? HOT : i === 0 ? DONE : WAIT}
            stroke="currentColor"
            strokeWidth={1}
          />
          <Label x={80} y={26 + i * 19} fill={i === 1 ? ON_HOT : "currentColor"}>
            {rule}
          </Label>
        </g>
      ))}
      <Label x={80} y={92}>
        규칙을 빠짐없이 그대로
      </Label>
    </>
  );
}

const DRAWINGS: Record<IllustrationKey, () => ReactNode> = {
  "stack-plates": StackPlates,
  "stack-undo": StackUndo,
  "queue-line": QueueLine,
  "deque-train": DequeTrain,
  "recursion-mirror": RecursionMirror,
  "recursion-dolls": RecursionDolls,
  "graph-map": GraphMap,
  "graph-matrix": GraphMatrix,
  "dfs-maze-dive": DfsMazeDive,
  "bfs-ripple": BfsRipple,
  "backtracking-tree": BacktrackingTree,
  "hash-lockers": HashLockers,
  "hash-tally": HashTally,
  "sorting-bars": SortingBars,
  "sorting-merge": SortingMerge,
  "bsearch-halving": BsearchHalving,
  "bsearch-yes-no": BsearchYesNo,
  "dp-memo-notebook": DpMemoNotebook,
  "dp-table-fill": DpTableFill,
  "greedy-meetings": GreedyMeetings,
  "greedy-counterexample": GreedyCounterexample,
  "tp-squeeze": TpSqueeze,
  "tp-window": TpWindow,
  "heap-tree": HeapTree,
  "heap-emergency": HeapEmergency,
  "dijkstra-map": DijkstraMap,
  "dijkstra-settle": DijkstraSettle,
  "uf-groups": UfGroups,
  "topo-order": TopoOrder,
  "cx-growth-curves": CxGrowthCurves,
  "cx-count-steps": CxCountSteps,
  "sim-robot-grid": SimRobotGrid,
  "sim-rulebook": SimRulebook,
};

export function ConceptIllustration({
  illustration,
  className,
}: {
  illustration: IllustrationKey;
  className?: string;
}) {
  const Drawing = DRAWINGS[illustration];
  return (
    <svg viewBox="0 0 160 100" role="img" aria-label={LABELS[illustration]} className={cn("h-auto w-full", className)}>
      <defs>
        <marker
          id="ci-arrow"
          viewBox="0 0 10 10"
          refX={7}
          refY={5}
          markerWidth={5}
          markerHeight={5}
          orient="auto-start-reverse"
        >
          <path
            d="M1 1 L9 5 L1 9"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </marker>
      </defs>
      <Drawing />
    </svg>
  );
}
