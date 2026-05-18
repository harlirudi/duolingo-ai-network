# Engineering Review Report: Duolingo AI Network

**Skill:** /plan-eng-review
**Date:** 2026-05-16
**Input:** docs/office-hours-design.md, docs/plan-ceo-review.md

---

## GSTACK REVIEW REPORT

### Architecture Decisions (Locked)

| # | Decision | Choice | Rationale |
|---|---|---|---|
| 1 | State Management | Zustand | Lightweight (~2KB), built-in selectors, persist middleware, ideal for 8 features with shared state |
| 2 | UI Framework | NativeWind (Tailwind) | Full design flexibility for branding "Creator-Powered Network" — must NOT look like generic MLM app |
| 3 | Navigation | Expo Router | File-based routing for 24 screens, deep linking for affiliate links, built-in with Expo SDK 52+ |

---

### Tech Stack (Final)

| Layer | Tech | Version |
|---|---|---|
| Frontend | React Native (Expo) | SDK 52+ |
| Language | TypeScript | 5.x |
| Styling | NativeWind | 4.x |
| Navigation | Expo Router | 3.x |
| State | Zustand | 4.x |
| Backend | Supabase | Latest |
| Database | PostgreSQL (via Supabase) | 15.x |
| AI Compute | Supabase Edge Functions (Deno) | Latest |
| AI Provider | OpenAI GPT-4o / Claude | Latest |
| Auth | Supabase Auth (GoTrue) | Latest |
| Real-time | Supabase Realtime | Latest |

---

### Database Schema

10 tables total:

| Table | Purpose | Key Indexes |
|---|---|---|
| profiles | User profiles, archetype, XP, mentor | archetype, guild_id, mentor_id |
| missions | Daily AI-generated missions | profile_id, status, assigned_at |
| affiliate_links | Referral links per member | profile_id, short_code (unique) |
| affiliate_clicks | Click tracking (immutable log) | link_id, created_at |
| products | Physical + digital products | type, created_by |
| learning_modules | Static learning content | order_index |
| learning_progress | Module completion tracking | (profile_id, module_id) PK |
| guilds | Leaderboard groups | leader_id |
| product_recommendations | AI product suggestions | profile_id, confidence |
| mentor_match_log | Mentor-Member pairing history | mentor_id, mentee_id |

---

### State Machines

**Onboarding Flow:**
```
AUTH → AI_CHAT (Q1→Q4) → ARCHETYPE_ASSIGNED → FIRST_MISSION → DASHBOARD
```
- AI Chat streaming from Edge Function (OpenAI)
- Timeout 8s → fallback static quiz
- Archetype can be retaken anytime

**Mission Lifecycle:**
```
PENDING → IN_PROGRESS → COMPLETED (XP awarded)
                       → SKIPPED (streak penalty, difficulty reduced)
```
- XP calculation: server-side only (Supabase function)
- Streak: daily check, midnight rollover (UTC+7 / WIB)

**Affiliate Click Tracking:**
```
CLICK → ip_hash logged → converted? → commission calculated
```
- All tracking server-side
- Immutable audit log for dispute resolution
- Commission rates stored in products table

---

### Data Flow Diagrams (per Prime Directive #3)

**AI Text Tool — 4 paths traced:**
1. Happy path: User input → Edge Function → OpenAI stream → display caption
2. Nil/empty input: Validate → show helper text "Tulis minimal 10 kata"
3. API timeout (>8s): Retry 1x → fail → show fallback template
4. Edge Function crash: Retry 2x → "Coba lagi nanti" + log error

**AI Onboarding Chat — 4 paths traced:**
1. Happy path: User answers → AI processes → next question → archetype assigned
2. User goes offline mid-chat: Save answers to local Zustand → retry on reconnect
3. OpenAI returns non-JSON: Parse error → "AI sedang sibuk, coba ulangi"
4. User skips all questions: Fallback to static archetype quiz (4 questions)

---

### Error Handling Strategy

**Named errors (not generic try/catch):**

```typescript
// lib/errors.ts
class AIFunctionError extends Error {
  constructor(
    message: string,
    public code: 'TIMEOUT' | 'INVALID_RESPONSE' | 'RATE_LIMITED' | 'CRASH'
  ) { super(message) }
}

class AffiliateTrackingError extends Error {
  constructor(
    message: string,
    public linkId: string,
    public reason: 'INVALID_LINK' | 'DB_WRITE_FAILED' | 'RATE_LIMITED'
  ) { super(message) }
}
```

