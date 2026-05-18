# Design Review Report: Duolingo AI Network

**Skill:** /plan-design-review
**Date:** 2026-05-16
**Input:** docs/office-hours-design.md, docs/plan-ceo-review.md, docs/plan-eng-review.md

---

## GSTACK REVIEW REPORT

### Design System — Final Specs

| Dimension | Decision | Spec |
|---|---|---|
| **Brand Personality** | Energetic + Playful | Duolingo-inspired: bold, fun, encouraging. NOT corporate. NOT MLM. |
| **Primary Color** | `#58CC02` (Vibrant Green) | Main CTA, active tab, streak indicator |
| **Archetype Colors** | Silent Builder: `#1CB0F6` (Blue) / Natural Seller: `#FF9600` (Orange) / Trend Hunter: `#CE82FF` (Purple) / Trust Anchor: `#FFD700` (Gold) | Used in profile card, mission cards accent, archetype badge |
| **Neutral Colors** | Background: `#FFFFFF`, `#F7F7F7` / Text Primary: `#4B4B4B` / Text Secondary: `#AFAFAF` | Clean white base, soft gray text |
| **Gamification Colors** | XP Gold: `#FFC800` / Streak Fire: `#FF4B4B` / Leaderboard Gold: `#FFD700`, Silver: `#C0C0C0`, Bronze: `#CD7F32` | |
| **Heading Font** | Nunito (700, 800) | Rounded, friendly, Google Fonts |
| **Body Font** | Inter (400, 500, 600) | Clean, highly readable, variable |
| **Spacing Scale** | 4px base grid | 4, 8, 12, 16, 20, 24, 32, 48, 64 |
| **Border Radius** | 12px (cards), 16px (modals), 999px (pills/badges) | Rounded = friendly. Consistent across all components. |
| **Icon Family** | Phosphor Icons (Duotone) | Playful, consistent, 6 weights per icon |
| **Illustration Style** | 2D flat vector, bold outlines, limited palette per archetype | Similar to Duolingo characters. No 3D, no gradients. |

---

### Navigation Architecture

```
Bottom Tab Bar (4 items):
┌──────────┬──────────┬──────────┬──────────┐
│   Misi   │  Tools   │  Belajar │  Profil  │
│  (home)  │ (create) │ (learn)  │ (stats)  │
└──────────┴──────────┴──────────┴──────────┘

Misi tab:
  ├── Dashboard (daily missions, XP bar, streak, leaderboard mini)
  ├── Mission detail (expand card)
  └── Leaderboard full (guild + national)

Tools tab:
  ├── AI Caption Generator (text input + archetype-aware output)
  ├── AI Product Recommender (swipeable product cards)
  └── AI Digital Product Builder (wizard: name → description → generate)

Belajar tab:
  ├── Learning Path (module list, progress bar)
  ├── Module detail (markdown content + "coba sekarang" CTA)
  └── Mentor Match (find mentor, my mentees)

Profil tab:
  ├── Profile card (avatar, archetype badge, XP, streak)
  ├── Affiliate links + stats
  ├── My Products (digital products created)
  └── Settings
```

---

### Key Screen Specs

#### 1. Dashboard (Misi Tab - Home)

```
┌─────────────────────────────┐
│  🔥 7 Hari Streak!          │  ← Streak banner (animated flame)
│                             │
│  ┌─────────────────────┐    │
│  │ ⭐ Level 12         │    │  ← XP bar with avatar
│  │ ████████████░░ 80%  │    │
│  │ 2,400 / 3,000 XP   │    │
│  └─────────────────────┘    │
│                             │
│  📋 Misi Hari Ini           │
│  ┌─────────────────────┐    │
│  │ 🟠 Natural Seller   │    │  ← Archetype color badge
│  │ Buat 1 video        │    │
│  │ talking-head 30dtk  │    │
│  │ XP: +50             │    │
│  │ [Mulai]             │    │
│  └─────────────────────┘    │
│  ┌─────────────────────┐    │
│  │ 📝 Generate 3       │    │
│  │ caption produk dgn  │    │
│  │ AI Text Tool        │    │
│  │ XP: +30             │    │
│  │ [Buka AI Tools]     │    │
│  └─────────────────────┘    │
│                             │
│  🏆 Leaderboard Mini        │
│  #1 🥇 Budi - 12,400 XP    │
│  #2 🥈 Siti - 10,200 XP    │
│  #3 🥉 Kamu - 8,900 XP     │
└─────────────────────────────┘
```

