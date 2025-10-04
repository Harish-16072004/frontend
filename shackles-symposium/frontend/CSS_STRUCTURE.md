# CSS Structure Reorganization - SHACKLES Symposium Frontend

## 📋 Overview
This document details the CSS structure reorganization completed on October 4, 2025. All CSS files have been centralized into a single `src/styles/` directory for better maintainability and organization.

---

## 🗂️ New Structure

```
frontend/src/
├── styles/                          # ✨ NEW: Centralized CSS Directory
│   ├── variables.css               # CSS custom properties & design tokens
│   ├── globals.css                 # Global styles, resets & utilities
│   │
│   ├── Home.css                    # Home page styles
│   ├── Events.css                  # Events overview page
│   ├── Technical.css               # Technical/NonTechnical/Special events
│   ├── Workshop.css                # Workshop page
│   ├── Accommodation.css           # Accommodation page
│   ├── Team.css                    # Team page
│   ├── Contact.css                 # Contact page
│   │
│   ├── Login.css                   # Login page
│   ├── Register.css                # Registration page
│   ├── Profile.css                 # User profile page
│   ├── ForgotPassword.css          # Password reset page
│   │
│   └── AdminDashboard.css          # Admin dashboard
│
├── components/
│   └── common/
│       ├── Header.css              # Kept with component
│       ├── Footer.css              # Kept with component
│       └── Loader.css              # Kept with component
│
├── index.css                       # Entry point (imports variables & globals)
└── App.css                         # App component styles
```

---

## 🎨 CSS Architecture

### 1. **Entry Point: `index.css`**
The main CSS entry imported in `main.jsx`. It imports the foundational stylesheets:
```css
@import './styles/variables.css';
@import './styles/globals.css';
```

### 2. **Foundation Layer**

#### `variables.css` - Design System Tokens
Contains all CSS custom properties:
- **Colors**: Squid Game theme (pink, green, gold)
- **Typography**: Font families (GameOfSquids, Orbitron, Rajdhani)
- **Spacing**: Consistent spacing scale (xs, sm, md, lg, xl, 2xl)
- **Border Radius**: Radius values (sm, md, lg, xl, full)
- **Shadows**: Box shadows and glow effects
- **Transitions**: Animation durations
- **Z-index**: Layering system

#### `globals.css` - Global Styles & Utilities
- CSS Reset & base styles
- Font-face declarations
- Layout utilities (.container, .main-content)
- Typography classes (.page-title, .section-title)
- Message components (.error-message, .success-message, etc.)
- Form elements (inputs, textareas, selects)
- Button styles (.btn, .btn-primary, .btn-secondary, etc.)
- Card components (.card)
- Animations (@keyframes)
- Utility classes (spacing, text alignment)
- Responsive breakpoints

### 3. **Page-Specific Styles**
Each page has its own CSS file with:
- Component-scoped styles
- Page-specific layouts
- Custom animations
- Responsive overrides

### 4. **Component-Level Styles**
Kept alongside components for tight coupling:
- `Header.css` - Navigation bar
- `Footer.css` - Site footer
- `Loader.css` - Loading spinner

---

## 🔄 Migration Changes

### Import Path Updates

All component imports have been updated from relative to centralized paths:

**Before:**
```jsx
// In pages/Home.jsx
import './Home.css';

// In pages/Events/Events.jsx
import './Events.css';

// In pages/Auth/Login.jsx
import './Login.css';
```

**After:**
```jsx
// In pages/Home.jsx
import '../styles/Home.css';

// In pages/Events/Events.jsx
import '../../styles/Events.css';

// In pages/Auth/Login.jsx
import '../../styles/Login.css';
```

### Files Moved
| Old Location | New Location |
|--------------|--------------|
| `pages/Home.css` | `styles/Home.css` |
| `pages/Team.css` | `styles/Team.css` |
| `pages/Workshop.css` | `styles/Workshop.css` |
| `pages/Contact.css` | `styles/Contact.css` |
| `pages/Accommodation.css` | `styles/Accommodation.css` |
| `pages/Events/Events.css` | `styles/Events.css` |
| `pages/Events/Technical.css` | `styles/Technical.css` |
| `pages/Auth/Login.css` | `styles/Login.css` |
| `pages/Auth/Register.css` | `styles/Register.css` |
| `pages/Auth/Profile.css` | `styles/Profile.css` |
| `pages/Auth/ForgotPassword.css` | `styles/ForgotPassword.css` |
| `pages/Admin/AdminDashboard.css` | `styles/AdminDashboard.css` |

### Components Updated
✅ All 14 component files updated with new import paths:
- Home.jsx
- Team.jsx
- Workshop.jsx
- Contact.jsx
- Accommodation.jsx
- Events/Events.jsx
- Events/Technical.jsx
- Events/NonTechnical.jsx
- Events/Special.jsx
- Auth/Login.jsx
- Auth/Register.jsx
- Auth/Profile.jsx
- Auth/ForgotPassword.jsx
- Admin/AdminDashboard.jsx

---

## 🎯 Benefits

### 1. **Centralization**
- Single source of truth for all page styles
- Easy to locate and modify styles
- No hunting through nested directories

### 2. **Design System**
- `variables.css` provides consistent design tokens
- Easy to maintain brand colors, spacing, typography
- One place to update the entire theme

### 3. **Global Utilities**
- Reusable utility classes in `globals.css`
- Consistent buttons, cards, forms across the app
- Reduced CSS duplication

