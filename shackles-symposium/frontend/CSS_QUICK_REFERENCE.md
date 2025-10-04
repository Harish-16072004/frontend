# Quick Reference Card - CSS Structure

## 📁 File Locations

```bash
# Page styles - import from ../styles/ or ../../styles/
src/styles/Home.css
src/styles/Events.css
src/styles/Login.css
# ... all page styles here

# Component styles - co-located
src/components/common/Header.css
src/components/common/Footer.css
```

## 🎨 Using CSS Variables

```css
/* Colors */
var(--color-pink)      /* #E31B6C - Guard Pink */
var(--color-green)     /* #0AD7A1 - Player Green */
var(--color-gold)      /* #FFBF00 - VIP Gold */
var(--accent-blue)     /* #3498DB - Info */

/* Typography */
var(--font-title)      /* GameOfSquids */
var(--font-heading)    /* Orbitron */
var(--font-body)       /* Rajdhani */

/* Spacing */
var(--spacing-xs)      /* 4px */
var(--spacing-sm)      /* 8px */
var(--spacing-md)      /* 16px */
var(--spacing-lg)      /* 24px */
var(--spacing-xl)      /* 32px */
var(--spacing-2xl)     /* 48px */

/* Radius */
var(--radius-sm)       /* 4px */
var(--radius-md)       /* 6px */
var(--radius-lg)       /* 8px */
var(--radius-xl)       /* 12px */

/* Shadows */
var(--shadow-glow-pink)
var(--shadow-glow-green)
var(--shadow-glow-gold)

/* Transitions */
var(--transition-fast)    /* 0.15s */
var(--transition-base)    /* 0.3s */
var(--transition-slow)    /* 0.5s */
```

## 🛠️ Utility Classes

```jsx
/* Buttons */
<button className="btn btn-primary">Primary</button>
<button className="btn btn-secondary">Secondary</button>
<button className="btn btn-outline">Outline</button>

/* Messages */
<div className="error-message">Error!</div>
<div className="success-message">Success!</div>
<div className="warning-message">Warning!</div>
<div className="info-message">Info!</div>

/* Cards */
<div className="card">Content</div>

/* Spacing */
<div className="mt-3 mb-4 p-2">Content</div>
/* mt-1 to mt-4, mb-1 to mb-4, p-1 to p-4 */

/* Text Alignment */
<div className="text-center">Centered</div>
<div className="text-left">Left</div>
<div className="text-right">Right</div>

/* Animations */
<div className="fade-in">Fades in</div>
<div className="slide-in-left">Slides from left</div>
<div className="slide-in-right">Slides from right</div>
```

## 📝 Adding New Page Styles

1. Create CSS file in `src/styles/`:
   ```bash
   src/styles/MyNewPage.css
   ```

2. Import in your component:
   ```jsx
   import '../styles/MyNewPage.css';
   // or from Events/ folder:
   import '../../styles/MyNewPage.css';
   ```

3. Use CSS variables:
   ```css
   .my-new-page {
     color: var(--color-green);
     padding: var(--spacing-xl);
     border-radius: var(--radius-lg);
   }
   ```

## 🎯 Best Practices

✅ **DO:**
- Use CSS variables from `variables.css`
- Use utility classes from `globals.css`
- Keep component CSS with component
- Name files to match component names
- Use BEM-like naming conventions

❌ **DON'T:**
- Use inline styles
- Hard-code colors/spacing values
- Put page styles with component
- Create duplicate utilities

## 🔍 Finding Styles

```bash
# Page styles
src/styles/[PageName].css

# Component styles
src/components/[path]/[ComponentName].css

# Global styles
src/styles/globals.css

# Design tokens
src/styles/variables.css
```

## 📚 Documentation

- **Full Guide:** `CSS_STRUCTURE.md`
- **Summary:** `CSS_REORGANIZATION_SUMMARY.md`
- **Visual:** `CSS_REORGANIZATION_VISUAL.txt`
- **Checklist:** `CSS_REORGANIZATION_CHECKLIST.md`

---

**Last Updated:** October 4, 2025
