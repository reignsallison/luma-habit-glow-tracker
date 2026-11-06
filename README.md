# Luma Habit Glow Tracker

Build a premium, ultra-modern "Daily Life & Routine Tracker" web application designed for mobile and desktop screens. It should look like a highly polished, expensive SaaS product. 



Use a clean, futuristic dark-mode theme with vibrant neon accents (like electric blue, violet, or emerald green), smooth animations, and rounded cards. 



The web app needs three core functional sections:

1. A Daily Habit Tracker where users can add habits, check them off with satisfying click animations, and see a daily completion streak counter.

2. A Water Intake and Calorie Counter with visual progress bars or ring animations that fill up as the user logs their intake.

3. A beautiful, visual Statistics Dashboard that aggregates their daily data and displays it using interactive progress charts, line graphs, or weekly overview summaries to track consistency.



Make sure it includes a sidebar or bottom navigation menu to switch between sections effortlessly. Include mock premium user profile data so the app looks completely ready to go out of the box. Do not mention any app stores or app store downloads—this is a pure standalone web application. Optimize everything to look stunning when tested live vi

a a link.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://luma-habit-glow-tracker.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/100f8470-0a34-46d5-8869-704274854a9a).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Netlify deployment

Netlify uses Node.js 22 and Bun 1.3.12, as configured in `netlify.toml`.
The build runs `bun run build`, publishes `dist`, and uses Nitro's
Netlify preset for server routes. `.nvmrc` selects the same Node.js major
version for local development. Use `bun install --frozen-lockfile` to install
the dependencies recorded in `bun.lock`.

The Python setup messages in Netlify's dependency-installation logs do not
by themselves indicate a build failure. If installation fails again, inspect
the subsequent error and exit status to identify the failing step.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
