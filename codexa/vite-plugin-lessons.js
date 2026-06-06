/* global process */
import fs from 'fs';
import path from 'path';
import { marked } from 'marked';

const VIRTUAL_MODULE_ID = 'virtual:lessons';
const RESOLVED_ID = '\0' + VIRTUAL_MODULE_ID;

/**
 * Classifies a section based on its heading and content.
 */
function classifySection(heading, content) {
  const h = (heading || '').toLowerCase();
  const c = (content || '').toLowerCase();

  if (/warning|gotcha|danger|critical|caution/i.test(h)) return 'warning';
  if (/common mistake|don['']t|avoid|misconception/i.test(h)) return 'misconception';
  if (/interview|tip/i.test(h) && !/template/i.test(h)) return 'interview-tip';
  if (/summary|takeaway|key point|one-sentence/i.test(h)) return 'summary';
  if (/analogy|imagine|think of it|like a/i.test(h)) return 'analogy';
  if (/visual|explanation|diagram/i.test(h)) return 'visual';
  if (/resource|link/i.test(h)) return 'resources';
  if (/practice|exercise/i.test(h)) return 'practice';

  // Check content patterns
  if (/imagine you|think of it as|it['']s like|analogy/i.test(c.slice(0, 200))) return 'analogy';
  if (/⚠️|warning:|gotcha:/i.test(c.slice(0, 100))) return 'warning';
  if (/common mistake|don['']t do/i.test(c.slice(0, 150))) return 'misconception';
  if (/interview|💼/i.test(c.slice(0, 100))) return 'interview-tip';

  return 'concept';
}

/**
 * Extracts code blocks from markdown content.
 */
function extractCodeBlocks(markdown) {
  const codeBlockRegex = /```(\w*)\n([\s\S]*?)```/g;
  const blocks = [];
  let match;
  while ((match = codeBlockRegex.exec(markdown)) !== null) {
    blocks.push({
      language: match[1] || 'javascript',
      code: match[2].trim(),
    });
  }
  return blocks;
}

/**
 * Extracts tables from HTML content.
 */
function extractTables(html) {
  const tableRegex = /<table[\s\S]*?<\/table>/gi;
  const tables = [];
  let match;
  while ((match = tableRegex.exec(html)) !== null) {
    tables.push(match[0]);
  }
  return tables;
}

/**
 * Estimates reading time based on word count.
 */
