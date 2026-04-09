# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Start Remotion Studio (live preview in browser at localhost:3000)
npm run video

# Render final MP4 to out/resume.mp4
npm run render

# List available compositions
npx remotion compositions src/index.ts
```

## Architecture

This repo is two things in one directory:

1. **Static HTML resume site** (`index.html`, `index_apple.html`, `JiraSPA.html`) — standalone files, no build step, deployed via `CNAME` (GitHub Pages).

2. **Remotion video project** (`src/`) — a React/TypeScript video composition of the same resume content, rendered to MP4.

### Remotion video structure

- `src/index.ts` — entry point, calls `registerRoot`
- `src/Root.tsx` — registers the `ResumeVideo` composition (1920×1080, 30fps, ~32s)
- `src/ResumeVideo.tsx` — top-level composition; sequences all scenes using `<Series>`; defines per-scene durations in frames; wraps each scene in a cross-fade `FadeScene` envelope
- `src/data.ts` — single source of truth for all resume content (name, stats, experience, skills, education, certifications, contact)
- `src/theme.ts` — design tokens (dark colour palette, font stacks)
- `src/scenes/` — one file per scene:
  - `HeroScene` — animated intro with name, title, tagline, stats, status badge
  - `ExperienceScene` — accepts an `index` prop (0/1/2) to render each job entry
  - `SkillsScene` — three skill groups rendered as card columns
  - `EducationScene` — education card + certification cards
  - `OutroScene` — closing screen with contact details

### Animation pattern

All animations use `interpolate(frame, [startFrame, endFrame], [fromValue, toValue])` with `extrapolateRight: "clamp"`. Staggered reveals are done by incrementing the start frame per item (e.g. `35 + i * 12`). No external animation libraries are used.

### Remotion best-practices skill

The `remotion-best-practices` skill is installed at `.agents/skills/remotion-best-practices/` and symlinked for Claude Code at `.claude/skills/`. Load specific rule files from `.agents/skills/remotion-best-practices/rules/` when working on: transitions, fonts, audio, sequencing, text animations, parameters, charts, etc.

### To update resume content

Edit `src/data.ts` only — all scenes read from it. No changes to scene files needed for content updates.
