# 10/10 GOAT System

Create a full-stack web application called "10/10 GOAT Life System". Purpose: a personal habit tracker and life operating system that tracks daily habits, 12-week goals, and long-term identity metrics on a 1–10 scale. Core features: (1) Habit Tracker with categories: Intelecto (Tec 2027), Físico & Atletismo (Ironman), Proyecto (WAF), Contenido, Disciplina, Estilo, Relaciones, Aura, Espiritualidad. Each habit has status pending/completed, daily and weekly counts, ratios, and percentages. (2) Stats Dashboard showing daily %, weekly %, streaks, and classification (flojo <50%, sólido 50–79%, GOD 80%+). (3) Visual Radar/Polygon Chart (dynamic number of sides based on categories, e.g., hexagon/heptagon/nonagon) displaying category levels from 1–10, updating smoothly over time (no daily resets). (4) 12-Week System: users set quarterly goals (e.g., weight gain milestones), broken into weekly targets, with progress bars and trend lines. (5) Levels Engine: categories start at 7.0/10; missing key habits decreases −0.1 (max −0.3/day); sustained streaks increase +0.1 slowly. (6) Relationships between habits and categories (one habit can affect multiple categories). (7) Authentication (email/password), user profiles, and secure cloud database. Data models: User, Category, Habit (key/non-key), DailyLog, WeeklySummary, Goal12Week, LevelHistory. UX: clean, dark/light mode, coach-chill tone, minimal emojis, mobile-first. Charts: radar/polygon, line charts for trends, bar charts for completion. Include seed categories and example habits. Provide a ready-to-use demo account. Return build status, live URL, and screenshots.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://goat-life-os.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/baa1b9c6-a9a8-4a2e-b2e2-edef9a2f1d1c).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