**Empty state (first-time user):**
- No missions yet → "AI sedang menyiapkan misi pertamamu!" dengan pulsing animation
- No XP → "Selesaikan misi pertama untuk mulai naik level!" dengan arrow ke misi

**Error state:**
- Loading gagal → "Gagal memuat misi. Tarik ke bawah untuk refresh."

#### 2. AI Chat Onboarding

```
┌─────────────────────────────┐
│  👋 Halo! Aku AI Coach-mu   │
│                             │
│  ┌─────────────────────┐    │
│  │ AI: "Hai! Sebelum   │    │  ← Chat bubble (green bg)
│  │ kita mulai, ceritain │    │
│  │ dulu — apa goal      │    │
│  │ utamamu di bisnis    │    │
│  │ ini?"                │    │
│  └─────────────────────┘    │
│                             │
│  ┌─────────────────────┐    │
│  │ User: "Pengen       │    │  ← User bubble (gray bg)
│  │ nambah penghasilan  │    │
│  │ bulanan"            │    │
│  └─────────────────────┘    │
│                             │
│  ┌─────────────────────┐    │
│  │ AI: "Oke! Sekarang  │    │  ← Streaming dots while typing
│  │ pertanyaan kedua..." │    │
│  └─────────────────────┘    │
│                             │
│  ┌─────────────────────┐    │
│  │ [Input jawaban...]  │    │  ← Bottom input bar
│  └─────────────────────┘    │
└─────────────────────────────┘
```

**AI Slop Warning:** Jangan pakai generic chat UI dari library. Custom styling harus beda dari WhatsApp look — ini brand interaction, bukan messaging app. Typing indicator harus branded (icon AI Coach, bukan 3 dots generic).

#### 3. Leaderboard

```
┌─────────────────────────────┐
│  🏆 Leaderboard Nasional    │
│  ┌───┬─────────────────────┐│
│  │🥇 │ Budi S.   12,400 XP ││  ← Gold row
│  │   │ Silent Builder      ││
│  ├───┼─────────────────────┤│
│  │🥈 │ Siti A.   10,200 XP ││  ← Silver row
│  │   │ Natural Seller      ││
│  ├───┼─────────────────────┤│
│  │🥉 │ KAMU       8,900 XP ││  ← Bronze row (highlighted)
│  │   │ Trust Anchor        ││
│  ├───┼─────────────────────┤│
│  │ 4 │ Dewi      7,500 XP  ││
│  ├───┼─────────────────────┤│
│  │ 5 │ Rudi      6,800 XP  ││
│  └───┴─────────────────────┘│
│                             │
│  [Guild] [Nasional] [Mingguan]  ← Segment control
└─────────────────────────────┘
```

**Privacy rule:** Leaderboard ONLY shows username + XP + archetype. No real name, no phone, no earning. Compliant dengan UU PDP Indonesia.

---

### Gamification Interaction Specs

| Event | Animation | Duration | Haptic |
|---|---|---|---|
| Mission complete | Checkmark bounce + confetti burst + XP counter spin up | 1.5s | Yes (light) |
| Streak extended | Flame grows + screen edge glow + "🔥 X Hari!" text scale up | 1.0s | Yes (medium) |
| Level up | Full screen overlay: "LEVEL 13!" + avatar spin + new badge reveal | 2.0s | Yes (heavy) |
| XP gain (routine) | XP number counter animates up, small sparkle | 0.5s | No |
| Streak at risk (23:00 reminder) | Push notification: "⚠️ Streak 7 hari hampir putus!" | N/A | Push |
| First affiliate click | "🎉 Someone clicked your link!" toast + bounce | 2.0s | Yes (light) |

