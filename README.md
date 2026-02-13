# KodNest Premium Build System

## Design Philosophy

A calm, intentional, and coherent design system for serious B2C product development.

### Core Principles
- **Calm, Intentional, Coherent, Confident**
- Not flashy, not loud, not playful, not hackathon-style
- No gradients, no glassmorphism, no neon colors, no animation noise
- Everything feels like one mind designed it

---

## Color System

Maximum 4 colors across the entire system:

| Token | Value | Usage |
|-------|-------|-------|
| `--color-background` | `#F7F6F3` | Off-white background |
| `--color-text-primary` | `#111111` | Primary text |
| `--color-accent` | `#8B0000` | Deep red accent, primary actions |
| `--color-success` | `#2D5016` | Muted green for success states |
| `--color-warning` | `#8B6914` | Muted amber for warnings |
| `--color-border` | `#D4D2CC` | Subtle borders |

---

## Typography System

### Fonts
- **Headings**: Crimson Pro (Serif) - Large, confident, generous spacing
- **Body**: Inter (Sans-serif) - Clean, readable

### Scale
| Class | Font | Size | Line Height | Usage |
|-------|------|------|-------------|-------|
| `.heading-xl` | Serif | 48px | 1.2 | Page titles |
| `.heading-lg` | Serif | 32px | 1.2 | Section titles |
| `.heading-md` | Serif | 24px | 1.2 | Card titles |
| `.body-text` | Sans | 16px | 1.6 | Primary content |
| `.body-text-sm` | Sans | 14px | 1.6 | Secondary content |

### Rules
- Body text max-width: **720px** (prevents eye strain)
- Line height: **1.6–1.8** for body text
- No decorative fonts, no random sizes

---

## Spacing System

Consistent scale based on 8px increments:

| Token | Value | Usage |
|-------|-------|-------|
| `--space-xs` | 8px | Tight spacing, badges |
| `--space-sm` | 16px | Standard gaps, padding |
| `--space-md` | 24px | Card padding, sections |
| `--space-lg` | 40px | Large sections |
| `--space-xl` | 64px | Major sections |

**Never use random spacing** like 13px, 27px, etc. Whitespace is part of the design.

---

## Global Layout Structure

Every page follows this structure:

```
[Top Bar]
    ↓
[Context Header]
    ↓
[Primary Workspace (70%) | Secondary Panel (30%)]
    ↓
[Proof Footer]
```

### Top Bar
- **Left**: Project name
- **Center**: Progress indicator (Step X / Y)
- **Right**: Status badge (Not Started / In Progress / Shipped)

### Context Header
- Large serif headline
- 1-line subtext
- Clear purpose, no hype language

### Primary Workspace (70% width)
- Main product interaction area
- Clean cards, predictable components
- No crowding

### Secondary Panel (30% width)
- Step explanation (short)
- Copyable prompt box
- Action buttons: Copy, Build in Lovable, It Worked, Error, Add Screenshot
- Calm styling

### Proof Footer (persistent bottom)
Checklist style:
- ☐ UI Built
- ☐ Logic Working
- ☐ Test Passed
- ☐ Deployed

Each checkbox requires user proof input.

---

## Component Rules

### Buttons
- **Primary**: Solid deep red (`--color-accent`)
- **Secondary**: Outlined with border
- Same hover effect everywhere
- Same border radius everywhere (`4px`)
- Transition: `150ms ease-in-out`

### Inputs
- Clean borders, no heavy shadows
- Clear focus state (border changes to `--color-text-primary`)
- Consistent padding (`16px`)

### Cards
- Subtle border (`1px solid --color-border`)
- No drop shadows
- Balanced padding (`40px` for main cards, `24px` for nested)
- Background: white on off-white

### Status Badges
- Small, inline
- Border + background color match
- Muted colors (no bright neon)

---

## Interaction Rules

### Transitions
- Speed: **150–200ms**
- Timing: **ease-in-out**
- No bounce, no parallax, no complex animations

### Hover States
- Buttons: Background darkens or border strengthens
- Inputs: Border color changes
- Cards: No hover effect (static)

---

## Error & Empty States

### Errors
- Explain what went wrong
- Provide how to fix it
- Never blame the user
- Use muted red background with clear text

### Empty States
- Provide next action
- Never feel dead or abandoned
- Include a clear CTA button

---

## File Structure

```
index.html      - Main HTML structure with component examples
index.css       - Complete design system CSS
app.js          - Minimal JavaScript for interactions
README.md       - This documentation
```

---

## Usage Guidelines

1. **Always use design tokens** - Never hardcode colors or spacing
2. **Follow the spacing scale** - Only use defined spacing values
3. **Maintain consistency** - Same patterns everywhere
4. **No visual drift** - Everything should feel cohesive
5. **Calm over flashy** - When in doubt, choose restraint

---

## Component Examples

All components are demonstrated in `index.html`:
- Typography samples
- Button variations
- Form elements
- Status badges
- Cards (standard and nested)
- Empty states
- Error states
- Prompt boxes
- Action groups

---

## Browser Support

- Modern evergreen browsers (Chrome, Firefox, Safari, Edge)
- CSS Grid and Flexbox required
- CSS Custom Properties required

---

## License

Proprietary - KodNest Premium Build System

---

**Design System Version**: 1.0.0  
**Last Updated**: February 2026