function estimateReadingTime(text) {
  const words = text.replace(/<[^>]+>/g, '').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

function determineDifficulty(sections, codeBlocks) {
  return 'beginner';
}

/**
 * Generates quiz questions from lesson content.
 */
function generateQuizzes(sections, codeBlocks, title) {
  const quizzes = [];

  // MCQ from concept sections with key definitions
  for (const section of sections) {
    if (section.type === 'concept' && section.heading) {
      // Look for definition patterns
      const defMatch = section.rawContent.match(/\*\*(.+?)\*\*[:\s]+(.+?)(?:\.|$)/);
      if (defMatch) {
        quizzes.push({
          type: 'mcq',
          question: `What is ${defMatch[1]}?`,
          options: [
            defMatch[2].trim().slice(0, 100),
            'A method that modifies the original array',
            'A global variable in the browser window',
            'A reserved keyword that cannot be used',
          ],
          correct: 0,
          explanation: `According to the lesson: ${defMatch[2].trim().slice(0, 150)}`,
          sourceSection: section.heading,
        });
      }
    }
  }

  // Predict Output from code blocks that have console.log
  for (const block of codeBlocks) {
    const logMatch = block.code.match(/console\.log\((.+?)\);\s*\/\/\s*(?:Outputs?:?\s*)?(.+)/);
    if (logMatch) {
      const expr = logMatch[1].trim();
      const output = logMatch[2].trim();
      quizzes.push({
        type: 'predict-output',
        question: `What will this code output?`,
        code: block.code.split('\n').slice(0, 8).join('\n'),
        options: [
          output,
          output === 'true' ? 'false' : 'true',
          'undefined',
          'Error',
        ],
        correct: 0,
        explanation: `The expression ${expr} evaluates to ${output}.`,
        sourceSection: title,
      });
    }
  }

  // Fill blank from key syntax
  for (const block of codeBlocks) {
    const methodMatch = block.code.match(/\.(\w+)\(/);
    if (methodMatch && ['toUpperCase', 'toLowerCase', 'slice', 'split', 'trim', 'includes', 'indexOf', 'replace', 'toString', 'toFixed'].includes(methodMatch[1])) {
      const method = methodMatch[1];
      quizzes.push({
        type: 'fill-blank',
        question: `Complete the method name: .____()`,
        code: block.code.replace(new RegExp(`\\.${method}\\(`), '.______('),
        correct: method,
        explanation: `The correct method is .${method}()`,
        sourceSection: title,
      });
    }
  }

  // Limit to reasonable number per lesson
  return quizzes.slice(0, 10);
}

/**
 * Generates revision cards from lesson content.
 */
function generateRevisionCards(sections) {
  const cards = [];

  for (const section of sections) {
    if (!section.heading) continue;

    // Extract key points from bold text
    const boldMatches = section.rawContent.match(/\*\*(.+?)\*\*/g);
    if (boldMatches && boldMatches.length > 0) {
      const keyPoints = boldMatches
        .map(m => m.replace(/\*\*/g, ''))
        .filter(p => p.length > 5 && p.length < 120)
        .slice(0, 3);

      if (keyPoints.length > 0) {
        cards.push({
          heading: section.heading,
          keyPoints,
          type: section.type,
        });
      }
    }
  }

  return cards;
}

/**
 * Parses a markdown file into a structured lesson object.
 */
function parseLesson(filePath, moduleId) {
  const raw = fs.readFileSync(filePath, 'utf-8');
  const lines = raw.split('\n');

  // Extract title from first H1
  const titleLine = lines.find(l => l.startsWith('# '));
  const title = titleLine ? titleLine.replace(/^#\s+/, '').trim() : `Lesson ${moduleId}`;

  // Split into sections by ## headings
  const sections = [];
  let currentSection = null;
  const sectionLines = [];

  for (const line of lines) {
    if (line.startsWith('## ') || line.startsWith('### ')) {
      // Save previous section
      if (currentSection !== null || sectionLines.length > 0) {
        const rawContent = sectionLines.join('\n').trim();
        if (rawContent) {
          const html = marked.parse(rawContent);
          const type = classifySection(currentSection, rawContent);
          const sectionCodeBlocks = extractCodeBlocks(sectionLines.join('\n'));
          const tables = extractTables(html);

          sections.push({
            type,
            heading: currentSection,
            content: html,
            rawContent,
            codeBlocks: sectionCodeBlocks,
            tables,
            headingLevel: currentSection ? (rawContent.startsWith('### ') ? 3 : 2) : 1,
          });
        }
      }

      currentSection = line.replace(/^#{2,3}\s+/, '').replace(/\*+/g, '').trim();
      sectionLines.length = 0;
    } else if (line.startsWith('# ')) {
      // Skip the title line, but capture intro content
      if (!currentSection && sectionLines.length === 0) {
        currentSection = null;
        continue;
      }
    } else {
      sectionLines.push(line);
    }
  }

  // Don't forget the last section
  if (sectionLines.length > 0) {
    const rawContent = sectionLines.join('\n').trim();
    if (rawContent) {
      const html = marked.parse(rawContent);
      const type = classifySection(currentSection, rawContent);
      const sectionCodeBlocks = extractCodeBlocks(sectionLines.join('\n'));
      const tables = extractTables(html);

      sections.push({
        type,
        heading: currentSection,
        content: html,
        rawContent,
        codeBlocks: sectionCodeBlocks,
        tables,
        headingLevel: 2,
      });
    }
  }

  // Aggregate all code blocks
  const allCodeBlocks = extractCodeBlocks(raw);
  const plainText = raw.replace(/```[\s\S]*?```/g, '').replace(/[#*`[\]()]/g, '');

  let customQuiz = null;
  const quizMatch = raw.match(/<!-- QUIZ_START([\s\S]*?)QUIZ_END -->/);
  if (quizMatch) {
    try {
      customQuiz = JSON.parse(quizMatch[1].trim());
    } catch (e) {
      console.warn("Failed to parse custom quiz:", e.message);
    }
  }

  let customRevision = null;
  const revMatch = raw.match(/<!-- REVISION_START([\s\S]*?)REVISION_END -->/);
  if (revMatch) {
    try {
      customRevision = JSON.parse(revMatch[1].trim());
    } catch (e) {
      console.warn("Failed to parse custom revision:", e.message);
    }
  }

  return {
    id: moduleId,
    moduleId,
    title,
    rawMarkdown: raw,
    tokens: marked.lexer(raw),
    rawMarkdownHtml: marked.parse(raw),
    sections: sections.map((s) => {
      const { rawContent, ...rest } = s; // eslint-disable-line no-unused-vars
      return rest;
    }),
    metadata: {
      estimatedReadingTime: estimateReadingTime(plainText),
      difficulty: determineDifficulty(sections, allCodeBlocks),
      conceptCount: sections.filter(s => s.type === 'concept').length,
      codeBlockCount: allCodeBlocks.length,
      totalWords: plainText.split(/\s+/).filter(Boolean).length,
    },
    quiz: customQuiz || generateQuizzes(sections, allCodeBlocks, title),
    revisionCards: customRevision || generateRevisionCards(sections),
  };
}

/**
 * Vite plugin that processes markdown lesson files at build time.
 */
export default function lessonsPlugin() {
  const notesDir = fs.existsSync(path.resolve(process.cwd(), 'public', 'notes'))
    ? path.resolve(process.cwd(), 'public', 'notes')
    : path.resolve(process.cwd(), '..', 'public', 'notes');

  return {
    name: 'vite-plugin-lessons',
    resolveId(id) {
      if (id === VIRTUAL_MODULE_ID) return RESOLVED_ID;
    },
    load(id) {
      if (id !== RESOLVED_ID) return null;

      // Read all note directories
      const lessons = [];
      if (fs.existsSync(notesDir)) {
        const dirs = fs.readdirSync(notesDir).filter(d => {
          return fs.statSync(path.join(notesDir, d)).isDirectory();
        }).sort((a, b) => parseInt(a) - parseInt(b));

        for (const dir of dirs) {
          const mdFile = path.join(notesDir, dir, `${dir}.md`);
          if (fs.existsSync(mdFile)) {
            try {
              const lesson = parseLesson(mdFile, dir);
              lessons.push(lesson);
            } catch (err) {
              console.warn(`[lessons-plugin] Failed to parse ${mdFile}:`, err.message);
            }
          }
        }
      }

      return `export const lessons = ${JSON.stringify(lessons, null, 2)};`;
    },
    handleHotUpdate({ file, server }) {
      // Re-process when notes change
      if (file.includes('notes') && file.endsWith('.md')) {
        const mod = server.moduleGraph.getModuleById(RESOLVED_ID);
        if (mod) {
          server.moduleGraph.invalidateModule(mod);
          return [mod];
        }
      }
    },
  };
}
