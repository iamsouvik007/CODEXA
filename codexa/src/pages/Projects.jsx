import { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Rocket, X, Check, ChevronRight, ChevronLeft, Filter, Layers,
  Clock, Code2, Zap, Globe, Terminal, Bot, Cpu, Database,
  GitBranch, Network, Box, Binary, Flame, Crown, Home
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/* ─── Data ─────────────────────────────────────────── */

const LANGUAGES = ['JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'Go', 'Rust'];

const LANG_COLORS = {
  JavaScript: '#f7df1e',
  TypeScript: '#3178c6',
  Python:     '#3776ab',
  Java:       '#ed8b00',
  'C++':      '#659ad2',
  Go:         '#00acd7',
  Rust:       '#dea584',
};

const DIFFICULTY_META = {
  Beginner:     { color: '#22c55e', bg: 'rgba(34,197,94,0.12)',   icon: Zap,        glow: 'rgba(34,197,94,0.08)'   },
  Intermediate: { color: '#3b82f6', bg: 'rgba(59,130,246,0.12)',  icon: Code2,      glow: 'rgba(59,130,246,0.08)'  },
  Advanced:     { color: '#f97316', bg: 'rgba(249,115,22,0.12)',  icon: Flame,      glow: 'rgba(249,115,22,0.08)'  },
  Legendary:    { color: '#a855f7', bg: 'rgba(168,85,247,0.12)',  icon: Crown,      glow: 'rgba(168,85,247,0.08)'  },
};

const PROJECTS = [
  /* ── Beginner ─────────────────────────────────────── */
  {
    id: 'web-server',
    name: 'Build a Web Server',
    difficulty: 'Beginner',
    category: 'Systems',
    icon: Globe,
    languages: ['JavaScript', 'TypeScript', 'Python', 'Go', 'Rust'],
    skills: ['HTTP', 'Networking', 'Sockets'],
    duration: '4–6 Hours',
    description: 'Build an HTTP server from scratch handling requests, routing, and responses without a framework.',
    thumbnail: null,
    roadmap: null,
    progress: 0,
    status: 'coming-soon',
  },
  {
    id: 'cli-tool',
    name: 'Build a CLI Tool',
    difficulty: 'Beginner',
    category: 'Tools',
    icon: Terminal,
    languages: ['JavaScript', 'TypeScript', 'Python', 'Go', 'Rust'],
    skills: ['Shell', 'Argument Parsing', 'File I/O'],
    duration: '3–5 Hours',
    description: 'Create a command-line interface tool with flags, subcommands, and interactive prompts.',
    thumbnail: null,
    roadmap: null,
    progress: 0,
    status: 'coming-soon',
  },
  {
    id: 'todo-app',
    name: 'Build a Todo App',
    difficulty: 'Beginner',
    category: 'Web',
    icon: Layers,
    languages: ['JavaScript', 'TypeScript', 'Python', 'Java'],
    skills: ['REST API', 'CRUD', 'State Management'],
    duration: '3–4 Hours',
    description: 'Full-stack todo application with persistence, filtering, and a clean frontend.',
    thumbnail: null,
    roadmap: null,
    progress: 0,
    status: 'coming-soon',
  },
  {
    id: 'search-engine',
    name: 'Build a Search Engine',
    difficulty: 'Beginner',
    category: 'Data',
    icon: Code2,
    languages: ['Python', 'JavaScript', 'TypeScript', 'Go'],
    skills: ['Indexing', 'TF-IDF', 'Web Scraping'],
    duration: '5–8 Hours',
    description: 'Implement a mini search engine with crawling, indexing, and ranked result retrieval.',
    thumbnail: null,
    roadmap: null,
    progress: 0,
    status: 'coming-soon',
  },
  {
    id: 'discord-bot',
    name: 'Build a Discord Bot',
    difficulty: 'Beginner',
    category: 'Bots',
    icon: Bot,
    languages: ['JavaScript', 'TypeScript', 'Python'],
    skills: ['APIs', 'Events', 'Async Programming'],
    duration: '4–6 Hours',
    description: 'Build a feature-rich Discord bot with commands, moderation tools, and integrations.',
    thumbnail: null,
    roadmap: null,
    progress: 0,
    status: 'coming-soon',
  },
  {
    id: 'reddit-bot',
    name: 'Build a Reddit Bot',
    difficulty: 'Beginner',
    category: 'Bots',
    icon: Bot,
    languages: ['Python', 'JavaScript', 'TypeScript'],
    skills: ['OAuth', 'APIs', 'Rate Limiting'],
    duration: '3–5 Hours',
    description: 'Automate Reddit interactions — posting, commenting, and monitoring threads using PRAW/APIs.',
    thumbnail: null,
    roadmap: null,
    progress: 0,
    status: 'coming-soon',
  },

  /* ── Intermediate ──────────────────────────────────── */
  {
    id: 'git-clone',
    name: 'Build a Git Clone',
    difficulty: 'Intermediate',
    category: 'Systems',
    icon: GitBranch,
    languages: ['Python', 'Go', 'Rust', 'C++'],
    skills: ['DAG', 'Hashing', 'File System'],
    duration: '10–15 Hours',
    description: 'Implement core git commands: init, add, commit, branch, merge from the ground up.',
    thumbnail: null,
    roadmap: null,
    progress: 0,
    status: 'coming-soon',
  },
  {
    id: 'bittorrent',
    name: 'Build a BitTorrent Client',
    difficulty: 'Intermediate',
    category: 'Networking',
    icon: Network,
    languages: ['Go', 'Rust', 'Python', 'C++'],
    skills: ['P2P', 'Networking', 'Bencoding'],
    duration: '12–18 Hours',
    description: 'Build a fully functional BitTorrent client that can download files from the swarm.',
    thumbnail: null,
    roadmap: null,
    progress: 0,
    status: 'coming-soon',
  },
  {
    id: 'blockchain',
    name: 'Build a Blockchain',
    difficulty: 'Intermediate',
    category: 'Systems',
    icon: Binary,
    languages: ['JavaScript', 'TypeScript', 'Python', 'Go', 'Rust'],
    skills: ['Cryptography', 'Consensus', 'Distributed Systems'],
    duration: '10–14 Hours',
    description: 'Create a simple blockchain with proof-of-work mining, transactions, and chain validation.',
    thumbnail: null,
    roadmap: null,
    progress: 0,
    status: 'coming-soon',
  },
  {
    id: 'database',
    name: 'Build a Database',
    difficulty: 'Intermediate',
    category: 'Data',
    icon: Database,
    languages: ['Go', 'Rust', 'C++', 'Python'],
    skills: ['B-Trees', 'Storage Engines', 'SQL Parsing'],
    duration: '15–20 Hours',
    description: 'Design a relational database with a query parser, B-tree indexing, and ACID properties.',
    thumbnail: null,
    roadmap: null,
    progress: 0,
    status: 'coming-soon',
  },
  {
    id: 'text-editor',
    name: 'Build a Text Editor',
    difficulty: 'Intermediate',
    category: 'Tools',
    icon: Terminal,
    languages: ['C++', 'Rust', 'Go', 'Python'],
    skills: ['Terminal I/O', 'Gap Buffer', 'Syntax Highlighting'],
    duration: '8–12 Hours',
    description: 'Build a terminal-based text editor with modes, undo/redo, and syntax highlighting.',
    thumbnail: null,
    roadmap: null,
    progress: 0,
    status: 'coming-soon',
  },
  {
    id: 'neural-network',
    name: 'Build a Neural Network',
    difficulty: 'Intermediate',
    category: 'AI/ML',
    icon: Cpu,
    languages: ['Python', 'C++'],
    skills: ['Backpropagation', 'Linear Algebra', 'Optimization'],
    duration: '10–15 Hours',
    description: 'Implement a neural network from scratch including forward pass, backprop, and gradient descent.',
    thumbnail: null,
    roadmap: null,
    progress: 0,
    status: 'coming-soon',
  },

  /* ── Advanced ──────────────────────────────────────── */
  {
    id: 'redis-clone',
    name: 'Build a Redis Clone',
    difficulty: 'Advanced',
    category: 'Systems',
    icon: Database,
    languages: ['Go', 'Rust', 'C++'],
    skills: ['Networking', 'Databases', 'Caching'],
    duration: '15–20 Hours',
    description: 'Implement an in-memory data structure store with RESP protocol, persistence, and pub/sub.',
    thumbnail: null,
    roadmap: null,
    progress: 0,
    status: 'coming-soon',
  },
  {
    id: 'docker-clone',
    name: 'Build a Docker Clone',
    difficulty: 'Advanced',
    category: 'Systems',
    icon: Box,
    languages: ['Go', 'Rust'],
    skills: ['Containers', 'Namespaces', 'cgroups'],
    duration: '20–30 Hours',
    description: 'Build a container runtime using Linux namespaces, cgroups, and overlay filesystems.',
    thumbnail: null,
    roadmap: null,
    progress: 0,
    status: 'coming-soon',
  },
  {
    id: 'browser-engine',
    name: 'Build a Browser Engine',
    difficulty: 'Advanced',
    category: 'Systems',
    icon: Globe,
    languages: ['Rust', 'C++'],
    skills: ['HTML Parsing', 'CSS Layout', 'Rendering'],
    duration: '25–35 Hours',
    description: 'Implement a browser engine that parses HTML/CSS, builds a render tree, and paints pixels.',
    thumbnail: null,
    roadmap: null,
    progress: 0,
    status: 'coming-soon',
  },
  {
    id: 'programming-language',
    name: 'Build a Programming Language',
    difficulty: 'Advanced',
    category: 'Compilers',
    icon: Code2,
    languages: ['Go', 'Rust', 'Python', 'C++'],
    skills: ['Lexing', 'Parsing', 'Interpreters'],
    duration: '20–30 Hours',
    description: 'Design and implement a scripting language with a lexer, parser, AST, and interpreter.',
    thumbnail: null,
    roadmap: null,
    progress: 0,
    status: 'coming-soon',
  },
  {
    id: 'physics-engine',
    name: 'Build a Physics Engine',
    difficulty: 'Advanced',
    category: 'Games',
    icon: Zap,
    languages: ['C++', 'Rust', 'JavaScript', 'TypeScript'],
    skills: ['Linear Algebra', 'Collision Detection', 'Rigid Bodies'],
    duration: '20–25 Hours',
    description: 'Build a 2D physics simulation with rigid-body dynamics, collision response, and constraints.',
    thumbnail: null,
    roadmap: null,
    progress: 0,
    status: 'coming-soon',
  },
  {
    id: 'game-engine',
    name: 'Build a Game Engine',
    difficulty: 'Advanced',
    category: 'Games',
    icon: Layers,
    languages: ['C++', 'Rust'],
    skills: ['ECS', 'Rendering', 'Asset Pipeline'],
    duration: '30–40 Hours',
    description: 'Create a 2D game engine with an entity-component system, renderer, and asset management.',
    thumbnail: null,
    roadmap: null,
    progress: 0,
    status: 'coming-soon',
  },

  /* ── Legendary ─────────────────────────────────────── */
  {
    id: 'operating-system',
    name: 'Build an Operating System',
    difficulty: 'Legendary',
    category: 'Systems',
    icon: Cpu,
    languages: ['C++', 'Rust'],
    skills: ['Kernel', 'Memory Management', 'Scheduling'],
    duration: '80–120 Hours',
    description: 'Build a bootable operating system kernel with process management, memory allocation, and drivers.',
    thumbnail: null,
    roadmap: null,
    progress: 0,
    status: 'coming-soon',
  },
  {
    id: 'llm',
    name: 'Build an LLM',
    difficulty: 'Legendary',
    category: 'AI/ML',
    icon: Bot,
    languages: ['Python', 'C++'],
    skills: ['Transformers', 'CUDA', 'Training'],
    duration: '60–100 Hours',
    description: 'Implement a large language model transformer architecture, training loop, and inference pipeline.',
    thumbnail: null,
    roadmap: null,
    progress: 0,
    status: 'coming-soon',
  },
  {
    id: 'distributed-system',
    name: 'Build a Distributed System',
    difficulty: 'Legendary',
    category: 'Systems',
    icon: Network,
    languages: ['Go', 'Rust', 'Java'],
    skills: ['Raft', 'Consistency', 'Fault Tolerance'],
    duration: '50–80 Hours',
    description: 'Implement a distributed key-value store with Raft consensus, replication, and leader election.',
    thumbnail: null,
    roadmap: null,
    progress: 0,
    status: 'coming-soon',
  },
  {
    id: 'react-like-framework',
    name: 'Build a React-like Framework',
    difficulty: 'Legendary',
    category: 'Web',
    icon: Code2,
    languages: ['JavaScript', 'TypeScript'],
    skills: ['Virtual DOM', 'Reconciliation', 'Hooks'],
    duration: '30–50 Hours',
    description: 'Build a UI framework with a virtual DOM, diffing algorithm, hooks system, and JSX support.',
    thumbnail: null,
    roadmap: null,
    progress: 0,
    status: 'coming-soon',
  },
  {
    id: 'compiler',
    name: 'Build a Compiler',
    difficulty: 'Legendary',
    category: 'Compilers',
    icon: Binary,
    languages: ['Rust', 'C++', 'Go'],
    skills: ['IR Generation', 'Optimization', 'Code Generation'],
    duration: '50–80 Hours',
    description: 'Design a compiler with full pipeline: lexing, parsing, IR generation, optimizations, and codegen.',
    thumbnail: null,
    roadmap: null,
    progress: 0,
    status: 'coming-soon',
  },
  {
    id: '3d-renderer',
    name: 'Build a 3D Renderer',
    difficulty: 'Legendary',
    category: 'Graphics',
    icon: Layers,
    languages: ['C++', 'Rust'],
    skills: ['Ray Tracing', 'Rasterization', 'Shaders'],
    duration: '40–60 Hours',
    description: 'Implement a software 3D renderer with rasterization, ray tracing, PBR shading, and shadows.',
    thumbnail: null,
    roadmap: null,
    progress: 0,
    status: 'coming-soon',
  },
];

const DIFFICULTY_ORDER = ['Beginner', 'Intermediate', 'Advanced', 'Legendary'];

/* ─── Project Coming Soon Modal ────────────────────── */

function ProjectModal({ project, onClose }) {
  const closeRef = useRef(null);

  useEffect(() => {
    if (!project) return;
    const prev = document.activeElement;
    setTimeout(() => closeRef.current?.focus(), 100);
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
      prev?.focus();
    };
  }, [project, onClose]);

  const features = [
    'Step-by-step implementation guide',
    'Learning resources',
    'Milestones',
    'Project checklist',
    'AI mentor support',
    'Completion tracking',
  ];

  return (
    <AnimatePresence>
      {project && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] bg-bg/80 backdrop-blur-md"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.93, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.93, y: 16 }}
            transition={{ duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="fixed top-1/2 left-1/2 z-[61] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2"
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-modal-title"
          >
            <div className="overflow-hidden rounded-2xl border border-border bg-bg-card shadow-modal">

              {/* Gradient top bar */}
              <div className="h-1 w-full bg-gradient-to-r from-accent via-amber-400 to-accent" />

              {/* Header */}
              <div className="flex items-start justify-between px-6 pt-6 pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-accent/20 to-amber-500/10 border border-accent/20">
                    <Rocket className="h-5 w-5 text-accent" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-0.5">🚀 Coming Soon</p>
                    <h2 id="project-modal-title" className="font-heading text-lg font-semibold text-text leading-tight">
                      {project?.name}
                    </h2>
                  </div>
                </div>
                <button
                  ref={closeRef}
                  onClick={onClose}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-bg-elevated hover:text-text"
                  aria-label="Close modal"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Body */}
              <div className="px-6 pb-6">
                <p className="text-sm text-text-secondary leading-relaxed mb-5">
                  This project roadmap is currently under development. The future roadmap will include:
                </p>

                <ul className="space-y-2.5 mb-6">
                  {features.map((f) => (
                    <li key={f} className="flex items-center gap-3">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/15">
                        <Check className="h-3 w-3 text-accent" strokeWidth={2.5} />
                      </span>
                      <span className="text-sm text-text-secondary">{f}</span>
                    </li>
                  ))}
                </ul>

                {/* Pulsing indicator */}
                <div className="mb-5 flex items-center gap-2 rounded-xl border border-accent/15 bg-accent/5 px-4 py-3">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
                  </span>
                  <p className="text-xs text-text-muted">We're building this roadmap. Stay tuned.</p>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={onClose}
                    className="flex-1 rounded-xl bg-gradient-to-r from-accent to-amber-500 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_4px_15px_rgba(249,115,22,0.25)] hover:shadow-[0_0_25px_rgba(249,115,22,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                  >
                    Notify Me Later
                  </button>
                  <button
                    onClick={onClose}
                    className="rounded-xl border border-border bg-bg-elevated px-4 py-2.5 text-sm font-medium text-text-secondary transition-colors hover:border-border-strong hover:text-text"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ─── Project Card ─────────────────────────────────── */

function ProjectCard({ project, onClick, index }) {
  const meta = DIFFICULTY_META[project.difficulty];
  const Icon = project.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.04, ease: 'easeOut' }}
      layout
    >
      <button
        onClick={() => onClick(project)}
        className="group relative w-full text-left overflow-hidden rounded-xl border border-border bg-bg-card transition-all duration-300 hover:-translate-y-1 hover:border-border-strong hover:shadow-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
        style={{ boxShadow: `0 0 0 0 ${meta.glow}` }}
        aria-label={`${project.name} — ${project.difficulty}`}
      >
        {/* Subtle gradient hover overlay */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{ background: `radial-gradient(ellipse at top left, ${meta.glow} 0%, transparent 60%)` }}
        />

        {/* Top accent line */}
        <div
          className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ background: `linear-gradient(to right, transparent, ${meta.color}, transparent)` }}
        />

        <div className="relative p-5">
          {/* Icon + badge row */}
          <div className="flex items-start justify-between mb-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-lg transition-transform duration-300 group-hover:scale-110"
              style={{ background: meta.bg, border: `1px solid ${meta.color}22` }}
            >
              <Icon className="h-5 w-5" style={{ color: meta.color }} />
            </div>
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider"
              style={{ color: meta.color, background: meta.bg }}
            >
              <meta.icon className="h-2.5 w-2.5" />
              {project.difficulty}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-heading text-sm font-semibold text-text mb-1 leading-snug group-hover:text-accent transition-colors duration-200">
            {project.name}
          </h3>

          {/* Category */}
          <p className="text-[11px] text-text-muted mb-3 font-mono uppercase tracking-wider">{project.category}</p>

          {/* Description */}
          <p className="text-xs text-text-secondary leading-relaxed mb-4 line-clamp-2">
            {project.description}
          </p>

          {/* Skills */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {project.skills.map((s) => (
              <span
                key={s}
                className="rounded-md border border-border-soft bg-bg-elevated px-2 py-0.5 text-[10px] font-medium text-text-muted"
              >
                {s}
              </span>
            ))}
          </div>

          {/* Footer: languages + duration */}
          <div className="flex items-center justify-between pt-3 border-t border-border-soft">
            {/* Language dots */}
            <div className="flex items-center gap-1.5">
              {project.languages.slice(0, 5).map((lang) => (
                <span
                  key={lang}
                  className="h-2 w-2 rounded-full"
                  style={{ background: LANG_COLORS[lang] }}
                  title={lang}
                />
              ))}
              {project.languages.length > 5 && (
                <span className="text-[10px] text-text-muted">+{project.languages.length - 5}</span>
              )}
            </div>

            {/* Duration */}
            <div className="flex items-center gap-1 text-[11px] text-text-muted">
              <Clock className="h-3 w-3" />
              {project.duration}
            </div>
          </div>
        </div>

        {/* Coming soon overlay chip */}
        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-1 group-hover:translate-y-0">
          <span className="flex items-center gap-1 rounded-full bg-bg border border-border px-2 py-0.5 text-[10px] text-text-muted">
            <ChevronRight className="h-2.5 w-2.5" />
            Preview
          </span>
        </div>
      </button>
    </motion.div>
  );
}

