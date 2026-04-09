---
name: resume-avatar-architecture
description: Architecture and solution-design guidance for AI chatbots, voice assistants, talking avatars, and resume-aware portfolio experiences. Use when Codex needs to analyze or design how a resume or portfolio site should answer questions about qualifications, projects, experience, or contact details; choose between text chat, voice, or avatar options; define knowledge sources and guardrails; or recommend phased implementation for this repo.
---

# Resume Avatar Architecture

## Overview

Design AI experiences for a resume or portfolio site by grounding recommendations in the current repo, the available resume and project data, and the user's desired interaction mode. Favor phased solutions that start with a constrained knowledge assistant before adding voice, video, or real-time features.

## Quick Start

Inspect repo-local sources before proposing architecture:

- `package.json` to confirm the app shape and runtime constraints.
- `index.html` or the active frontend entry to see whether the site is static, React, or hybrid.
- `src/data.ts` and any resume, PDF, or project notes to identify structured knowledge already available.
- Any user-supplied project descriptions, links, or confidentiality constraints.

If project information has not been provided yet, treat projects as a missing knowledge source rather than inferring details.

## Workflow

1. Classify the interaction mode.
   - Text-only resume assistant
   - Text plus audio assistant
   - Talking avatar with generated speech and lip-sync
   - Real-time conversational avatar with mic input and streaming responses

2. Separate the system into layers.
   - Knowledge layer: resume facts, project summaries, FAQs, contact details, approved claims
   - Answer layer: prompt, retrieval or selection, guardrails, fallback behavior
   - Experience layer: chat UI, audio playback, avatar video, or streaming persona

3. Match the solution to the current repo.
   - Prefer a lightweight widget for static sites.
   - Add a backend before introducing any paid LLM, TTS, or avatar API.
   - Keep API keys and prompt logic server-side.
   - Start with structured JSON or TypeScript data before reaching for embeddings or full RAG.

4. Constrain the bot.
   - Answer only from approved resume and project material.
   - Mark real projects as sanitized when needed.
   - Refuse or soften answers when the requested detail is not in the source data.
   - Never invent metrics, clients, dates, or confidential implementation details.

5. Deliver a phased plan.
   - Phase 1: grounded text assistant
   - Phase 2: voice output
   - Phase 3: avatar playback or lip-sync
   - Phase 4: streaming real-time conversation if justified

## Decision Rules

Prefer structured data over unstructured resume text for v1.

Recommend simple JSON or TypeScript knowledge when:
- The content is limited to resume facts, FAQs, and a modest set of project summaries.
- The site mainly answers biography, skills, experience, and project questions.
- The user wants predictable behavior, lower cost, and easy editing.

Recommend retrieval or embeddings only when:
- The knowledge base grows into long case studies, transcripts, blogs, or many documents.
- The answer quality depends on searching long-form content instead of selecting from structured fields.

Recommend pre-rendered or clip-based avatars when:
- The user wants a polished visual presence and can accept a short response delay.
- The site experience is asynchronous question-and-answer rather than live conversation.

Recommend real-time streaming avatars only when:
- The user explicitly wants microphone-driven conversation or interview simulation.
- Budget, latency, and vendor lock-in trade-offs are acceptable.

## Output Shape

When producing a recommendation, return:
- Recommended architecture
- Why it fits the repo and the content size
- Required data model
- Security and privacy notes
- Phased implementation plan
- Risks, unknowns, and follow-up questions only when they materially affect the design

## References

Load these only when needed:

- `references/discovery-checklist.md` for what to gather before solutioning
- `references/solution-matrix.md` for option comparison
- `references/guardrails.md` for knowledge boundaries, sanitization, and answer policy
