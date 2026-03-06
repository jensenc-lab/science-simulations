# Fact or Fake

An educational browser game for middle school students (grades 6–8) that builds critical thinking and media literacy skills by challenging students to identify false claims.

## How It Works

Each game generates 10 fresh question pairs using the Anthropic AI API. Students are shown two claims side by side and must choose the one that is **false**. After each answer, the game reveals an explanation and the source of the true fact.

### Scoring

| Score | Message |
|-------|---------|
| 9–10  | Amazing! You're a fact-checking pro! |
| 7–8   | Great job! You've got sharp eyes! |
| 5–6   | Not bad! Keep practicing your fact-checking skills. |
| 0–4   | Keep learning! Spotting fake info takes practice. |

## Topics Covered

Questions are AI-generated each session and cover a diverse mix of:
- Science & Health
- History & Geography
- Animals & Nature
- Technology & Space

## Embedding in Google Sites

This page is designed to be embedded as an iframe in Google Sites.

1. In Google Sites, insert an **Embed** block (Insert → Embed)
2. Paste the GitHub Pages URL:
   ```
   https://<username>.github.io/<repo-name>/fact-or-fake/
   ```
3. Resize the embed block to at least **820 × 700 px** for the best experience on desktop.

GitHub Pages does not set `X-Frame-Options`, so the page embeds cleanly in Google Sites and other iframes.

## API Note

Questions are fetched from the Anthropic API (`claude-sonnet-4-20250514`). The API key is **not** embedded in this file — it must be supplied via a reverse proxy or server-side handler that injects the `x-api-key` header before the request reaches Anthropic's servers. Without this, the game will display a "Couldn't load questions" error.

## Tech Stack

- Single `index.html` file — HTML, CSS, and JavaScript all inline
- No frameworks, no build tools, no external dependencies
- Deployed via GitHub Pages
- Anthropic API for dynamic content generation

## Standards Alignment

Supports Utah SEEd and NGSS cross-cutting concepts around **patterns**, **cause and effect**, and **obtaining/evaluating information** — core practices in science and information literacy.
