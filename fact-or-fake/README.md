# Fact or Fake

An educational browser game for middle school students (grades 6–8) that builds media literacy and critical thinking skills. Each round shows two claims — one true, one false — and students must identify the fake one.

## Features

- **30 hardcoded questions** across 10 topic areas: space, animals, geography, health, history, weather, technology, oceans, food, and landmarks
- Each game randomly selects 10 questions, so replaying gives fresh content
- Instant feedback with explanations and real-world sources after every answer
- Expandable review section at the end showing all 10 rounds
- Fully responsive — side-by-side cards on desktop, stacked on mobile
- Zero dependencies — single HTML file, no API calls, works offline

## Embedding in Google Sites

1. In Google Sites, click **Insert → Embed**
2. Paste the GitHub Pages URL:
   ```
   https://<username>.github.io/<repo-name>/fact-or-fake/
   ```
3. Recommended iframe size: **760 × 700 px** or larger on desktop

GitHub Pages does not set `X-Frame-Options`, so the page embeds cleanly in Google Sites iframes with no extra configuration needed.

## Adding More Questions

Open `fact-or-fake/index.html` and find the `questionBank` array near the top of the `<script>` section. Each question is an object with four fields:

```javascript
{
  trueClaim:   'A true factual statement (1–2 sentences).',
  trueSource:  'Source Name (e.g., NASA, National Geographic, CDC)',
  falseClaim:  'A false but plausible statement on a related topic.',
  explanation: '1–2 sentences explaining why the false claim is wrong.',
},
```

**Tips for writing good false claims:**
- Base them on real-but-wrong common beliefs (myths, misconceptions)
- Keep them specific and believable — vague fakes are too easy to spot
- Make the true and false claims feel like they belong to the same topic

The game automatically picks 10 random questions from the bank per session, so the more questions you add, the more variety students get on replay.

## Deploying on GitHub Pages

1. Create a new GitHub repository (or use an existing one)
2. Make sure `fact-or-fake/index.html` is committed to the repository
3. Go to **Settings → Pages** in the repository
4. Set the source to **Deploy from branch: main / (root)**
5. The game will be live at:
   ```
   https://<username>.github.io/<repo-name>/fact-or-fake/
   ```

## Standards Alignment

Supports media literacy and information evaluation skills aligned to:
- **ISTE Standards** — 1.3 Knowledge Constructor (evaluating digital content)
- **Common Core ELA** — Reading Informational Text, evaluating evidence and sources
- **Utah SEEd cross-cutting concepts** — Obtaining, evaluating, and communicating information

## Tech Stack

| Item | Details |
|------|---------|
| File | Single `index.html` — all HTML, CSS, JS inline |
| Dependencies | None — no frameworks, libraries, or CDNs |
| API calls | None — all content is hardcoded |
| Hosting | GitHub Pages |
| Compatibility | All modern browsers; works on Chromebooks and iPads |
