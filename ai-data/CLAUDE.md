# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static marketing website for **Brite.AI** — AI consulting services for government agencies and nonprofits. Powered by Salesforce Agentforce. No build tools, no frameworks — pure vanilla HTML5, CSS3, and JavaScript.

## Directory Structure

```
html/
├── ai-data/          ← THIS DIRECTORY (29 service/tool pages)
│   ├── index.html    ← Hub page with tabbed service categories
│   ├── readiness-assessment.html  ← Interactive quiz (35KB, largest)
│   ├── roi-calculator.html        ← Interactive calculator
│   └── [26 other service pages]
├── css/styles.css    ← Single stylesheet (1,326 lines), all pages share this
├── js/main.js        ← Single JS file (501 lines), all pages share this
├── solutions/
├── industries/
├── about/
├── insights/
└── contact/
```

All pages in `ai-data/` reference shared assets with relative paths: `../css/styles.css` and `../js/main.js`.

## Page Template

Every page follows this structure:
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>[Page Title] | Brite.AI</title>
  <meta name="description" content="...">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../css/styles.css">
  <!-- Page-specific <style> only if needed (roi-calculator, readiness-assessment) -->
</head>
<body>
  <nav class="navbar">...</nav>           <!-- Fixed, 72px height -->
  <section class="hero">...</section>     <!-- Min 80vh -->
  <!-- Content sections -->
  <section class="cta">...</section>      <!-- Gradient dark blue CTA -->
  <footer class="footer">...</footer>
  <script src="../js/main.js"></script>
</body>
</html>
```

The navbar and footer HTML are duplicated in every file (no templating system). When editing nav/footer, all 29 pages must be updated.

## CSS Architecture

### Naming: BEM Convention
- Blocks: `.navbar`, `.card`, `.btn`, `.section`
- Elements: `.navbar__menu`, `.card__title`, `.hero__badge`
- Modifiers: `.btn--primary`, `.section--dark`, `.grid--3`
- States: `.active`, `.selected`, `.animated`, `.error`

### Design Tokens (CSS Custom Properties)
All theming is done via variables defined at `:root` in `styles.css`:

| Token | Value | Usage |
|-------|-------|-------|
| `--color-primary` | `#0066CC` | Brand blue, buttons, links |
| `--color-secondary` | `#00A878` | Green accents |
| `--color-accent` | `#FF6B35` | Orange highlights |
| `--color-text` | `#1A1A2E` | Body text |
| `--color-text-light` | `#4A4A68` | Secondary text |
| `--color-background-alt` | `#F5F7FA` | Alternating sections |
| `--container-max` | `1280px` | Content width |

Spacing uses `--space-{n}` (1-24, rem-based). Typography uses `--text-{size}` (xs through 6xl). Shadows use `--shadow-{sm,md,lg,xl}`.

### Responsive Breakpoints
- Desktop: base (1280px+)
- Tablet: `max-width: 1024px`
- Mobile: `max-width: 768px`

Grids reduce columns at breakpoints: 4→2→1, 3→2→1, 2→1.

## JavaScript Components (main.js)

All components are initialized via data attributes — no manual JS wiring needed:

| Component | Trigger | Key Attributes |
|-----------|---------|---------------|
| Accordion | `.accordion` | `.accordion__header` click toggles `.active` |
| Tabs | `.tabs` | `data-tab`, `data-tab-content` |
| Slider | `.slider` | `.slider--3`/`--2` for columns, `data-autoplay` |
| Counter | `[data-counter]` | `data-counter`, `data-suffix`, `data-prefix`, `data-duration` |
| Scroll Animate | `[data-animate]` | `data-delay` for stagger; values: `fade-left`, `fade-right`, `scale` |
| Modal | `[data-modal-open]` | `Modal.open(id)` / `Modal.close(id)` |
| Form Validate | `form[data-validate]` | Required fields, email regex |
| Tooltip | `[data-tooltip]` | Content from attribute value |
| Progress Bar | `[data-value]` | Percentage, IntersectionObserver triggered |
| Smooth Scroll | `a[href^="#"]` | 80px navbar offset |

Navbar auto-adds `.navbar--scrolled` on scroll and `.navbar--hidden` when scrolling down.

## Fonts

- **Plus Jakarta Sans** (600/700/800): Headings
- **Inter** (400/500/600/700): Body text

## Key Conventions

- Page-specific styles go in an inline `<style>` tag in the page's `<head>` (see `roi-calculator.html`, `readiness-assessment.html`)
- SVG icons are inline (no icon library)
- All interactive components use IntersectionObserver for scroll-triggered activation
- Links between pages use relative paths (`ai-strategy.html`, `../contact/index.html`)
- Hero sections use `.hero__badge` for category labels and `.text-gradient` for emphasis
- CTA sections always use the dark gradient pattern with white text
