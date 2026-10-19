# JS//SYS — TACTICAL PORTFOLIO & SAP ABAP COMMAND DECK

```text
================================================================================
  ██╗███████╗██╗███████╗██╗   ██╗███████╗
  ██║██╔════╝██║██╔════╝╚██╗ ██╔╝██╔════╝
  ██║███████╗██║███████╗ ╚████╔╝ ███████╗   [ SYSTEM: PROD-READY // V3.2 ]
  ██║╚════██║██║╚════██║  ╚██╔╝  ╚════██║   [ SPEC: SAP IS-H · MCP · AI  ]
  ██║███████║██║███████║   ██║   ███████║   [ CALLSIGN: JS // OP-01      ]
================================================================================
```

> **Swiss-Industrial Precision meets Arknights: Endfield OS UI.**  
> Technical portfolio and command interface for **Johan Samsudin** — AI-Augmented SAP ABAP & IS-H Developer, bridging enterprise SAP ECC 6.0 systems, healthcare clinical workflows, and modern agentic development (*Prompt → MCP → Transport*).

---

## Technical Highlights & Features

### 1. 3D WebGL Data-City Topography
- **Engine**: Three.js instanced mesh rendering an interactive 3D terrain grid composed of 4,000+ data columns.
- **Scroll-Aware Raycasting**: Cursor ripple dynamic tracking that accurately accounts for viewport scroll position, canvas bounding box, and terrain tilt.
- **Performance Optimized**: Low-overhead vertex offset uniforms, adaptive DPR clamping (capped at 1.75x), and automatic camera dive / parallax scrub orchestrated via GSAP `ScrollTrigger`.

### 2. Adaptive Background-Aware Tactical HUD
- **Real-Time Negative Contrast**: Right-hand vertical section rail dynamically samples each indicator badge's vertical midpoint against light-background content areas (`#telemetry`, `#dossier`, `#credentials`) to invert into high-contrast negative mode (`bg-ink text-signal`).
- **Tactical Audio Synthesizer**: Pure Web Audio API procedural sound system generating mechanical clicks, high-frequency chirps, and tactical hums without external audio assets.
- **Interactive Command Terminal**: Hotkey-triggered (`[~]`) command-line interface featuring system diagnostic utilities (`help`, `whoami`, `modules`, `stats`, `clear`, `contact`).

### 3. Pin-Scrolled Horizontal Modules Reel
- **Desktop Horizontal Pin**: GSAP `ScrollTrigger` horizontal translation reel showcasing 8 production-grade enterprise systems.
- **Bespoke Vector Schematics**: Custom-coded SVG industrial architectural blueprints for every module illustrating RFC data paths, BDC transaction flows, and database linkages.
- **Mobile Responsive**: Seamlessly falls back to an accessible vertical tactical card stack on mobile devices.

---

## Highlighted Production Modules

| Module | Code | Title | Core Technologies |
| :--- | :--- | :--- | :--- |
| **MOD-00** | `MCP-01` | **SAP-DEV MCP Server** | Model Context Protocol, Node.js, RFC Client, SE38 Bridge |
| **MOD-01** | `APP-01` | **Web-to-SAP Outpatient Scheduling & Payment Gateway** | RFC Interface Gateway, SAP IS-H, `BAPI_ACC_DOCUMENT_POST` |
| **MOD-02** | `PAY-01` | **Enterprise Payer Guarantee & Split-Billing Suite** | Multi-Tier Workflow, OO-ALV Workbench, Split-Invoice Billing |
| **MOD-03** | `LOY-01` | **Healthcare Membership & Financial Voucher Ecosystem** | Patient Lifecycle CRM, `CL_HTTP_CLIENT` REST, FI Discount Clearing |
| **MOD-04** | `ISH-01` | **Clinical Case Flow & IS-H / EMR Integration** | SAP IS-H, `NPAT`, `NFAL`, BAPI/RFC Pipeline, Case Streaming |
| **MOD-05** | `QMS-02` | **Real-Time Outpatient Smart Queue** | SAP IS-H, WebSocket/MQTT, Digital Signage, Telemetry Waveform |
| **MOD-06** | `FLB-03` | **High-Availability Web ERP Fallback Engine** | PHP, Next.js, PostgreSQL, Auto-Failover Reconciler |
| **MOD-07** | `ANA-04` | **Healthcare Analytics & Clinical KPI Dashboard** | SAP BW, SQL Server, Next.js, BI Analytics Engine |

