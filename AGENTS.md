# AGENTS.md — Duolingo AI Network

## Project

Platform "Creator-Powered Network" — mobile-first React Native app mentransformasi member MLM menjadi digital creator via AI + gamifikasi.
Think "Duolingo untuk menghasilkan uang dengan skill AI."

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React Native (Expo SDK 52+), TypeScript strict |
| Styling | NativeWind (Tailwind for React Native) |
| State | Zustand |
| Navigation | Expo Router (file-based routing) |
| Backend | Supabase (PostgreSQL, Auth, Realtime) |
| AI | Supabase Edge Functions → OpenAI API |
| Testing | Jest + React Native Testing Library |
| CI/CD | GitHub Actions + EAS Build |

## Commands

```bash
bun install          # Install dependencies
bun dev              # Start Expo dev server
bun lint             # ESLint + Prettier
bun typecheck        # TypeScript type check
bun test             # Run tests
bun test -- --watch  # Watch mode
supabase start       # Local Supabase (butuh Docker)
supabase stop        # Stop local Supabase
```

## Conventions

- **Feature folders:** `src/features/<name>/` — semua file terkait fitur dalam satu folder (screen, component, store, types, test)
- **Shared utilities:** `src/shared/ui/`, `src/shared/lib/`, `src/shared/hooks/`, `src/shared/types/`
- **File naming:** kebab-case untuk file (`chat-screen.tsx`), PascalCase untuk komponen (`ArchetypeCard`)
- **Zustand stores:** `use<Name>Store.ts` di dalam folder fitur atau `src/shared/stores/`
- **Named errors:** `src/shared/lib/errors.ts` — semua error pakai class spesifik (`AIFunctionError`, `AffiliateTrackingError`), BUKAN generic `Error`
- **Edge Functions:** setiap function return `{ ok: true, data } | { ok: false, error: { code, message } }`
- **Commit style:** imperative present, Inggris — `feat: add AI onboarding chat`, `fix: streak midnight rollover`
- **Design tokens:** selalu refer ke variabel NativeWind, jangan hardcode warna/ukuran. Lihat `DESIGN.md`.

## Design System

Lihat `DESIGN.md` untuk color tokens, typography scale, spacing, border radius, shadows, component specs, dan animation catalog.
Brand: Energetic + Playful. Primary: `#58CC02`. Font: Nunito (heading) + Inter (body).

## Architecture

Lihat `docs/plan-eng-review.md` untuk database schema, state machines, data flow diagrams (dengan shadow paths), error handling strategy, RLS policy matrix, dan testing plan.

## Scope

Lihat `docs/plan-ceo-review.md` untuk 8 fitur MVP dan risk register.
Lihat `docs/plan-design-review.md` untuk screen specs, empty states, gamification interactions.

## Skill routing

When the user's request matches an available skill, invoke it via the Skill tool. When in doubt, invoke the skill.

Key routing rules:
- Product ideas/brainstorming → invoke /office-hours
- Strategy/scope → invoke /plan-ceo-review
- Architecture → invoke /plan-eng-review
- Design system/plan review → invoke /design-consultation or /plan-design-review
- UI mockup exploration → invoke /design-shotgun
- Full review pipeline → invoke /autoplan
- Bugs/errors → invoke /investigate
- QA/testing site behavior → invoke /qa or /qa-only
- Code review/diff check → invoke /review
- Visual polish → invoke /design-review
- Ship/deploy/PR → invoke /ship or /land-and-deploy
- Save progress → invoke /context-save
- Resume context → invoke /context-restore
- Security audit → invoke /cso
- Performance → invoke /benchmark
- Documentation → invoke /document-release or /document-generate
- Codebase search → invoke /sync-gbrain
- Safety → invoke /careful, /freeze, /guard, /unfreeze
- Weekly retro → invoke /retro

## Environment

Copy `.env.example` ke `.env` dan isi API keys. Jangan commit `.env`.
Supabase: jalankan `supabase start` (local, butuh Docker) ATAU buat project gratis di https://supabase.com.
