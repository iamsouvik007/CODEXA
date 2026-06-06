<p align="center">
  <img src="./public/favicon-32x32.png" alt="Codexa Logo" width="64" />
</p>

<h1 align="center">Codexa</h1>

<p align="center">
  <strong>Interactive Developer Learning Platform</strong><br>
  <em>Stop reading code. Start experiencing it.</em>
</p>

<p align="center">
  <!-- SPACE FOR DEPLOYED LINK ADDITION -->
  <a href="DEPLOYED_LINK_HERE"><strong>🟢 Live Demo</strong></a>
</p>

## Overview

Codexa transforms programming concepts into interactive, visual experiences. It breaks down complex topics into digestable chunks, combining conceptual structures, live workspaces, active quizzes, and a floating AI mentor.

### Key Features
- **Interactive Markdown Lessons**: Rich, custom-rendered markdown reading experience using beautiful cards for warnings, tips, analogies, and concepts.
- **AI Tutor Mentorship**: A floating, provider-agnostic (OpenAI, Anthropic, Groq, NVIDIA) AI tutor that understands exactly which lesson, quiz, and code you are looking at.
- **In-Browser Code Sandbox**: A fully interactive terminal and editor sandbox executing local, sandboxed JavaScript safely inside the browser to learn concepts hands-on.
- **Active Quizzing Engine**: Dynamic lesson and mock tests tailored to topics with instant grading and explanations.
- **Execution Visualizer**: Dynamic visual representation of Call Stacks and Memory execution context.

## Technology Stack

- **Frontend**: React 19, Vite, React Router Dom
- **Styling**: Tailwind CSS v4, Framer Motion
- **Markdown parsing**: marked, highlight.js
- **Icons**: Lucide React

## Getting Started

### Prerequisites
- Node.js (v18+)
- npm or pnpm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/iamsouvik007/CODEXA.git
   cd CODEXA/codexa
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`.

### Adding AI Capabilities

Codexa supports bring-your-own-keys (BYOK) for LLM providers. Open the AI Tutor in the bottom right corner and input an API key for your desired provider (OpenAI, Anthropic Claude, Groq, or NVIDIA NIM) to enable intelligent contextual answers.

## Architecture Highlights

Codexa is built with a unique local-first Vite Plugin (`vite-plugin-lessons.js`) that automatically compiles Markdown documents from the `notes/` directory into a robust static JSON `virtual:lessons` module at build time. This ensures blazing fast loads and eliminates runtime database queries for learning content.

## Deployment

This project is optimized for deployment on Vercel. A `vercel.json` file is already included for SPA routing configuration.
1. Push the code to GitHub.
2. Import the project in your Vercel Dashboard.
3. Deploy!

---
*Built with ❤️ by Souvik.*
