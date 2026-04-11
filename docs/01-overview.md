# 01 — Project Overview

## Vision
Educational blog where every article is a 3D interactive experience. Readers learn by scrolling through spatial scenes, not walls of text.

## Goals
1. Teach complex topics (CS, ML, math, physics) via 3D visualizations.
2. Every route = unique URL path, statically pre-rendered for speed + SEO.
3. Two-segment page model: 3D scene (top) + written/code content (below).
4. Dedicated AI/ML segment showing neural network internals, training dynamics, architecture diagrams in 3D.

## Non-Goals
- No CMS backend. Content authored as MDX + React components in-repo.
- No user accounts in v1.
- No server-side rendering beyond static generation.

## Success Metrics
- Lighthouse perf ≥ 85 on mid-tier mobile.
- Time-to-interactive < 3s on 4G.
- Every page ships with a docs/pages/*.md file (100% compliance).
- 3D scenes run ≥ 45fps on integrated GPUs.

## Target Audience
- Self-taught developers
- CS/ML students
- Curious engineers wanting intuition, not just formulas

## Scope v1
- 10 launch articles (5 general CS, 5 ML)
- AI/ML segment MVP: perceptron, MLP, CNN, transformer attention
- Blog index, tag pages, about, search

## Scope v2+
- Interactive playgrounds (live code eval)
- Community contributions via PR
- RSS, newsletter, i18n
