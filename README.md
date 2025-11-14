# Johan Sam - Cinematic Portfolio

High-end, single-page portfolio built with Next.js 14, Tailwind CSS, GSAP, Lenis, and Framer Motion. The experience layers precision typography, smooth scrolling, and a custom canvas background for a cinematic feel.

## Tech Stack

- Next.js 14 (App Router, TypeScript)
- Tailwind CSS 3
- GSAP + ScrollTrigger
- Lenis smooth scrolling (disabled on mobile / reduced motion)
- Framer Motion micro-interactions
- Custom HTML canvas matrix background

## Getting Started

```bash
npm install
npm run dev
```

The development server starts on `http://localhost:3000`. Changes in the `app` and `components` directories hot-reload automatically.

## Available Scripts

- `npm run dev` – start the Next.js development server
- `npm run lint` – run ESLint in strict mode
- `npm run build` – create an optimized production build
- `npm run start` – serve the production build (after `npm run build`)

## Project Structure

- `app/` – Next.js App Router layout and page
- `components/` – section components, providers, and canvas background
- `lib/data.ts` – centralized experience and project data
- `tailwind.config.ts` – Tailwind theme extensions and color palette

## Canvas & Performance Notes

- Canvas grid gracefully disables on small screens and for users who prefer reduced motion
- Lenis smooth scrolling is desktop-only and syncs with GSAP ScrollTrigger
- Horizontal projects gallery falls back to vertical stacking on mobile

## Assets

Project cards reference placeholder image paths under `/images/`. Replace with final assets or adjust the data in `lib/data.ts` once imagery is available.

## Deployment

Run `npm run build` to generate the optimized build inside `.next/`. Deploy via Vercel or any Node.js host with `npm run start`.
