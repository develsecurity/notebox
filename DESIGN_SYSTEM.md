# NoteBox Design System

## Overview
Minimalist dark-theme design for a personal productivity note-taking app.
Style: clean, focused, low-distraction. Dark by default.

---

## Color Palette

| Token | Value | Tailwind | Usage |
|-------|-------|----------|-------|
| `--color-bg` | `#020617` | `slate-950` | Page background |
| `--color-surface` | `#0f172a` | `slate-900` | App shell, sidebars |
| `--color-card` | `#1e293b` | `slate-800` | Cards, panels |
| `--color-border` | `#334155` | `slate-700` | Borders, dividers |
| `--color-text` | `#f1f5f9` | `slate-100` | Primary text |
| `--color-muted` | `#94a3b8` | `slate-400` | Secondary text, labels |
| `--color-accent` | `#22d3ee` | `cyan-400` | Primary actions, links, focus rings |
| `--color-accent-hover` | `#06b6d4` | `cyan-500` | Hover state for accent |
| `--color-danger` | `#f87171` | `red-400` | Delete, error states |
| `--color-success` | `#4ade80` | `green-400` | Success states |

---

## Typography

| Scale | Size | Weight | Usage |
|-------|------|--------|-------|
| `text-xs` | 12px | 400 | Timestamps, metadata |
| `text-sm` | 14px | 400/500 | Body, labels, captions |
| `text-base` | 16px | 400 | Default body text |
| `text-lg` | 18px | 600 | Card titles |
| `text-xl` | 20px | 700 | Page subheadings |
| `text-2xl` | 24px | 700 | Page headings |
| `text-3xl` | 30px | 800 | Hero headings |

Font stack: `Inter, system-ui, sans-serif` (heading + body)
Mono: `JetBrains Mono, ui-monospace, monospace`

---

## Spacing

Uses Tailwind default 4px scale. Key values:
- `p-3` / `p-4` — component internal padding
- `gap-3` / `gap-4` — element spacing
- `space-y-4` — vertical list spacing
- `max-w-3xl` / `max-w-4xl` — content max-width
- `mx-auto` — centered layout

---

## Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `rounded` | 4px | Badges, small elements |
| `rounded-md` | 6px | Inputs, buttons |
| `rounded-lg` | 8px | Cards |
| `rounded-xl` | 12px | Modals, large panels |

---

## Shadows

| Token | Usage |
|-------|-------|
| `shadow-sm` | Subtle card lift |
| `shadow-md` | Elevated cards |
| Ring focus: `ring-2 ring-cyan-400/60` | Focus states |

---

## Components

### Button
Variants: `primary` (cyan filled), `secondary` (slate outlined), `ghost` (transparent), `danger` (red outlined)
Sizes: `sm`, `md` (default), `lg`

### Card
Variants: `default` (slate-800 bg), `interactive` (hover border glow)
Padding: `p-4` / `p-6`

### Input
Dark-styled text input with cyan focus ring.
Height: `h-10`, border: `border-slate-700`, focus: `ring-cyan-400`

### Textarea
Resizable textarea, same styling as Input.

### Badge
Variants: `default` (slate), `accent` (cyan), `danger` (red), `success` (green)

---

## Layout

### Pages
- `/` — 2-column on desktop (sidebar + main), single-column mobile
- `/notes/[id]` — centered single column, max-w-3xl

### Header
- Height: 56px
- Brand logo left + nav links right
- Sticky, `backdrop-blur-sm`, border-bottom `slate-800`

---

## Icons
Use `lucide-react` (included via npm). Preferred size: `size-4` / `size-5`.

---

## Animation / Motion
- Transitions: `transition-colors duration-150` on interactive elements
- Hover lift: `hover:shadow-md` on cards
- No heavy animations — keep minimal and fast

---

## Dark Mode
App is **always dark**. No light mode toggle needed.
