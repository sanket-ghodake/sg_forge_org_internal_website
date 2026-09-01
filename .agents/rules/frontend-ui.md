# Meta Astryx Frontend UI & Anti-Vibecoding Directives

> ⚠️ **MANDATORY UI DIRECTIVE FOR ALL AGENTS**
> Every frontend interface across the SG Forge platform MUST look polished, enterprise-grade, and strictly adhere to the **Meta Astryx Design System (`@forge/ui`)**. Zero amateur / "vibecoded" ad-hoc styling.

---

## 🛑 THE 12 META ASTRYX UI INVARIANTS

### 1. Zero Ad-Hoc Styling (Mandatory Token Consumption)
- **NEVER** use random hex colors, arbitrary inline styles, or ad-hoc gradients.
- **ALWAYS** consume centralized `--forge-*` CSS custom properties:
  - Backgrounds: `var(--forge-bg-root)`, `var(--forge-bg-surface)`, `var(--forge-bg-card)`, `var(--forge-bg-card-hover)`, `var(--forge-bg-elevated)`
  - Borders: `var(--forge-border)`, `var(--forge-border-medium)`
  - Primary & Accents: `var(--forge-primary)`, `var(--forge-primary-gradient)`, `var(--forge-accent)`
  - Text: `var(--forge-text-main)` (`#f8fafc`), `var(--forge-text-muted)` (`#94a3b8`), `var(--forge-text-subtle)` (`#64748b`)
  - Status: `var(--forge-success)`, `var(--forge-warning)`, `var(--forge-error)`

### 2. 8-Point Mathematical Spacing Scale
- All paddings, margins, gaps, and card dimensions must strictly align with the 8-point modular scale:
  - `4px` (xs), `8px` (sm), `16px` (md), `24px` (lg), `32px` (xl), `48px` (xxl).
- Avoid arbitrary values like `13px`, `19px`, or `27px`.

### 3. High-End Typography & Contrast (WCAG 2.1 AAA)
- Font stack: `-apple-system, BlinkMacSystemFont, 'Inter', 'SF Pro Display', 'Segoe UI', Roboto, sans-serif`.
- Headings: Bold (`700` / `800`), calibrated negative letter-spacing (`letter-spacing: -0.02em` to `-0.03em`), line-height `1.15` to `1.25`.
- Body: Normal (`400` / `500`), line-height `1.6`, clean readability.

### 4. Interactive State Machine on All Elements
- Every interactive element (Buttons, Cards, Inputs, Tabs) must have complete, smooth CSS transitions:
  - **Idle**: Clean hairline border with subtle background.
  - **Hover**: Subtle lift (`transform: translateY(-2px)`), border glow, and elevated shadow.
  - **Active / Click**: `transform: translateY(0)` with slight brightness reduction.
  - **Focus-Visible**: High-visibility focus ring (`box-shadow: 0 0 0 2px var(--forge-primary)`).
  - **Disabled**: `opacity: 0.5; cursor: not-allowed; pointer-events: none;`.

### 5. Glassmorphism & Elevation with Discipline
- Use subtle, calibrated backdrop blurs (`backdrop-filter: blur(16px)` to `blur(20px)`).
- Never stack heavy blur layers that degrade GPU performance.
- Hairline border overlay (`1px solid rgba(255, 255, 255, 0.08)`) on all elevated cards.

### 6. Zero Horizontal Scrolling (320px Responsive Guarantee)
- All containers must enforce `max-width: 100%`, `box-sizing: border-box`, `min-width: 0`.
- Text containers must use `overflow-wrap: anywhere` or `word-break: break-word`.
- Grid column tracks must use `minmax(0, 1fr)`.
- Zero horizontal page scroll (`document.documentElement.scrollWidth <= window.innerWidth`) down to 320px viewport.

### 7. Non-Technical End-User POV & Empathetic Feedback
- NEVER expose raw technical stack traces or cryptic HTTP errors (502, 500) to the user.
- Always provide clear, actionable, friendly messages with retry cues.
- Multi-state buttons: *Idle* &rarr; *In-Flight (Spinner)* &rarr; *Success/Error confirmation*.

### 8. Custom Astryx Scrollbars (Zero Browser/OS Defaults)
- **NEVER** let default browser/OS scrollbars render.
- **ALWAYS** enforce custom slim Astryx scrollbars (`::-webkit-scrollbar`, `scrollbar-width: thin`, `scrollbar-color`):
  - Track: `var(--forge-bg-root)` or `transparent`.
  - Thumb: `var(--forge-border-medium)` with rounded radius (`var(--forge-radius-full)`).
  - Hover: `var(--forge-primary)`.
  - High-density scrolling containers (terminals, log viewers, drawers, code blocks, tables) must look sleek and integrated with the dark/light theme.

### 9. Modern Astryx Popups, Modals & Dialogs (Zero Native Dialogs)
- **NEVER** use browser `window.confirm()`, `window.prompt()`, or unstyled native `<dialog>` elements.
- **ALWAYS** use Meta Astryx modal primitives (`.astryx-modal-backdrop`, `.astryx-modal`, `.astryx-modal-header`, `.astryx-modal-body`, `.astryx-modal-footer`):
  - Backdrop blur (`backdrop-filter: blur(12px)`) with semi-transparent dark overlay (`rgba(0, 0, 0, 0.75)`).
  - Smooth enter/exit transition animations (`scale(0.96) -> scale(1)`, `opacity 0 -> 1`).
  - Strict keyboard accessibility (`Escape` to close, click-outside-to-dismiss, autofocus management).

### 10. Astryx Toast & Notification Engine (Zero Native alert())
- **NEVER** use `window.alert()` or default browser notification alerts.
- **ALWAYS** use modern Astryx Toast notifications (`.astryx-toast`, `.astryx-toast-container`, `window.astryxToast(msg, type)`):
  - 4 status variants: Success (`--forge-success`), Error (`--forge-error` / `--forge-accent`), Warning (`--forge-warning`), Info (`--forge-primary`).
  - Glassmorphic card styling, auto-dismiss timers, action buttons, and slide-in animations.

### 11. Modern Astryx Dropdowns & Select Controls (Zero Native OS Menus)
- **NEVER** leave `<select>` elements with unstyled default OS appearance or bright white OS option menus in dark mode.
- **ALWAYS** style with `appearance: none`, custom SVG chevron arrow, `var(--forge-bg-surface)` / `var(--forge-bg-card)` options, `--forge-border` borders, and high-visibility `--forge-primary` focus rings.
- For complex multi-selects or comboboxes, use Astryx dropdown menu primitives (`.astryx-dropdown`, `.astryx-dropdown-menu`, `.astryx-dropdown-item`).

### 12. Strict Portal Single Page Application (SPA) & Responsiveness Invariant
- **Single Page Application**: The portal workspace (`apps/src/portal`) MUST strictly operate as an SPA.
  - Zero full-page hard refreshes when switching between workspace views or admin suite sections.
  - All navigation links must use client-side view switching (`data-view` / `data-nav` and `switchView()`) with URL query parameter history preservation (`history.replaceState`).
  - Active state must persist across tab/view transitions and client-side reload hydration.
- **Fluid Responsiveness**:
  - Fully responsive across desktop (>1024px), tablet (768px-1024px), and mobile (320px-768px).
  - Search trigger, organization pills, user triggers, and cards must seamlessly adapt to viewport width down to 320px with zero horizontal scrollbars.
