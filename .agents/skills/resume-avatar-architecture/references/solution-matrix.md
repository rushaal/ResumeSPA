# Solution Matrix

## Option A: Grounded Text Assistant

- Best for a first release and for static or mostly static portfolio sites.
- Use a floating chat widget plus a backend `chat` endpoint.
- Store resume and project knowledge in structured JSON or TypeScript.
- Keep the model constrained to approved data only.
- Complexity: low
- Cost: low
- Recommended for this repo as the starting point

## Option B: Text Plus Voice Assistant

- Add text-to-speech after the text assistant works reliably.
- Keep answer generation and voice generation on the server.
- Play audio in the browser with a small avatar bubble or waveform.
- Complexity: low to medium
- Cost: low to medium
- Recommended when the site should feel more personal without adding full avatar logic

## Option C: Talking Avatar

- Generate the answer, synthesize speech, then animate a video avatar or lip-synced presenter.
- Prefer this for polished async demos, recruiter engagement, and guided introductions.
- Keep a text transcript visible for accessibility and trust.
- Complexity: medium
- Cost: medium
- Recommended when visual presence matters more than instant response time

## Option D: Real-Time Conversational Avatar

- Stream microphone input, partial model output, speech, and avatar animation in near real time.
- Use only when live interview simulation or hands-free conversation is a core requirement.
- Expect higher vendor coupling, stricter latency engineering, and more operational complexity.
- Complexity: high
- Cost: high
- Recommended only after a grounded text assistant proves the knowledge design

## Default Recommendation

For this repo, favor:

- Phase 1: Option A
- Phase 2: Option B
- Phase 3: Option C

Choose Option D only if the user explicitly wants live voice conversation.
