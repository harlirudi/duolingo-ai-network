# DX Review Report: Duolingo AI Network (Internal DX)

**Skill:** /plan-devex-review
**Date:** 2026-05-16
**Focus:** Internal Developer Experience
**Persona:** AI-Augmented Solo Builder

---

## GSTACK REVIEW REPORT

### DX SCORECARD

| Dimension | Score | Target |
|---|---|---|
| Project Setup (TTHW) | 3/10 | 10/10 |
| Codebase Structure | 5/10 | 9/10 |
| AI-Friendliness | 3/10 | 9/10 |
| Debugging Experience | 2/10 | 8/10 |
| Testing UX | 2/10 | 8/10 |
| Documentation | 4/10 | 7/10 |
| CI/CD Pipeline | 0/10 | 6/10 |
| **Composite** | **2.7/10** | **8.1/10** |

---

### 1. Project Setup (TTHW): 3/10 → Target 10/10

**Current state:** Belum ada project sama sekali. Kosong.

**What 10/10 looks like:**
- `git clone` → `bun install` → `bun dev` → app running di Expo Go dalam < 2 menit
- Supabase local dev setup via `supabase start` (Docker)
- Environment variables documented di `.env.example`
- No manual config steps

**Recommendations:**

```bash
# Ideal setup flow:
git clone <repo>
bun install
cp .env.example .env
supabase start          # Local Supabase (Postgres + Auth + Edge Functions)
bun dev                 # Expo start
# → Scan QR, app running
```

**Action items:**
1. Buat `.env.example` dengan semua required vars (`EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY`, `OPENAI_API_KEY`)
2. Buat `scripts/setup.sh` atau dokumentasikan di README
3. Pastikan `bun dev` langsung jalan — jangan butuh config manual

---

### 2. Codebase Structure: 5/10 → Target 9/10

**Current state:** Structure sudah di-plan di eng review (`app/` Expo Router, `src/stores/`, `src/components/`, `supabase/functions/`). Bagus tapi belum ada.

**What 9/10 looks like for AI-Augmented Solo:**

```
duolingo-ai-network/
├── app/                        # Expo Router (file-based = predictable)
├── src/
│   ├── features/               # Feature folders (BUKAN type folders)
│   │   ├── onboarding/
│   │   │   ├── chat-screen.tsx
│   │   │   ├── archetype-card.tsx
│   │   │   └── onboarding.store.ts   # Feature-local state
│   │   ├── dashboard/
│   │   ├── missions/
│   │   ├── text-tool/
│   │   ├── affiliate/
│   │   ├── learning/
│   │   ├── mentor/
│   │   ├── products/
│   │   └── profile/
│   ├── shared/                 # Shared across features
│   │   ├── ui/                 # Design system components
│   │   ├── lib/                # supabase.ts, ai.ts, errors.ts
│   │   ├── hooks/              # useAuth, useMissions, etc.
│   │   └── types/              # database.ts, api.ts
│   └── config/                 # App constants, feature flags
├── supabase/
│   ├── migrations/             # SQL (versioned)
│   ├── functions/              # Edge Functions (one per AI feature)
│   └── seed.sql                # Dev seed data
├── tests/                      # Colocated tests OR separate
├── docs/                       # Plan artifacts (NOT committed as docs)
├── .github/workflows/          # CI
├── DESIGN.md                   # Design system tokens
├── README.md                   # Setup instructions
└── CLAUDE.md                   # AI agent guidance
```

**Key principle:** Feature folders, not type folders. AI agent yang buka `src/features/onboarding/` langsung lihat semua file terkait — screen, component, store, types. Jangan pakai `src/screens/` + `src/stores/` + `src/types/` terpisah.

**Action:** Gunakan feature-folder structure saat build.

---

### 3. AI-Friendliness: 3/10 → Target 9/10

**Current state:** Belum ada CLAUDE.md, belum ada conventions.

**What 9/10 looks like:**

**CLAUDE.md harus berisi:**
```markdown
# CLAUDE.md

## Project
Duolingo AI Network — React Native (Expo) + Supabase mobile app.

## Tech Stack
- Frontend: React Native (Expo SDK 52), TypeScript strict
- Styling: NativeWind (Tailwind for RN)
- State: Zustand
- Navigation: Expo Router (file-based)
- Backend: Supabase (PostgreSQL + Auth + Edge Functions)
- AI: Edge Functions → OpenAI/Claude API

## Commands
- `bun install` — Install dependencies
- `bun dev` — Start Expo dev server
- `bun lint` — ESLint + Prettier
- `bun typecheck` — TypeScript check
- `bun test` — Run Jest tests
- `supabase start` — Start local Supabase
- `supabase functions serve` — Start Edge Functions locally

## Conventions
- Feature folders: `src/features/<name>/`
- File naming: kebab-case for files, PascalCase for components
- Zustand stores: `use<Name>Store.ts`

## Design System
See DESIGN.md for color tokens, typography, spacing, components.

## Skill routing
[gstack routing rules...]
```

**Agent instruction quality checklist:**
- [ ] File naming convention jelas (AI tahu harus namain apa)
- [ ] Import path pattern jelas (AI tahu harus import dari mana)
- [ ] Commit message convention (AI tahu format commit)
- [ ] Error handling pattern (AI tahu pakai named errors, bukan generic try/catch)

