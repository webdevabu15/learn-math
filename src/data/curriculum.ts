import type { SectionMeta, TopicLesson, TopicMeta } from '../types/math';
import { CURRICULUM_SECTIONS, SECTION_ONE, TOPICS_META } from './curriculumMeta';
import { LESSONS_PART_1 } from './lessonsPart1';
import { LESSONS_PART_2 } from './lessonsPart2';
import { buildSeedLessonForTopic } from './extendedLessons';

export { CURRICULUM_SECTIONS, SECTION_ONE, TOPICS_META };

const SECTION_1_LESSONS: Record<number, TopicLesson> = {
  ...LESSONS_PART_1,
  ...LESSONS_PART_2,
};

const EXTENDED_LESSON_CACHE = new Map<number, TopicLesson>();

export function getSectionMeta(sectionId: number): SectionMeta {
  return CURRICULUM_SECTIONS.find((s) => s.id === sectionId) ?? CURRICULUM_SECTIONS[0];
}

export function getTopicMeta(topicId: number): TopicMeta {
  return TOPICS_META.find((t) => t.id === topicId) ?? TOPICS_META[0];
}

export function getNextTopicMeta(topicId: number): TopicMeta | null {
  const idx = TOPICS_META.findIndex((t) => t.id === topicId);
  if (idx < 0 || idx >= TOPICS_META.length - 1) return null;
  return TOPICS_META[idx + 1];
}

export function getSeedLesson(topicId: number): TopicLesson {
  if (SECTION_1_LESSONS[topicId]) {
    return SECTION_1_LESSONS[topicId];
  }
  const cached = EXTENDED_LESSON_CACHE.get(topicId);
  if (cached) return cached;

  const meta = getTopicMeta(topicId);
  const built = buildSeedLessonForTopic(meta);
  EXTENDED_LESSON_CACHE.set(topicId, built);
  return built;
}

export function filterTopicsByQuery(query: string): TopicMeta[] {
  const q = query.trim().toLowerCase();
  if (!q) return TOPICS_META;
  return TOPICS_META.filter((topic) => {
    const code = (topic.displayCode ?? String(topic.id)).toLowerCase();
    return (
      String(topic.id).includes(q) ||
      code.includes(q) ||
      topic.title.toLowerCase().includes(q) ||
      topic.shortDesc.toLowerCase().includes(q)
    );
  });
}