/* ─── Language Toggle ──────────────────────────────── */

function LanguageFilter({ selected, onToggle, onClear }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="flex items-center gap-1.5 text-xs font-medium text-text-muted mr-1">
        <Filter className="h-3 w-3" /> Filter
      </span>
      {LANGUAGES.map((lang) => {
        const active = selected.includes(lang);
        return (
          <button
            key={lang}
            onClick={() => onToggle(lang)}
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-all duration-200 ${
              active
                ? 'border-transparent text-bg scale-[1.02]'
                : 'border-border bg-bg-card text-text-secondary hover:border-border-strong hover:text-text'
            }`}
            style={active ? { background: LANG_COLORS[lang], boxShadow: `0 0 12px ${LANG_COLORS[lang]}44` } : {}}
            aria-pressed={active}
          >
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: active ? '#000' : LANG_COLORS[lang] }}
            />
            {lang}
          </button>
        );
      })}
      {selected.length > 0 && (
        <button
          onClick={onClear}
          className="text-xs text-text-muted hover:text-accent transition-colors duration-200 ml-1"
        >
          Clear
        </button>
      )}
    </div>
  );
}

/* ─── Section Header ───────────────────────────────── */

function DifficultySection({ difficulty, projects, onCardClick }) {
  const meta = DIFFICULTY_META[difficulty];
  const Icon = meta.icon;

  if (projects.length === 0) return null;

  return (
    <section className="mb-14">
      {/* Section heading */}
      <div className="flex items-center gap-3 mb-6">
        <div
          className="flex h-8 w-8 items-center justify-center rounded-lg"
          style={{ background: meta.bg, border: `1px solid ${meta.color}30` }}
        >
          <Icon className="h-4 w-4" style={{ color: meta.color }} />
        </div>
        <h2 className="font-heading text-lg font-semibold text-text">{difficulty}</h2>
        <span
          className="rounded-full px-2.5 py-0.5 text-xs font-medium"
          style={{ color: meta.color, background: meta.bg }}
        >
          {projects.length} {projects.length === 1 ? 'project' : 'projects'}
        </span>
        <div className="flex-1 h-px" style={{ background: `linear-gradient(to right, ${meta.color}30, transparent)` }} />
      </div>

      {/* Cards grid */}
      <motion.div
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {projects.map((p, i) => (
          <ProjectCard key={p.id} project={p} onClick={onCardClick} index={i} />
        ))}
      </motion.div>
    </section>
  );
}

/* ─── Main Page ────────────────────────────────────── */

export default function Projects() {
  const [selectedLangs, setSelectedLangs] = useState([]);
  const [activeProject, setActiveProject] = useState(null);
  const navigate = useNavigate();

  const toggleLang = (lang) =>
    setSelectedLangs((prev) =>
      prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]
    );

  const filteredProjects = useMemo(() => {
    if (selectedLangs.length === 0) return PROJECTS;
    return PROJECTS.filter((p) =>
      selectedLangs.every((l) => p.languages.includes(l))
    );
  }, [selectedLangs]);

  const groupedProjects = useMemo(() =>
    DIFFICULTY_ORDER.reduce((acc, diff) => {
      acc[diff] = filteredProjects.filter((p) => p.difficulty === diff);
      return acc;
    }, {}),
    [filteredProjects]
  );

  const totalVisible = filteredProjects.length;

  return (
    <>
      <div className="min-h-screen bg-bg">
        {/* ── Hero ── */}
        <section className="relative overflow-hidden pt-28 pb-16 px-5">
          {/* Background grid */}
          <div className="absolute inset-0 bg-grid opacity-40 pointer-events-none" />

          {/* Radial glow */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(249,115,22,0.12) 0%, transparent 65%)',
            }}
          />

          <div className="relative mx-auto max-w-[1200px]">
            {/* Home back button */}
            <motion.button
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              onClick={() => navigate('/')}
              className="group mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-bg-card px-4 py-2 text-sm font-medium text-text-secondary transition-all duration-200 hover:border-accent/40 hover:bg-accent/5 hover:text-accent"
              aria-label="Go to home"
            >
              <ChevronLeft className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-x-0.5" />
              <Home className="h-3.5 w-3.5" />
              Home
            </motion.button>

            <div className="text-center">
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-accent mb-6"
            >
              <Rocket className="h-3.5 w-3.5" />
              Project Roadmaps
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.07 }}
              className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-text mb-4"
            >
              Build Real{' '}
              <span className="bg-gradient-to-r from-accent to-amber-400 bg-clip-text text-transparent">
                Projects
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.13 }}
              className="text-base sm:text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed"
            >
              Learn by building real-world applications from beginner to advanced level.
              <br className="hidden sm:block" />
              Structured roadmaps, guided milestones, and AI mentor support.
            </motion.p>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-8 flex flex-wrap justify-center gap-6"
            >
              {DIFFICULTY_ORDER.map((diff) => {
                const meta = DIFFICULTY_META[diff];
                const count = PROJECTS.filter((p) => p.difficulty === diff).length;
                return (
                  <div key={diff} className="flex items-center gap-2 text-sm">
                    <span className="h-2 w-2 rounded-full" style={{ background: meta.color }} />
                    <span className="text-text-muted">{diff}</span>
                    <span className="font-semibold text-text">{count}</span>
                  </div>
                );
              })}
            </motion.div>
            </div>{/* end text-center */}
          </div>
        </section>

        {/* ── Filter + Content ── */}
        <div className="mx-auto max-w-[1200px] px-5 pb-20">
          {/* Filter bar */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.25 }}
            className="mb-8"
          >
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <LanguageFilter
                selected={selectedLangs}
                onToggle={toggleLang}
                onClear={() => setSelectedLangs([])}
              />
              {selectedLangs.length > 0 && (
                <span className="text-xs text-text-muted sm:ml-auto shrink-0">
                  {totalVisible} of {PROJECTS.length} projects
                </span>
              )}
            </div>
          </motion.div>

          {/* No results */}
          <AnimatePresence mode="wait">
            {totalVisible === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-24 text-center"
              >
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-bg-card">
                  <Code2 className="h-6 w-6 text-text-muted" />
                </div>
                <p className="font-heading text-lg font-medium text-text mb-2">No projects match</p>
                <p className="text-sm text-text-muted mb-4">Try removing some language filters.</p>
                <button
                  onClick={() => setSelectedLangs([])}
                  className="text-sm text-accent hover:underline"
                >
                  Clear filters
                </button>
              </motion.div>
            ) : (
              <motion.div key="content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {DIFFICULTY_ORDER.map((diff) => (
                  <DifficultySection
                    key={diff}
                    difficulty={diff}
                    projects={groupedProjects[diff]}
                    onCardClick={setActiveProject}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Project Coming Soon Modal ── */}
      <ProjectModal project={activeProject} onClose={() => setActiveProject(null)} />
    </>
  );
}