**Action:** Buat CLAUDE.md sebelum mulai coding.

---

### 4. Debugging Experience: 2/10 → Target 8/10

**Current state:** Belum ada error handling strategy, belum ada logging.

**What 8/10 looks like:**

**Development debugging:**
- Expo dev tools (shake device → debug menu)
- React Native debugger / Flipper
- Supabase local dashboard (`supabase status` → localhost:54323)
- Edge Function logs via `supabase functions serve` (terminal output)

**Error handling (from eng review):**
- Named error classes: `AIFunctionError`, `AffiliateTrackingError`
- Every Edge Function returns `{ ok: true, data } | { ok: false, error }`
- `console.error` with context for debugging

**Edge Function local debugging:**
```bash
# Test Edge Function locally before deploy
supabase functions serve --env-file .env
curl -X POST http://localhost:54321/functions/v1/caption-gen \
  -H "Content-Type: application/json" \
  -d '{"prompt": "test"}'
```

**Action items:**
1. Buat `src/shared/lib/errors.ts` dengan semua error class
2. Set up error boundary component di React Native
3. Dokumentasikan debug workflow di README atau CONTRIBUTING.md

---

### 5. Testing UX: 2/10 → Target 8/10

**Current state:** Test strategy defined di eng review, belum ada test framework.

**What 8/10 looks like:**

```bash
# Single command runs ALL tests
bun test

# Watch mode for development
bun test --watch

# Specific test file
bun test src/features/onboarding/onboarding.test.ts

# Coverage report
bun test --coverage
```

**Test file co-location (recommended for feature-folders):**
```
src/features/onboarding/
├── chat-screen.tsx
├── chat-screen.test.tsx    # Co-located test
├── archetype-card.tsx
└── onboarding.store.test.ts
```

**Key setup:**
1. Jest configured with `jest-expo` preset
2. Mock for `@supabase/supabase-js`
3. Mock for Edge Function calls
4. Test database via supabase local (for RLS policy tests)

**Action items:**
1. `bun add -d jest jest-expo @testing-library/react-native`
2. Create `jest.config.js`
3. Write first test: onboarding store logic (no UI needed)
4. Add `bun test` to CI

---

### 6. Documentation: 4/10 → Target 7/10

**Current state:** Docs folder has plan artifacts. DESIGN.md written. No README.

**What 7/10 looks like for solo builder:**

```
README.md
├── What is this?
├── Quick Start (3 steps: clone → install → dev)
├── Tech Stack
├── Project Structure (ascii tree)
├── Environment Variables
├── Supabase Setup
├── Commands (dev, test, lint, typecheck)
└── Deployment (EAS Build → App Store / Play Store)

DESIGN.md (already exists)

docs/
├── office-hours-design.md
├── plan-ceo-review.md
├── plan-eng-review.md
├── plan-design-review.md
└── plan-devex-review.md

CLAUDE.md (for AI agents)
```

**Action items:**
1. Buat README.md setelah project di-scaffold
2. JANGAN commit `docs/plan-*.md` — ini artifact AI, bukan user docs
3. Pastikan `bun dev` documented dengan output yang diharapkan

---

### 7. CI/CD: 0/10 → Target 6/10

**Current state:** Nothing. No repo, no workflow.

**What 6/10 looks like for solo:**

```yaml
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]
jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v1
      - run: bun install
      - run: bun typecheck
      - run: bun lint
      - run: bun test
      - run: bunx supabase test  # RLS policy tests
```

**For solo builder — CI is safety net, not gate.**
- Type check + lint + test must pass on every push
- No manual QA needed per commit
- EAS Build for preview builds (not mandatory per commit)

**Action items:**
1. Init git repo
2. Create `.github/workflows/ci.yml`
3. Set up EAS (`eas build:configure`)

---

### 8. Key DX Gaps Summary

| Gap | Impact | Fix |
|---|---|---|
| No git repo | Can't track changes, no CI | `git init` + first commit |
| No README | Can't onboard self after 2 weeks away | Write README with setup steps |
| No CLAUDE.md | AI agents work blind | Write CLAUDE.md with conventions |
| No test framework | Can't verify changes | `bun add -d jest jest-expo` |
| No CI | No safety net for pushes | `.github/workflows/ci.yml` |
| No env var docs | Can't reproduce setup | `.env.example` |
| No error boundaries | App crashes silently | Error boundary component |

---

### 9. DX Recommendations (Prioritized)

**Before writing ANY code (30 min):**
1. Init git repo + initial commit
2. Write `.env.example`
3. Write `CLAUDE.md` with tech stack + conventions
4. Write `README.md` (skeleton — fill details as you build)

**During build (as you go):**
5. Feature-folder structure (not type-based)
6. Co-locate tests with features
7. Named error classes (`src/shared/lib/errors.ts`)
8. `bun dev` must work in one command

**After first feature working:**
9. Set up CI (`.github/workflows/ci.yml`)
10. Set up EAS Build for preview builds

---

*Dilanjutkan ke: Build (Init project + implement 8 fitur)*
