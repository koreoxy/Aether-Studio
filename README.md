# ✦ AETHER-STUDIO

<p align="center">
  <b>✧ A Creative Video Production Template ✧</b>
  <br/>
  A reusable Remotion studio for creating, editing, and rendering videos with code.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/REMOTION-4.0.542-0B84F3?style=for-the-badge&logo=remotion&logoColor=white" />
  <img src="https://img.shields.io/badge/REACT-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/TYPESCRIPT-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/LICENSE-UNLICENSED-gray?style=for-the-badge" />
</p>

---

## ◈ About

**Aether-Studio** is a reusable video production template built with [Remotion](https://www.remotion.dev/).

It provides a foundation for creating, editing, and rendering videos programmatically using React and TypeScript.

Beyond video development, Aether-Studio also includes an AI Visual Prompt Library — a dedicated collection of prompts designed to help AI generate visual styles, scene concepts, motion graphics, and creative directions for video production.

Whether you're creating short-form content, educational videos, promotional videos, or experimental motion graphics, Aether-Studio is designed to be your creative starting point.

## ✦ Features

- **Remotion Studio** — Preview and develop video compositions in real time.
- **Reusable Template** — Start new video projects without rebuilding the environment.
- **AI Visual Prompt Library** — A collection of prompts for generating video visual styles and creative concepts using AI.
- **Kinetic Typography** — Create animated text and dynamic typography.
- **Motion Graphics** — Build visual compositions and animated elements.
- **Custom Transitions** — Create seamless transitions between scenes.
- **Audio & SFX** — Organize sound effects and audio assets.
- **Automated Scripts** — Run custom JavaScript utilities for video production.
- **High-Quality Rendering** — Render compositions into video formats using Remotion.

## ◈ Tech Stack

| Technology | Purpose                           |
| ---------- | --------------------------------- |
| Remotion 4 | Programmatic video creation       |
| React 19   | Component-based video composition |
| TypeScript | Type-safe development             |
| Node.js    | JavaScript runtime                |
| ESLint     | Code quality                      |
| Prettier   | Code formatting                   |

## ✧ Project Structure

```text
Aether-Studio/
│
├── public/
│   └── assets/
│       ├── audio-sound-effect/
│       ├── fonts/
│       └── video-reference/
│
├── visual/
│   └── ... AI visual style prompts
│
├── scripts/
│   └── generate-fight-club-subtitles.mjs
│
├── src/
│   ├── components/
│   ├── compositions/
│   └── Root.tsx
│
├── .gitignore
├── package.json
├── package-lock.json
├── remotion.config.ts
└── tsconfig.json
```

## ◈ AI Visual Prompt Library

The `visual/` directory is a dedicated library of AI prompts for developing the visual identity and creative direction of video projects.

Instead of relying on generic AI-generated visuals, this library helps establish consistent visual styles, scene compositions, animation directions, and motion design concepts.

**What you can find inside:**

- **Visual Style Prompts** — Define the overall aesthetic and visual identity of a video.
- **Motion Graphics Prompts** — Guide AI in creating dynamic visual elements and animations.
- **Scene Direction Prompts** — Describe individual scenes, compositions, and visual storytelling.
- **Transition Prompts** — Define creative transitions and visual connections between scenes.
- **Creative Direction** — Establish consistent design rules, typography, colors, textures, and visual elements.

The prompt library is designed to be reusable and adaptable across different video projects.

## ◈ Getting Started

### 1. Clone Repository

```bash
git clone https://github.com/koreoxy/Aether-Studio.git
cd Aether-Studio
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Remotion Studio

```bash
npm run dev
```

## ✦ Available Commands

| Command           | Description                      |
| ----------------- | -------------------------------- |
| `npm run dev`     | Start Remotion Studio            |
| `npm run build`   | Bundle the video project         |
| `npm run upgrade` | Upgrade Remotion                 |
| `npm run lint`    | Run ESLint and TypeScript checks |

## ◈ Rendering Videos

```bash
npx remotion render src/index.ts Main out/video.mp4
```

Replace the entry point and composition ID with the actual values configured in your project.

## ✧ Production Workflow

```text
IDEA & SCRIPT
     ↓
AI VISUAL PROMPTS
     ↓
VISUAL DIRECTION
     ↓
SCENE DESIGN
     ↓
MOTION & ANIMATION
     ↓
AUDIO & SOUND EFFECTS
     ↓
PREVIEW & REVISION
     ↓
FINAL RENDER
```

## ◈ Asset Management

To keep the repository lightweight, most production assets are excluded from Git tracking.

The following asset directories are intended to be version-controlled:

- `audio-sound-effect/` — Reusable sound effects.
- `fonts/` — Typography assets.
- `video-reference/` — Visual references for video production.
- `visual/` — AI visual prompt library.

## ✦ Design Philosophy

> Create once. Reuse endlessly. Tell stories differently.

Aether-Studio brings together programmatic video production and AI-assisted visual direction in one reusable creative environment.

## ◈ License

This repository is currently marked as **UNLICENSED**.

All rights reserved unless permission is explicitly granted by the repository owner.

---

<p align="center">
  <b>✦ AETHER-STUDIO ✦</b>
  <br/>
  <sub>Built for creativity. Powered by code.</sub>
  <br/><br/>
  <code>DESIGN · DIRECT · ANIMATE · RENDER</code>
</p>