### 4. **Scalability**
- Clear separation between global and component styles
- Easy to add new page styles
- Better organization for large teams

### 5. **Maintenance**
- Faster debugging (know exactly where styles are)
- Easier refactoring
- Simpler code reviews

---

## 🚀 Usage Guidelines

### When to Add a New CSS File

**Add to `src/styles/`:**
- ✅ New page-specific styles
- ✅ Major feature section styles
- ✅ Shared layout styles

**Keep with Component:**
- ✅ Tightly coupled component styles (Header, Footer)
- ✅ Reusable UI components (Button, Card, Modal)
- ✅ Small, self-contained components

### Using CSS Variables

Always prefer CSS variables from `variables.css`:

```css
/* ✅ Good */
.my-component {
  color: var(--color-green);
  padding: var(--spacing-md);
  border-radius: var(--radius-lg);
  transition: all var(--transition-base);
}

/* ❌ Avoid */
.my-component {
  color: #0AD7A1;
  padding: 1rem;
  border-radius: 8px;
  transition: all 0.3s ease;
}
```

### Utility Classes

Use global utility classes from `globals.css`:

```jsx
// Spacing utilities
<div className="mt-3 mb-4 p-2">...</div>

// Text alignment
<h1 className="text-center">Title</h1>

// Animation
<div className="fade-in">...</div>

// Buttons
<button className="btn btn-primary">Click Me</button>

// Messages
<div className="success-message">Success!</div>
```

---

## 📝 Best Practices

### 1. **Naming Conventions**
- Use BEM-like naming: `.component-name__element--modifier`
- Page styles: Match the page name (Home.css for Home.jsx)
- Be descriptive: `.event-card` not `.ec`

### 2. **Organization Within Files**
```css
/* 1. Component container */
.component-name { }

/* 2. Child elements */
.component-name__header { }
.component-name__body { }

/* 3. States & modifiers */
.component-name--active { }
.component-name:hover { }

/* 4. Media queries */
@media (max-width: 768px) { }
```

### 3. **Avoid Inline Styles**
```jsx
// ❌ Avoid
<div style={{ color: 'red', padding: '10px' }}>...</div>

// ✅ Prefer
<div className="error-message">...</div>
```

### 4. **Use Semantic Class Names**
```css
/* ✅ Good - describes purpose */
.workshop-registration-form { }
.event-countdown-timer { }

/* ❌ Avoid - describes appearance */
.red-box { }
.big-text { }
```

---

## 🔍 Verification

### Test the Changes
```powershell
# Navigate to frontend
cd frontend

# Install dependencies (if needed)
npm install

# Start dev server
npm run dev

# Open http://localhost:5173
# Navigate through all pages to verify styles are working
```

### Pages to Test
- ✅ Home (/)
- ✅ Events (/events, /events/technical, /events/nontechnical, /events/special)
- ✅ Workshop (/workshop)
- ✅ Accommodation (/accommodation)
- ✅ Team (/team)
- ✅ Contact (/contact)
- ✅ Login (/login)
- ✅ Register (/register)
- ✅ Profile (/profile)
- ✅ Forgot Password (/forgot-password)
- ✅ Admin Dashboard (/admin)

---

## 🎨 Design System Reference

### Color Palette
```css
--color-pink: #E31B6C       /* Guard Pink - Primary accent */
--color-green: #0AD7A1      /* Player Green - Success */
--color-gold: #FFBF00       /* VIP Gold - Premium */
--accent-blue: #3498DB      /* Info accent */
```

### Typography Scale
```css
--font-title: 'GameOfSquids'   /* Brand/Logo */
--font-heading: 'Orbitron'     /* Headings */
--font-body: 'Rajdhani'        /* Body text */
```

### Spacing Scale
```css
--spacing-xs: 0.25rem    /* 4px */
--spacing-sm: 0.5rem     /* 8px */
--spacing-md: 1rem       /* 16px */
--spacing-lg: 1.5rem     /* 24px */
--spacing-xl: 2rem       /* 32px */
--spacing-2xl: 3rem      /* 48px */
```

---

## 🐛 Troubleshooting

### Styles Not Loading
1. Check import path is correct (`../styles/` vs `../../styles/`)
2. Verify CSS file exists in `src/styles/`
3. Check browser console for 404 errors
4. Clear Vite cache: `rm -rf node_modules/.vite`

### CSS Variables Not Working
1. Ensure `index.css` imports `variables.css`
2. Check variable name spelling
3. Use browser DevTools to inspect computed styles

### Conflicting Styles
1. Use more specific selectors
2. Check for duplicate class names
3. Review cascade order (specificity)

---

## 📚 Related Documentation
- [Frontend Structure](../README.md) _(to be created)_
- [Component Guidelines](./COMPONENT_GUIDELINES.md) _(to be created)_
- [Design System](./DESIGN_SYSTEM.md) _(to be created)_

---

## ✅ Checklist for Future Updates

When adding a new page:
- [ ] Create CSS file in `src/styles/`
- [ ] Use naming convention: `PageName.css`
- [ ] Import CSS variables at the top
- [ ] Follow BEM naming conventions
- [ ] Add responsive breakpoints
- [ ] Test on all screen sizes
- [ ] Update this documentation

---

**Last Updated:** October 4, 2025  
**Reorganized By:** GitHub Copilot  
**Status:** ✅ Complete
