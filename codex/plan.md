# ResumeSPA Progress Plan

## Project Goal

Build a polished resume website that includes a grounded chatbot able to answer questions about Rushal's public resume profile, qualifications, skills, leadership, healthcare interoperability experience, project highlights, and contact details.

---

## What Has Been Built So Far

### 1. Resume Chatbot Foundation

- Added a floating resume assistant UI to the site.
- Added browser-side grounded fallback logic for resume questions.
- Added a Node backend with:
  - `GET /api/health`
  - `POST /api/chat`
- Added OpenAI-enabled server path with fallback to local resume answers when no API key is configured.

### 2. Resume Knowledge Source

- Created structured public-profile knowledge for:
  - overview
  - qualifications
  - education
  - role fit
  - tech stack
  - leadership
  - healthcare interoperability
  - certifications
  - experience
  - impact
  - projects
  - contact
- Added suggested prompt questions for guided chatbot use.

### 3. Fallback Chat Improvements

- Added stricter topic matching for local mode.
- Improved support for typos and short queries such as:
  - `qualificaiton`
  - `experience`
  - `techstack`
  - `stack`
  - `c#`
  - `asp.net`
- Added out-of-scope handling:
  - unknown questions should return a polite apology and steer the user back to supported questions
- Added bullet-style rendering for stack-style answers.

### 4. Prompt Flow Changes

- Implemented suggested questions / quick prompts.
- Implemented `back` command to return to suggested questions.
- Added assistant hint text to guide the user back to prompts.

### 5. Avatar / Voice Experiments

- Added a temporary profile-photo avatar experience.
- Added looped avatar visual assets.
- Added browser speech playback support.
- Evaluated true talking-avatar options and rejected HeyGen because it is too expensive for the purpose of this resume site.
- Decision: keep chatbot, avoid paid live avatar platform for now.

### 6. Backend / Project Setup

- Added `server.js`
- Added server-side resume profile grounding
- Added package scripts and `.env.example`
- Verified JavaScript syntax with `node --check`

---

## Current Architecture

### Frontend

- Main page: `index.html`
- Assistant client logic: `public/resume-assistant.js`
- Assistant fallback knowledge: `public/resume-assistant-data.js`

### Backend

- API server: `server.js`
- Server grounding data: `server/resume-profile.js`

### Assets

- Profile image and avatar loop were added previously for avatar experiments

---

## Current Product Decisions

### Confirmed

- Chatbot is worth keeping.
- Expensive talking-avatar integration is not worth it for this site.
- The experience should stay polished, recruiter-friendly, and grounded in the public profile.

### Rejected / Deferred

- HeyGen LiveAvatar or similar premium talking avatar
- Full lip-sync talking head
- Heavy RAG architecture for v1

---

## Current Known Issues

These are the main issues still visible from the latest review cycle:

1. The assistant layout still needs simplification.
   - The user no longer wants the avatar in the chatbot/site experience.
   - Avatar-related UI should be removed cleanly.

2. The prompt area still needs better behavior.
   - User preference: quick prompts should show initially.
   - After the first real answer, prompts should go away to increase reading space.
   - Typing `back` should bring them back.

3. The reading area needs more space.
   - Quick prompts currently take too much room in some layouts.

4. Some fallback answers still need polishing.
   - Answers should sound like a clean assistant response.
   - Answers should be recruiter-friendly and direct.
   - Multi-value topics like tech stack should stay as bullet lists.
   - Unsupported questions should clearly say the assistant cannot answer from the available data.

5. The homepage content needs refinement.
   - `Key Achievements` should be updated.
   - User requested a stronger `Key Skills` and `Highlights` style section.

---

## Latest Requested UI / Content Direction

The most recent requested direction before this save was:

1. Remove avatar from the site.
2. Keep the chatbot.
3. Update `Key Achievements` to something closer to:
   - `Key Skills`
   - `Highlights`
   - stronger recruiter-facing summary points
4. Make chatbot answers cleaner and more recruiter-friendly.

---

## Suggested Next Implementation Steps

### High Priority

1. Remove avatar visuals from hero and chatbot header.
2. Make assistant header simpler and more premium.
3. Keep quick prompts outside the main conversation flow:
   - show initially
   - hide after first answer
   - show again on `back`
4. Expand reading area by reducing prompt area footprint.
5. Rewrite fallback answer copy in a recruiter-friendly tone.
6. Update `Key Achievements` to `Key Skills & Highlights`.

### Medium Priority

1. Align server-mode responses with fallback-mode tone.
2. Add clearer mode label:
   - `AI mode`
   - `Local mode`
3. Add reset chat button if needed.

### Low Priority

1. Optional mic input later
2. More public-safe project examples
3. Stronger recruiter demo flow

---

## Proposed Content Direction For `Key Skills & Highlights`

- Engineering leadership across distributed teams in India and the USA
- Healthcare interoperability expertise across HL7, FHIR, CCDA, ECR, XDS/XDR/XDM, and SMART on FHIR
- Technical delivery ownership across architecture, execution, stakeholder communication, and production support
- Strong Microsoft stack foundation across C#, .NET, ASP.NET MVC, Web API, SQL Server, WPF, and CI/CD
- 80% improvement in CCDA generation performance through architecture and query optimization
- Vendor cost reduction through Symphonia to NHapi migration
- Client-facing leadership during production incidents and priority releases
- Recognition through Star Award, Pat on Back Award, Spot Awards, and hackathon appreciation

---

## Key Files Touched In This Project

- `index.html`
- `public/resume-assistant.js`
- `public/resume-assistant-data.js`
- `server.js`
- `server/resume-profile.js`
- `package.json`
- `.env.example`
- `public/profile-avatar.jpeg`
- `public/avatar-loop.mp4`

---

## Notes For Future Edits

- The site is usually tested in local fallback mode unless `OPENAI_API_KEY` is configured.
- Because fallback mode is used heavily, answer quality in `public/resume-assistant-data.js` matters a lot.
- Do not assume the user wants avatar features anymore.
- Prioritize clean UX, stronger recruiter messaging, and consistent grounded responses.

---

## Status Summary

### Completed

- grounded chatbot
- fallback matcher
- API backend
- structured resume data
- suggested prompts
- `back` flow concept
- bullet rendering for stack answers
- removed avatar visuals from the hero section
- removed avatar visuals from the chatbot header
- refreshed `Key Achievements` into `Key Skills & Highlights`
- strengthened highlights copy to emphasize skills, domain depth, delivery ownership, and measurable impact

### In Progress

- final prompt UX polish
- recruiter-friendly answer tone
- homepage skills/highlights refresh

### Deferred

- talking avatar
- premium live avatar services
- expensive third-party avatar platforms
