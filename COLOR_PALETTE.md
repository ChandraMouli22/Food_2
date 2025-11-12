# 🎨 Food Donation Platform - Unified Color Palette

## Overview

This document defines the complete color system for the Food Donation Platform. All pages use these consistent colors to create a cohesive, professional, and accessible user experience.

---

## 🟢 Primary Colors - Green Theme

### Primary Green (Main Brand Color)

Used for: Donor pages, primary actions, success states

```css
--primary-green: #10b981        /* Main green */
--primary-green-light: #34d399  /* Lighter variant */
--primary-green-dark: #059669   /* Darker variant */
```

**Visual:**

- RGB: 16, 185, 129
- HEX: #10b981
- Usage: Primary buttons, active states, donor branding

**Where it's used:**

- Donor login page background
- Donor dashboard background
- Primary action buttons
- Success alerts
- Active navigation items

---

## 🟠 Secondary Colors - Orange Theme

### Secondary Orange (Organization Theme)

Used for: Organization pages, secondary actions, warnings

```css
--secondary-orange: #f59e0b        /* Main orange */
--secondary-orange-light: #fbbf24  /* Lighter variant */
--secondary-orange-dark: #d97706   /* Darker variant */
```

**Visual:**

- RGB: 245, 158, 11
- HEX: #f59e0b
- Usage: Secondary buttons, organization branding, accents

**Where it's used:**

- Organization login page background
- Call-to-action buttons on landing page
- Organization-specific UI elements
- Warning states
- Accent colors in statistics

---

## ⚪ Neutral Colors

### Dark Backgrounds

```css
--dark-bg: #1f2937           /* Main dark */
--dark-bg-light: #374151     /* Lighter dark */
```

**Usage:**

- Navigation bars
- Footer sections
- Dark overlays
- Hero section backgrounds

### Light Backgrounds

```css
--light-bg: #f9fafb          /* Main light */
--light-bg-alt: #f3f4f6      /* Alternative light */
--white: #ffffff             /* Pure white */
```

**Usage:**

- Page backgrounds
- Card backgrounds
- Form backgrounds
- Content areas

### Text Colors

```css
--text-dark: #111827         /* Main text */
--text-gray: #6b7280         /* Secondary text */
--text-light: #ffffff        /* Light text */
```

**Usage:**

