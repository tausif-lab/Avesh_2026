# AVESH 2026 🎉

> **AVESH** is the official annual cultural & technical festival website of **Chhattisgarh Institute of Technology (CIT), Raipur** — built for the 2026 edition (27/10/26 – 30/10/26).

---

## 🖥️ Live Demo

🔗 _Deployable via GitHub Pages / Vercel / Netlify_

---

## ✨ Features

- **Immersive Hero Section** — animated 3D-inspired landing experience with kinetic year counter & motto animations
- **Event Showcase** — browse all technical, cultural, and esports events with detailed rules, specifications, and modals
- **4-Day Schedule** — day-by-day festival timeline covering Hack4Community, Robo Soccer, Cultural Eve & Celebrity Artist Night
- **Sponsors Section** — ecosystem partners and sponsors grid with tier-based layout and interactive highlights
- **About Section** — CGIT Raipur institutional history, committee members, patrons, and fest highlights
- **Registration CTA & Modal** — seamless online registration flow with event selection and UPI payment support
- **Diagonal Visual Artwork** — custom angular editorial posters and graphics
- **Dynamic Landing Pages** — per-event micro landing pages powered by Three.js & WebGL shaders
- **Canvas Confetti & SFX** — celebratory confetti particles and interactive sound design
- **Fully Responsive** — optimised for mobile, tablet, and desktop viewports

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| **React 19** | Modern UI framework |
| **TypeScript 5** | Strict type safety |
| **Vite 6** | Lightning-fast bundler and dev server |
| **Tailwind CSS 3** | Utility-first styling with shadcn/ui semantic design tokens |
| **Framer Motion** | Fluid component animations |
| **Radix UI & NumberFlow** | Accessible UI primitives & animated metrics |
| **Lucide React** | Icon library |
| **Canvas Confetti** | Celebration visual effects |
| **PostCSS + Autoprefixer** | CSS post-processing |

---

## 📁 Project Structure

```text
avesh-2026/
├── public/               # Static assets, festival brochure PDF, Three.js bundles
├── assets/               # High-resolution campus and event photography
├── effects/              # Visual effect modules (WebGL, ThreeUI, shaders)
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── ui/           # Radix/shadcn design primitives (e.g. pricing)
│   │   ├── AboutSection.tsx
│   │   ├── DiagonalArtwork.tsx
│   │   ├── EventDetailModal.tsx
│   │   ├── EventShowcase.tsx
│   │   ├── ExploreExperience.tsx
│   │   ├── Footer.tsx
│   │   ├── Header.tsx
│   │   ├── HeroSection.tsx
│   │   ├── PosterModal.tsx
│   │   ├── RegistrationCTA.tsx
│   │   ├── RegistrationModal.tsx
│   │   ├── ScheduleSection.tsx
│   │   └── SponsorsSection.tsx
│   ├── data/             # Festival master dataset (events, schedule, patrons, sponsors)
│   │   └── festivalData.ts
│   ├── shaders/          # GLSL / WebGL landing pages & recipes
│   ├── types/            # TypeScript type definitions
│   ├── utils/            # Web audio sound effects & helpers
│   ├── App.tsx           # Root app component
│   ├── main.tsx          # React DOM entry point
│   └── index.css         # Global design system & theme variables
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── postcss.config.js
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18.x
- **npm** ≥ 9.x (or pnpm / yarn)

### Installation

```bash
# 1. Clone repository
git clone https://github.com/uttradewangan222-svg/Avesh2.git
cd Avesh2

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
```

Production-ready assets are emitted to the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

---

## 📄 License & Credits

This project is developed for **Chhattisgarh Institute of Technology (CIT), Raipur**.  
All rights reserved © CGIT AVESH 2026.

<p align="center">Made with ❤️ by the AVESH 2026 Web Team — CGIT Raipur</p>