---

### Empty State Design (ALL screens)

| Screen | Empty State | Primary Action |
|---|---|---|
| Dashboard (no missions) | Ilustrasi AI Coach + "Misi harianmu sedang disiapkan!" | Button: "Refresh" or auto-load |
| Tools (never used) | Ilustrasi tools + "Pilih tool untuk mulai bikin konten" | 3 cards: Caption / Recommender / Digital Builder |
| Belajar (no progress) | Ilustrasi buku + "Mulai belajar cara jualan digital!" | Button: "Lihat Modul Pertama" |
| Affiliate (no links yet) | Ilustrasi link + "Buat link afiliasi pertamamu!" | Button: "Buat Link" |
| Leaderboard (just joined) | Ilustrasi podium + "Selesaikan 5 misi untuk masuk leaderboard!" | Button: "Lihat Misi" |
| Mentor Match (no mentor) | Ilustrasi handshake + "Temukan mentor untuk percepat belajarmu!" | Button: "Cari Mentor" |

**Empty state rule:** Setiap empty state harus punya (1) ilustrasi yang friendly, (2) konteks kenapa kosong, (3) CTA yang jelas. NEVER tampilkan "No items found" atau blank screen.

---

### AI Slop Detection

| Pattern | Why It's Slop | Fix |
|---|---|---|
| Generic card grid with 3 icons | Every AI-generated landing page uses this. Predictable, boring. | Custom layout per screen. Dashboard pakai stacked cards, bukan grid. |
| Hero section with gradient + headline | Template pattern. Looks generated. | Onboarding chat = custom chat UI. Dashboard = XP bar dominant. |
| "Features" section with 3 columns | Wikipedia of features. No hierarchy. | Highlight ONE mission at a time. Progressive disclosure. |
| Blue/purple gradient everything | AI default palette. No brand identity. | Green #58CC02 primary. Strict color system with archetype accents. |
| Generic avatar circles | No personality. | Custom illustration per archetype. Four distinct character designs. |
| "Welcome back, [Name]!" | AI loves this greeting. Impersonal. | "🔥 7 Hari Streak!" or "Misi harianmu sudah siap!" — action, not greeting. |

---

### Design Decisions Summary

| # | Decision | Choice |
|---|---|---|
| 1 | Brand Personality | Energetic + Playful (Duolingo-inspired) |
| 2 | Color System | Green primary + 4 archetype accent colors |
| 3 | Typography | Nunito (heading) + Inter (body) |
| 4 | Gamification | Full celebration (confetti, haptic, animations) |
| 5 | Tab Navigation | 4-tab: Misi / Tools / Belajar / Profil |
| 6 | Icon Family | Phosphor Icons (Duotone) |
| 7 | Illustration Style | 2D flat vector, bold outlines |
| 8 | Spacing Grid | 4px base |
| 9 | Border Radius | 12px cards / 16px modals / 999px badges |

---

### Design Debt (perlu diputuskan saat build)

1. **Illustration assets:** Apakah pakai custom illustrator atau AI-generated? Kalau AI, harus konsisten style per archetype.
2. **Sound design:** Gamifikasi pakai suara nggak? Duolingo-style sound effects untuk XP gain, level up, streak.
3. **Onboarding animation:** Chat AI onboarding perlu animation storyboard — transisi dari chat ke archetype reveal.
4. **Dark mode:** MVP skip dulu. Prioritaskan light mode untuk target member usia 30+.
5. **Accessibility:** Minimum contrast ratio 4.5:1. Touch targets min 44px. Screen reader labels untuk semua icon.

---

*Dilanjutkan ke: Build (React Native + Supabase)*
