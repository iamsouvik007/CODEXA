import { lessons } from 'virtual:lessons';

/**
 * Static curriculum structure for Web Development track.
 */
export const curriculum = {
  id: 'web-development',
  title: 'Web Development',
  description: 'Master JavaScript from fundamentals to advanced concepts.',
  tracks: [
    {
      id: 'html',
      title: 'HTML',
      status: 'coming-soon',
      modules: [
        {
          id: 'html-fundamentals',
          title: 'HTML Foundations',
          status: 'coming-soon',
          lessons: []
        }
      ]
    },
    {
      id: 'css',
      title: 'CSS',
      status: 'coming-soon',
      modules: [
        {
          id: 'css-fundamentals',
          title: 'CSS Foundations',
          status: 'coming-soon',
          lessons: []
        }
      ]
    },
    {
      id: 'javascript',
      title: 'JavaScript',
      status: 'active',
      modules: [
        {
          id: 'fundamentals',
          title: 'Fundamentals',
          lessons: ['1', '2', '3', '4'],
        },
        {
          id: 'functions',
          title: 'Functions',
          status: 'coming-soon',
          lessons: []
        },
        {
          id: 'arrays',
          title: 'Arrays',
          status: 'coming-soon',
          lessons: []
        },
        {
          id: 'objects',
          title: 'Objects',
          status: 'coming-soon',
          lessons: []
        },
        {
          id: 'dom',
          title: 'DOM',
          status: 'coming-soon',
          lessons: []
        },
        {
          id: 'async',
          title: 'Async JavaScript',
          status: 'coming-soon',
          lessons: []
        },
        {
          id: 'es6',
          title: 'ES6+',
          status: 'coming-soon',
          lessons: []
        },
        {
          id: 'projects',
          title: 'Projects',
          status: 'coming-soon',
          lessons: []
        }
      ]
    }
  ]
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