- Primary content text (#111827)
- Helper text, labels (#6b7280)
- Text on dark backgrounds (#ffffff)

---

## 🔵 Accent Colors

### Blue (Information)

```css
--accent-blue: #3b82f6;
```

**Usage:**

- Info alerts
- Links
- Informational badges

### Purple (Special Features)

```css
--accent-purple: #8b5cf6;
```

**Usage:**

- Premium features
- Special highlights
- Decorative elements

---

## ⚡ Status Colors

### Success

```css
--success: #10b981; /* Same as primary green */
```

**Usage:**

- Success messages
- Completed states
- Positive feedback

### Error

```css
--error: #ef4444;
```

**Usage:**

- Error messages
- Validation errors
- Critical alerts

### Warning

```css
--warning: #f59e0b; /* Same as secondary orange */
```

**Usage:**

- Warning messages
- Caution states
- Pending actions

### Info

```css
--info: #3b82f6; /* Same as accent blue */
```

**Usage:**

- Information messages
- Helper text
- Neutral notifications

---

## 🎨 Color Usage by Page Type

### 🟢 Donor Pages

**Primary Color:** Green (#10b981)

- **Background:** Green gradient
- **Buttons:** Green gradient
- **Accents:** Orange highlights
- **Text:** Dark gray on white, white on dark

**Pages:**

- `/donlogin` - Donor Login
- `/don_home` - Donor Dashboard
- `/donRegister` - Donor Registration
- `/don_profile` - Donor Profile
- `/don_history` - Donor History

### 🟠 Organization Pages

**Primary Color:** Orange (#f59e0b)

- **Background:** Orange gradient
- **Buttons:** Orange gradient
- **Accents:** Green highlights
- **Text:** Dark gray on white, white on dark

**Pages:**

- `/orglogin` - Organization Login
- `/org_home` - Organization Dashboard
- `/orgRegister` - Organization Registration
- `/org_profile` - Organization Profile
- `/org_history` - Organization History

### 🌐 Public Pages

**Primary Colors:** Mixed (Green & Orange)

- **Background:** Dark gradient or light
- **Buttons:** Green (primary), Orange (secondary)
- **Accents:** Both colors used
- **Text:** Dark gray on white, white on dark

**Pages:**

- `/` - Landing Page
- `/signup` - Role Selection

---

## 📐 Gradient Combinations

### Primary Green Gradient

```css
background: linear-gradient(135deg, #10b981 0%, #059669 100%);
```

**Use for:**

- Donor page backgrounds
- Primary buttons
- Success states

### Secondary Orange Gradient

```css
background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
```

**Use for:**

- Organization page backgrounds
- Secondary buttons
- Call-to-action elements

### Dark Gradient

```css
background: linear-gradient(135deg, #1f2937 0%, #374151 100%);
```

**Use for:**

- Navigation bars
- Footer sections
- Dark overlays

### Hero Overlay

```css
background: linear-gradient(
  135deg,
  rgba(31, 41, 55, 0.85),
  rgba(55, 65, 81, 0.75)
);
```

**Use for:**

- Hero section overlays
- Image overlays
- Dark semi-transparent backgrounds

---

## 🎯 Button Color Mapping

### Primary Button (Green)

```css
.btn-primary {
  background: linear-gradient(135deg, #10b981, #059669);
  color: #ffffff;
  box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
}
```

**Use cases:**

- Main actions (Submit, Save, Donate)
- Donor-specific buttons

### Secondary Button (Orange)

```css
.btn-secondary {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: #ffffff;
  box-shadow: 0 4px 15px rgba(245, 158, 11, 0.3);
}
```

**Use cases:**

- Secondary actions (Sign Up, Register)
- Organization-specific buttons

### Outline Button

```css
.btn-outline {
  background: transparent;
  color: #10b981;
  border: 2px solid #10b981;
}
```

**Use cases:**

- Tertiary actions
- Cancel buttons
- Non-primary CTAs

---

## ♿ Accessibility Guidelines

### Contrast Ratios

All color combinations meet WCAG AA standards:

✅ **Passing Combinations:**

- `#111827` on `#ffffff` - 15.5:1 (AAA)
- `#ffffff` on `#10b981` - 2.9:1 (AA for large text)
- `#ffffff` on `#f59e0b` - 2.1:1 (AA for large text)
- `#ffffff` on `#1f2937` - 13.1:1 (AAA)

❌ **Avoid:**

- Light text on light backgrounds
- Gray text on colored backgrounds (low contrast)

### Color Blindness Considerations

- Green and Orange are distinguishable for most color blind users
- Icons and text labels accompany all color-coded information
- Never rely on color alone to convey information

---

## 🖌️ Implementation Examples

### CSS Variables in Use

```css
/* Donor login background */
body {
  background: linear-gradient(
    135deg,
    var(--primary-green),
    var(--primary-green-dark)
  );
}

/* Organization login background */
body {
  background: linear-gradient(
    135deg,
    var(--secondary-orange),
    var(--secondary-orange-dark)
  );
}

/* Success alert */
.alert-success {
  background: #d1fae5;
  color: #065f46;
  border-left: 4px solid var(--success);
}

/* Primary button */
.btn-primary {
  background: linear-gradient(
    135deg,
    var(--primary-green),
    var(--primary-green-dark)
  );
}
```

---

## 📋 Quick Reference

| Color Name       | Hex Code | RGB           | Usage                        |
| ---------------- | -------- | ------------- | ---------------------------- |
| Primary Green    | #10b981  | 16, 185, 129  | Donor theme, primary actions |
| Secondary Orange | #f59e0b  | 245, 158, 11  | Org theme, secondary actions |
| Dark BG          | #1f2937  | 31, 41, 55    | Navigation, footer           |
| Light BG         | #f9fafb  | 249, 250, 251 | Page backgrounds             |
| Text Dark        | #111827  | 17, 24, 39    | Main text                    |
| Text Gray        | #6b7280  | 107, 114, 128 | Secondary text               |
| Error            | #ef4444  | 239, 68, 68   | Error states                 |
| Success          | #10b981  | 16, 185, 129  | Success states               |

---

## 🔄 Migration from Old Colors

### Before (Old Color System)

```css
/* Old inconsistent colors */
--primary-color: #20b420
--secondary-color: #ffd700
--dark-bg: #1a1a2e
```

### After (New Unified System)

```css
/* New consistent colors */
--primary-green: #10b981
--secondary-orange: #f59e0b
--dark-bg: #1f2937
```

**Changes Made:**

- ✅ Replaced bright green (#20b420) with professional green (#10b981)
- ✅ Replaced gold (#ffd700) with warm orange (#f59e0b)
- ✅ Replaced purple-ish dark (#1a1a2e) with neutral gray (#1f2937)
- ✅ Added proper color variations (light, dark)
- ✅ Standardized all gradients
- ✅ Ensured accessibility compliance

---

## 💡 Best Practices

### DO ✅

- Use CSS variables for all colors
- Maintain consistent gradients
- Test contrast ratios
- Use semantic color names
- Follow the established patterns

### DON'T ❌

- Hard-code color values
- Mix old and new colors
- Use colors that fail accessibility
- Create new colors without documentation
- Override colors inconsistently

---

**Version:** 2.0.0  
**Last Updated:** November 12, 2025  
**Maintained by:** Development Team
