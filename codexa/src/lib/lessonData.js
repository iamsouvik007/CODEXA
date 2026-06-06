import { lessons } from 'virtual:lessons';

/**
 * Static curriculum structure for Web Development track.
 */
export const curriculum = {
  id: 'web-development',
  title: 'Web Development',
  description: 'Master JavaScript from fundamentals to advanced concepts.',
  modules: [
    {
      id: '1',
      title: 'JavaScript Foundations',
      description: 'Understand the origins, environment, and purpose of JavaScript.',
      lessons: ['1', '2', '3', '4'],
    },
  ],
};

/**
 * All available tracks.
 */
export const tracks = [
  { id: 'web-development', title: 'Web Development', status: 'active', icon: 'Globe', lessonCount: lessons.length, color: 'accent' },
  { id: 'dsa', title: 'Data Structures & Algorithms', status: 'coming-soon', icon: 'Binary', lessonCount: 0, color: 'violet' },
  { id: 'system-design', title: 'System Design', status: 'coming-soon', icon: 'Network', lessonCount: 0, color: 'cyan' },
  { id: 'devops', title: 'DevOps', status: 'coming-soon', icon: 'Container', lessonCount: 0, color: 'success' },
  { id: 'genai', title: 'Generative AI', status: 'coming-soon', icon: 'Sparkles', lessonCount: 0, color: 'warning' },
  { id: 'ai-engineering', title: 'AI Engineering', status: 'coming-soon', icon: 'BrainCircuit', lessonCount: 0, color: 'info' },
];

/**
 * Get all lessons in order.
 */
export function getAllLessons() {
  return lessons;
}

/**
 * Get lesson by ID.
 */
export function getLessonById(id) {
  return lessons.find(l => l.id === id) || null;
}

/**
 * Get next lesson.
 */
export function getNextLesson(currentId) {
  const idx = lessons.findIndex(l => l.id === currentId);
  return idx >= 0 && idx < lessons.length - 1 ? lessons[idx + 1] : null;
}

/**
 * Get previous lesson.
 */
export function getPrevLesson(currentId) {
  const idx = lessons.findIndex(l => l.id === currentId);
  return idx > 0 ? lessons[idx - 1] : null;
}

/**
 * Get module by ID.
 */
export function getModuleById(moduleId) {
  return curriculum.modules.find(m => m.id === moduleId) || null;
}

/**
 * Get lessons for a specific module.
 */
export function getLessonsForModule(moduleId) {
  const mod = getModuleById(moduleId);
  if (!mod) return [];
  return mod.lessons.map(id => getLessonById(id)).filter(Boolean);
}
