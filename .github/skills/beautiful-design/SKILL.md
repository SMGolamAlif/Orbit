---
name: beautiful-design
description: 'Design clean, beautiful websites that don''t look AI-generated. Use when: designing UI components, pages, or layouts; styling with Tailwind CSS; creating glassmorphism, gradients, or dark/light themes; avoiding generic "AI slop" aesthetics; crafting distinctive visual identities with personality. Covers typography, spacing, color, micro-interactions, and anti-patterns.'
argument-hint: '[what to design or redesign]'
---

# Beautiful Design — Clean, Human-Crafted UI

## Philosophy

AI-generated UIs share telltale patterns: uniform spacing, predictable blue/purple gradients, identical border-radius everywhere, no typographic hierarchy, and zero personality. This skill helps you break those patterns and design interfaces that feel hand-crafted by a skilled designer.

## Core Principles

### 1. Typography Is 80% of Design

Typography alone separates AI slop from polished work. Follow these rules:

- **Never use a single font family.** Pair a distinctive heading font with a clean body font. Examples: `"Space Grotesk"` + `"Inter"`, `"Fraunces"` + `"DM Sans"`, `"Cabinet Grotesk"` + `"Satoshi"`.
- **Establish a clear type scale.** Don't let Tailwind's default sizes dictate your hierarchy. Define at least 5 distinct levels with meaningful size jumps (not just 2px increments).
- **Letter-spacing matters.** Tighten headings (`-0.02em` to `-0.04em`), loosen uppercase labels (`0.05em` to `0.12em`).
- **Line-height is contextual.** Headings: `1.1`–`1.25`. Body: `1.5`–`1.7`. Small labels: `1.3`–`1.4`.
- **Use variable fonts when possible.** They give you weight, width, and optical size axes for fine-tuning.

### 2. Spacing: Break the Grid Occasionally

AI defaults to uniform 16px/24px/32px spacing everywhere. Human designers create rhythm:

- **Group related elements tightly** (8–12px), separate sections generously (48–80px).
- **Use asymmetric padding.** A card might have `padding: 32px 28px 24px 28px` — the slight asymmetry feels intentional.
- **Negative space is a design element.** Don't fill every pixel. Large empty areas create focus.
- **Optical alignment over mathematical.** Visually center elements that feel off-center due to their shape (play buttons, icons with tails).

### 3. Color: Restrained, Not Random

- **One dominant accent, one supporting accent.** Never more than two accent colors in a single view.
- **Neutrals should have temperature.** Pure gray (`#808080`) looks sterile. Use warm grays (hinting toward brown) or cool grays (hinting toward blue).
- **Gradients should be subtle.** If you can immediately tell it's a gradient, it's too strong. Use HSL shifts of 5–15° max, or opacity-based gradients.
- **Dark mode is not just inverted light mode.** Dark surfaces should feel luminous, not muddy. Use translucent overlays, not solid dark grays.

### 4. Depth Without Drop-Shadows

AI loves `box-shadow: 0 4px 12px rgba(0,0,0,0.1)` on everything. Instead:

- **Use layering.** Light cards on a slightly darker background create depth without shadows.
- **Border-light technique.** A 1px semi-transparent border (`rgba(255,255,255,0.08)`) on dark cards creates separation elegantly.
- **Backdrop blur (glassmorphism).** When used sparingly, `backdrop-filter: blur()` creates depth that feels premium.
- **If you must use shadows**, make them large and soft (`0 20px 60px rgba(0,0,0,0.12)`) or use colored shadows that match the brand.

### 5. Micro-Interactions That Feel Alive

- **Hover states should be subtle.** A 1–2px translateY, a slight brightness shift, or a border-color change. Never scale beyond 1.02x.
- **Transitions should be fast.** 150–250ms for micro-interactions, 300–500ms for page transitions. Use `cubic-bezier(0.4, 0, 0.2, 1)` (ease-out) for most things.
- **Stagger children.** When animating lists, stagger by 50–80ms per item.
- **Don't animate everything.** Pick 2–3 key moments per page. Over-animation is as bad as no animation.

### 6. Anti-Patterns to Avoid

These are the hallmarks of AI-generated design:

| Pattern                            | Why It's Bad              | What to Do Instead                                                                    |
| ---------------------------------- | ------------------------- | ------------------------------------------------------------------------------------- |
| Identical border-radius everywhere | Looks templated           | Vary: cards 16–24px, buttons 8–14px, inputs 8–12px                                    |
| Purple-to-cyan gradients           | Most overused AI gradient | Use single-color gradients (light-to-dark of same hue) or warm/cool neutral gradients |
| Centered everything                | Lacks editorial feel      | Use asymmetric layouts, left-aligned text with right-aligned accents                  |
| Same padding on all sides          | Feels mechanical          | Use asymmetric padding, especially top-heavy                                          |
| Inter font everywhere              | Screams "default"         | Pair a distinctive heading font with Inter for body only                              |
| Full-opacity borders               | Heavy and dated           | Use `border-white/5` or `border-black/5` for subtle separation                        |
| Pure white cards on gray bg        | High contrast, harsh      | Use off-white cards (`#FAFAFA`) on slightly darker bg (`#F5F5F5`)                     |
| No text-transform variation        | Flat hierarchy            | Use uppercase for labels, normal case for body, capitalize sparingly                  |

## Design Checklist

Before finalizing any UI component, verify:

- [ ] Typography: At least 2 font families, clear hierarchy with 4+ distinct sizes
- [ ] Spacing: Asymmetric where appropriate, grouped tight / separated loose
- [ ] Color: ≤2 accent colors, warm/cool neutrals (not pure gray), subtle gradients
- [ ] Depth: Elevation via layering or subtle borders, not heavy shadows
- [ ] Motion: 2–3 key animations max, 150–300ms, ease-out curves
- [ ] Anti-AI: No purple-to-cyan gradients, no uniform border-radius, no Inter-only typography
- [ ] Personality: At least one distinctive element (unusual type pairing, asymmetric layout, custom illustration style, unique color combination)

## Procedure

1. **Audit the existing design.** Identify which anti-patterns are present.
2. **Choose a typographic system.** Pick heading + body font pair, define scale.
3. **Define the color palette.** 1–2 accent colors, warm or cool neutrals, dark mode variants.
4. **Design the spacing rhythm.** Define a spacing scale (not just Tailwind defaults).
5. **Add one distinctive element.** A custom illustration style, an unusual layout, a unique interaction.
6. **Review against the checklist.** Run through the anti-patterns table and the checklist above.
7. **Implement with restraint.** Less is more. Remove elements until the design feels intentional, not busy.