---

## Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router, React 18, TypeScript)
- **3D Graphics**: [Three.js](https://threejs.org/) (WebGL InstancedMesh, Raycaster, Procedural Heightfields)
- **Animation & Motion**: [GSAP 3](https://greensock.com/gsap/) (`ScrollTrigger`, `SplitText`, `ScrambleText`, `useGSAP`)
- **Smooth Scroll**: [@studio-freight/lenis](https://github.com/darkroomengineering/lenis) (Synchronized with GSAP ticker)
- **Styling**: [Tailwind CSS 3](https://tailwindcss.com/) with bespoke Swiss-industrial tokens (chamfers, brackets, HUD typography)
- **Audio Engine**: Native Web Audio API procedural synthesizer
- **Icons**: [Lucide React](https://lucide.dev/)

---

## Design System & Industrial Tokens

| Token | Hex / Spec | Usage |
| :--- | :--- | :--- |
| **Ink** | `#0A0A0B` | Primary deep obsidian background |
| **Ink-2** | `#111113` | Elevated tactical containers & panels |
| **Paper** | `#ECECE6` | Primary high-contrast technical typography |
| **Paper-2** | `#DFDFD8` | Dossier & telemetry inverted card backgrounds |
| **Signal** | `#FFE100` | High-visibility amber accent & interactive focal points |
| **Alert** | `#FF4A1C` | Diagnostic indicators & warning badges |
| **Fonts** | Space Grotesk, JetBrains Mono, Bebas Neue | Display headers, HUD telemetry, and mono data readouts |

---

## Getting Started

### Prerequisites
- Node.js 18.17+ or Node.js 20+
- npm, yarn, or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/GladstoneOG/portjohansam.git
cd portjohansam

# Install dependencies
npm install

# Start local tactical development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

- `npm run dev` — Launch development server with hot-reload.
- `npm run build` — Compile optimized production build.
- `npm run start` — Serve the production build.
- `npm run lint` — Run ESLint check in strict mode.

---

## Project Structure

```text
├── app/
│   ├── globals.css          # Industrial utility classes (chamfer, brackets, HUD tokens)
│   ├── layout.tsx           # Global HTML metadata, font configurations, and providers
│   └── page.tsx             # Root assembly of the 9 tactical sections
├── components/
│   ├── gl/
│   │   ├── hero-canvas.tsx   # React Three.js canvas wrapper with scroll-aware NDC sync
│   │   └── terrain-scene.ts # Instanced data-city mesh, camera dive, and cursor ripple
│   ├── providers/
│   │   ├── audio-provider.tsx # Web Audio API procedural sound synthesizer
│   │   ├── lenis-provider.tsx # Smooth-scroll synchronizer with GSAP ticker
│   │   └── site-provider.tsx  # Centralized portfolio telemetry & navigation state
│   ├── sections/            # Tactical portfolio sections
│   │   ├── hero-section.tsx
│   │   ├── protocol-section.tsx
│   │   ├── telemetry-section.tsx
│   │   ├── dossier-section.tsx
│   │   ├── modules-section.tsx
│   │   ├── credentials-section.tsx
│   │   └── comms-section.tsx
│   ├── system/              # HUD Chrome, negative vertical rail, preloader, CLI terminal
│   └── ui/                  # Reusable primitives (magnetic buttons, barcode, scrambler)
├── lib/
│   ├── data.ts              # System specifications, project modules, credentials data
│   └── gsap.ts              # GSAP plugin registration and custom easing curves
└── tailwind.config.ts       # Industrial color palette, typography, and chamfer radii
```

---

## License

Created by [Johan Samsudin](https://github.com/GladstoneOG). All rights reserved.
