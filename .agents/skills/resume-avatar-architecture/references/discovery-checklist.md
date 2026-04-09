# Discovery Checklist

## Site Baseline

- Identify whether the current site is static HTML, React, or hybrid.
- Locate the active entry points and any existing API surface.
- Confirm deployment constraints such as static hosting, serverless support, or custom backend availability.

## Knowledge Inventory

- List approved resume facts: headline, experience, education, certifications, skills, awards, contact details.
- List project sources separately for dummy projects and actual projects.
- Mark each project as public, sanitized, or confidential.
- Prefer structured fields: title, role, stack, problem, solution, impact, dates, links, and allowed talking points.

## Interaction Expectations

- Confirm whether the user wants typed chat, voice playback, mic input, or a visible avatar.
- Confirm whether the bot should sound recruiter-friendly, technical, or conversational.
- Confirm whether answers should be short and polished or detailed and explanatory.

## Trust And Safety

- Identify anything that must never be disclosed: client names, internal metrics, architecture internals, regulated data, or NDA material.
- Decide whether the assistant should cite source sections or surface confidence when data is missing.
- Require the bot to say when a project answer is based on a sanitized summary.

## Operations

- Confirm where secrets will live and whether a backend already exists.
- Estimate acceptable latency for text, voice, and avatar responses.
- Estimate how often the resume or project data will change and who will maintain it.

## Output

After discovery, summarize:

- The recommended experience tier
- The minimum data model
- The backend and frontend split
- The privacy boundary
- The phased roadmap
