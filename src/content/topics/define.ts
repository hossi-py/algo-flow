import { TOPIC_VISUALIZATIONS } from "@/content/visualizations";
import {
  LEVEL_STAGES,
  type ConceptCard,
  type ConceptLesson,
  type Level,
  type LevelNumber,
  type RecognitionQuestion,
  type TopicSlug,
} from "@/types";

export interface LevelDefinition {
  title: string;
  goal: string;
  problemSlugs: string[];
}

type FiveLevels = readonly [LevelDefinition, LevelDefinition, LevelDefinition, LevelDefinition, LevelDefinition];

/**
 * 5단계 레벨을 만든다. 규칙: Lv1은 개념 완료 + 1문제, Lv2~5는 2문제 해결 시 클리어
 * (문제 수가 그보다 적으면 있는 문제 수만큼).
 */
export function defineLevels(topic: TopicSlug, definitions: FiveLevels): readonly [Level, Level, Level, Level, Level] {
  const build = (index: 0 | 1 | 2 | 3 | 4): Level => {
    const level = (index + 1) as LevelNumber;
    const definition = definitions[index];
    return {
      topic,
      level,
      stage: LEVEL_STAGES[level],
      title: definition.title,
      goal: definition.goal,
      problemSlugs: definition.problemSlugs,
      clearRule: { minSolved: level === 1 ? 1 : 2, requiresConcept: level === 1 },
    };
  };
  return [build(0), build(1), build(2), build(3), build(4)];
}

/**
 * 개념 학습 콘텐츠. 시각화 예시는 모든 토픽에 있고, 개념 카드·퀴즈는 트랙 C에서 채운다
 * (비어 있으면 화면에서 "준비 중"으로 표시).
 */
export function defineConcept(
  topic: TopicSlug,
  content: { cards?: ConceptCard[]; recognitionQuiz?: RecognitionQuestion[] } = {},
): ConceptLesson {
  return {
    topic,
    cards: content.cards ?? [],
    visualizations: TOPIC_VISUALIZATIONS[topic],
    recognitionQuiz: content.recognitionQuiz ?? [],
    passScore: 0.8,
  };
}