**Every Edge Function must return:**
```typescript
type EdgeResponse<T> = 
  | { ok: true; data: T }
  | { ok: false; error: { code: string; message: string } }
```

---

### RLS Policy Matrix

| Table | SELECT | INSERT | UPDATE | DELETE |
|---|---|---|---|---|
| profiles | auth.uid() = id (own) OR mentor | auth.uid() = id | auth.uid() = id | Never (soft delete) |
| missions | auth.uid() = profile_id | auth.uid() = profile_id | auth.uid() = profile_id | Never |
| affiliate_links | auth.uid() = profile_id | auth.uid() = profile_id | auth.uid() = profile_id | Never |
| affiliate_clicks | auth.uid() = link owner | System only (Edge Function) | Never | Never |
| products | All authenticated | leader role only | leader role only | admin only |
| learning_modules | All authenticated | admin only | admin only | admin only |
| learning_progress | auth.uid() = profile_id | auth.uid() = profile_id | auth.uid() = profile_id | Never |
| guilds | All authenticated | leader only | leader only | admin only |
| product_recommendations | auth.uid() = profile_id | System (Edge Function) | auth.uid() = profile_id | Never |

---

### Testing Plan

| Layer | Tool | What to Test | Priority |
|---|---|---|---|
| Database | supabase test helpers | All RLS policies (100%) | P0 |
| Edge Functions | Deno.test + mock fetch | Happy path, timeout, invalid response, rate limit | P0 |
| Stores (Zustand) | Jest | State transitions, persistence, reset | P1 |
| Components | RN Testing Library | Onboarding chat flow, dashboard XP increment, affiliate link copy | P1 |
| Integration | Detox / Maestro | Full onboarding → first mission → XP awarded → affiliate click | P2 |

**Test-first for these critical flows:**
- Onboarding archetype assignment (deterministic fallback)
- XP calculation (no cheating possible)
- Affiliate click counting (immutable, auditable)

---

### Performance Targets

| Metric | Target | Measurement |
|---|---|---|
| Onboarding chat response | <3s per question (streaming) | Edge Function logs |
| AI Text Tool generation | <5s per caption | Edge Function logs |
| Dashboard load | <1.5s (cold), <500ms (warm) | Expo performance monitor |
| Leaderboard update | <2s after XP change | Supabase Realtime latency |
| App bundle size | <15MB (Expo managed) | EAS Build output |

---

### CI/CD Pipeline (GitHub Actions)

```yaml
# .github/workflows/ci.yml
- Lint: eslint + prettier
- Type check: tsc --noEmit
- Test: jest (unit + stores)
- Supabase: supabase test (RLS policies + Edge Functions)
- Build: eas build --platform all --profile preview
```

---

### Deployment

| Environment | Branch | Build |
|---|---|---|
| Preview (Expo Go) | feature/* | eas update (OTA) |
| Staging | develop | eas build --profile staging |
| Production | main | eas build --profile production + eas submit |

---

### NOT in Scope (Deferred)

- AI Video/Image generation → Phase 2
- Payment gateway integration → Phase 2
- In-app video editor → Phase 2 (user pakai CapCut/TikTok)
- Hybrid Guild (Senior x Junior) → Phase 2 (basic in Mentor Match only)
- Marketplace digital → Phase 2
- Enterprise B2B training → Phase 3

---

### Risk: Integration Hell with 8 Features

**Mitigation: Build order**
1. Auth + Supabase setup (Day 1)
2. Onboarding chat AI + Archetype (Day 2-3)
3. Dashboard + Missions + XP (Day 4-5)
4. AI Text Tool (Day 6)
5. Affiliate Referral (Day 7)
6. Product Recommender (Day 8)
7. Learning Path (Day 9)
8. Digital Product Builder (Day 10)
9. Mentor Match (Day 11)
10. Integration testing + polish (Day 12-14)

Build order ensures each feature adds to a working app, not 8 independent silos integrated at the end.

---

*Dilanjutkan ke: /plan-design-review, Build*
