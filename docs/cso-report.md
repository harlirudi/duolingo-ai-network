# Security Posture Report: Duolingo AI Network

**Skill:** /cso
**Date:** 2026-05-19
**Mode:** Full daily audit

---

## ARCHITECTURE MENTAL MODEL

**Stack:** React Native (Expo) + TypeScript + Supabase + Supabase Edge Functions (Deno) + OpenAI
**Auth:** Supabase GoTrue (phone OTP via SMS)
**Database:** PostgreSQL (Supabase managed), RLS enforced
**AI:** Supabase Edge Functions wrapping OpenAI API (server-side only)
**State:** Zustand (client-side), some mock/static data

Trust boundaries: Client (mobile) → Supabase API (RLS-gated) → Edge Functions → OpenAI API

---

## ATTACK SURFACE CENSUS

```
CODE SURFACE
  Public screens:        15 (all accessible until auth guard enforced)
  Authenticated:          4 tabs only (after auth guard)
  Admin-only:             0
  Edge Functions:         1 (caption-gen) — plan calls for 4, only 1 implemented
  External integrations:  1 (OpenAI API) via Edge Function

INFRASTRUCTURE SURFACE
  CI/CD workflows:        0 (NOT FOUND — no CI exists)
  Webhook receivers:      0
  Container configs:      0
  Secret management:      Environment variables (.env for client, Deno.env for Edge)
```

---

## FINDINGS

### Finding 1 — MEDIUM: Prompt Injection Vector in Edge Function
**File:** `supabase/functions/caption-gen/index.ts:7,30-32`
**Description:** The `tone` parameter from client request is interpolated directly into the system prompt. An attacker sending `tone=". Ignore all previous instructions. "` could manipulate AI behavior. The `prompt` field is also interpolated into user message without sanitization.
**Exploitation:** User sends crafted payload through authenticated Supabase client → Edge Function builds prompt with unsanitized input → OpenAI may execute injected instructions.
**Fix:** Sanitize both `prompt` and `tone` inputs. Strip or escape special prompt-delimiter sequences. Do NOT interpolate user input into system prompts — move user input to user-message position only.
**Severity:** MEDIUM — attack scope limited to user's own caption generation; cannot access other user data.

### Finding 2 — LOW: OPENAI_API_KEY Not Masked in Edge Function Logs
**File:** `supabase/functions/caption-gen/index.ts:7`
**Description:** Edge Function uses `const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY")!`. If the function crashes and logs the error context, the key could appear in Supabase logs. Using `Deno.env.get()` with non-null assertion means a missing key causes crash rather than graceful error.
**Fix:** Use `Deno.env.get("OPENAI_API_KEY")` without `!`, add null check with graceful fallback, and ensure error logs don't include env variable values.
**Severity:** LOW — Supabase Edge Function logs are private; key exposure through logs requires both a crash AND log access.

### Finding 3 — HIGH: No CI/CD Pipeline
**Description:** No `.github/workflows/` directory exists. No automated type checking, linting, or testing runs on push/PR. Critical security tools (dependency audits, secret scanning) are not automated.
**Fix:** Create `.github/workflows/ci.yml` with at minimum: TypeScript type check, lint, and dependency audit.
**Severity:** HIGH — changes can reach production without automated security validation.

### Finding 4 — LOW: No Dependency Audit Script
**Description:** `package.json` has no `audit` or `check-deps` script. Running `bun audit` / `npm audit` is manual and likely forgotten.
**Fix:** Add `"audit": "npm audit --production"` to package.json scripts.
**Severity:** LOW — dependencies are Expo-managed and unlikely to have critical CVEs, but no automated checks exist.

### Finding 5 — MEDIUM: Client-Side State for Gamification
**Description:** XP, streak, and affiliate commission calculations happen entirely client-side in Zustand stores. The eng review plan specified server-side calculation for XP/streak to prevent cheating. Current implementation trusts client completely.
**Files:** `src/features/onboarding/onboarding.store.ts`, `src/features/text-tool/text-tool.store.ts`, `src/features/affiliate/affiliate.store.ts`
**Fix:** Move XP calculation, streak tracking, and affiliate commission to either Edge Functions or Supabase database triggers.
**Severity:** MEDIUM — user trust depends on fair leaderboard; cheating undermines entire gamification model.

### Finding 6 — LOW: Supabase Anon Key in Client Bundle
**Description:** `EXPO_PUBLIC_SUPABASE_ANON_KEY` is intentionally exposed in client bundle. This is expected for supabase-js, but requires RLS policies to be active and correct. Our RLS policies exist in migration file but have not been deployed.
**Fix:** Deploy migrations to Supabase before exposing to real users. Verify all RLS policies are active in Supabase dashboard.
**Severity:** LOW — by design, but contingent on RLS deployment.

---

## OWASP TOP 10 COVERAGE

| # | Category | Status |
|---|---|---|
| A1 | Broken Access Control | ✅ RLS policies defined, auth guard implemented |
| A2 | Cryptographic Failures | ✅ Supabase handles auth/JWT; no custom crypto |
| A3 | Injection | ⚠️ Prompt injection in Edge Function (Finding 1) |
| A4 | Insecure Design | ⚠️ Client-side game state (Finding 5) |
| A5 | Security Misconfiguration | ✅ .env gitignored, API key server-side |
| A6 | Vulnerable Components | ⚠️ No automated audit (Finding 4) |
| A7 | Auth Failures | ✅ Supabase GoTrue with phone OTP |
| A8 | Software & Data Integrity | ✅ Package lockfile tracked |
| A9 | Logging & Monitoring | ❌ No logging/monitoring implemented |
| A10 | SSRF | ✅ Edge Functions only call OpenAI API |

---

## SUMMARY

| Severity | Count | Findings |
|---|---|---|
| CRITICAL | 0 | — |
| HIGH | 1 | No CI/CD pipeline |
| MEDIUM | 2 | Prompt injection, Client-side game state |
| LOW | 3 | Key logging, No audit script, Anon key exposure |

**Composite Score:** 7/10 — Reasonably secure for MVP stage. Main gaps are operational (CI/CD, monitoring), not code-level.

**Top Priority Fixes:**
1. Create `.github/workflows/ci.yml` (automated typecheck + lint + audit)
2. Sanitize user input in Edge Function system prompts
3. Deploy RLS policies to Supabase

---

## RECOMMENDATIONS

1. **Immediate:** Add prompt sanitization to `caption-gen` — strip or validate `tone` input
2. **Before launch:** Deploy database migrations + RLS policies to Supabase
3. **Before launch:** Create CI/CD pipeline with automated security checks
4. **Phase 2:** Move XP/streak calculation to server-side (Edge Functions or DB triggers)
5. **Phase 2:** Add logging for Edge Function errors + usage monitoring

---

*Generated by /cso — Chief Security Officer*
