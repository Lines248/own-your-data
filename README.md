## Claim Your Signal
An interactive Next.js prototype that explores identity, authorship, and digital ownership through motion, sound, and accessible interaction.

Live Demo: https://own-your-data.vercel.app￼
Repository: https://github.com/LinesSultzer/own-your-data￼

## Why this exists
Show how a design-driven interaction can map to verifiable ownership patterns, with production-minded a11y and performance decisions.

## Stack
- **Framework:** Next.js 16 (App Router), React 19
- **Styling:** Tailwind CSS v4 + design tokens
- **Animation:** Framer Motion 12
- **Images:** 'next/image' with WebP/AVIF and responsive sizes
- **Deploy:** Vercel Edge

## Getting Started
Live Demo: https://own-your-data.vercel.app￼

To run locally:
    ```bash
    npm install
    npm run dev
    # pen http://localhost:3000￼

Key files: app/page.tsx, components/AssetCard.tsx.

## Interaction model
•	Tune Un -> Live is a one-way to mirroe claim/mint semantics.
•	Keyboard support for flip/claim; reduced-motion honors user preference.
•	Audio feedback gated by user input; global mute and per-card mute.

## Highlights
1. Open the demo and tab through the UI to see visible focus rings.
2. Flip a card (Enter/Space)
3. Tune In to claim a signal (one-way state).
4. Adjust Volume and toggle Mute All
5. Reload to see persisted claim state.

## Accessibility notes
•	Semantic headings and labels; visible focus; keyboard parity for click actions.
•	Contrast tokens for text and controls.
•	Reduced motion path for users with motion sensitivity.

**Lighthouse:** Performance 94±, Accessibility 95±, Best Practices 100, SEO 100.

## Performance notes
•	next/image with AVIF/WebP, responsive sizes, and caching.
•	Minimized main thread work and small interaction handlers.
•	Avoids layout shift; LCP image optimized.

## What’s mocked vs real
•	Persistence: localStorage for claims.
•	Next step: Flow FCL transaction for claims with optimistic UI, idempotent claim endpoint, and reconciliation on confirmation.
•	Security hardening: rate limits, CSRF on write endpoints, and signed asset URLs.

## Architecture at a glance
Architecture at a glance
•	Now: modular monolith for velocity and coherent UX.
•	Later split: Read API, Claim service, Indexer/settlement worker, Notifications.
•	Caching: ISR + CDN, SWR for hot reads.

## Technology Summary
Layer           Tools
Frontend        Next.js 16, React 19, Framer Motion 12
Styling         Tailwind CSS v4 + tokens
Images          next/image (AVIF/WebP, responsive)
Deploy          Vercel Edge
Data (future)   Flow (claims), Postgres, Redis
Language        TypeScript

## Known limitations
•	No wallet connection yet; claims are local.
•	Audio may be blocked until first interaction (browser policy).
•	Single page prototype; multi-route patterns omitted intentionally.

## License
MIT

## System Diagram
                          ┌───────────────────────────────┐
                          │         Client Layer          │
                          │   React 19 + Next.js 16 App   │
                          │   Tailwind + Framer Motion    │
                          └──────────────┬────────────────┘
                                         │
                                         ▼
                     ┌───────────────────────────────────────────┐
                     │              Application Layer             │
                     │-------------------------------------------│
                     │  Routing, Page Rendering, API Handlers    │
                     │  Claim Logic and UI State Management      │
                     │  Validation and Optimistic Updates        │
                     └──────────────┬────────────────────────────┘
                                    │
                                    ▼
              ┌────────────────────────────────────────────────────────┐
              │                    Data Services                       │
              │--------------------------------------------------------│
              │  PostgreSQL (Primary DB + Read Replicas)               │
              │  Redis (Cache / Session Store)                         │
              │  Object Storage (S3 or GCS for Media Assets)           │
              └──────────────┬─────────────────────────────────────────┘
                             │
                             ▼
          ┌──────────────────────────────────────────────────────────────┐
          │                      External Integrations                    │
          │--------------------------------------------------------------│
          │  Flow Blockchain (Ownership & Verification)                   │
          │  Notification Queue (Kafka / PubSub / SQS)                    │
          │  CDN + Edge Network (Vercel)                                  │
          └──────────────────────────────────────────────────────────────┘