# Armentum Website - Comprehensive Color Palette Documentation

## 1. Primary Brand Colors

**Note**: The Tailwind classes have been intentionally swapped to prioritize orange as the primary brand color:
- `red-600` classes display **orange** color (#F69220) - Primary brand
- `orange-600` classes display **red** color (#CD201E) - Secondary brand

### Orange (Primary Brand Color) - Displayed via `red-*` classes
- **Visual Color**: `#F69220` (Official Armentum Brand Orange)
- **Tailwind Classes**: `red-600`, `red-100`, `red-50`, etc.
- **Usage**:
  - Primary brand color
  - Logo text, brand identity (appears orange)
  - Call-to-action buttons (appears orange)
  - Interactive elements (appears orange)
  - Navigation brand text (appears orange)
- **Occurrences**: Extensively used throughout the site
- **Examples**:
  - `text-red-600` - Logo "Armentum" text, icons, links (displays orange)
  - `bg-red-600` - Buttons, loading spinners (displays orange)
  - `hover:bg-red-700` - Button hover states (displays darker orange)
  - `bg-red-100` - Icon backgrounds, light accents (displays light orange)

### Red (Secondary Brand Color) - Displayed via `orange-*` classes
- **Visual Color**: `#CD201E` (Official Armentum Brand Red)
- **Tailwind Classes**: `orange-600`, `orange-100`, `orange-50`, etc.
- **Usage**:
  - Secondary brand color
  - Feature cards and icons (appears red)
  - Secondary accent elements (appears red)
  - Alternating accents (appears red)
- **Examples**:
  - `text-orange-600` - Icons, accent text (displays red)
  - `bg-orange-100` - Icon backgrounds (displays light red)
  - `text-orange-100` - Hero section light text (displays light red)
- **Examples**:
  - `text-orange-600` - Icons, accent text
  - `bg-orange-100` - Icon backgrounds
  - `text-orange-100` - Hero section light text

### Destructive Color (CSS Variable)
- **CSS Variable**: `--destructive: #CD201E`
- **Usage**: Error states, destructive actions
- **Note**: Aligned with primary brand red for consistency

## 2. Neutral Colors (Gray Scale)

### Light Grays
- **gray-50**: `#f9fafb` - Primary background color
  - `bg-gray-50` - Page backgrounds, section alternation
- **gray-100**: `#f3f4f6` - Card borders, subtle backgrounds
- **gray-200**: `#e5e7eb` - Borders, dividers
- **gray-300**: `#d1d5db` - Hover states

### Mid Grays
- **gray-400**: `#9ca3af` - Placeholders, icons
  - `text-gray-400` - Placeholder text, loading states
- **gray-500**: `#6b7280` - Secondary text, empty states
  - `text-gray-500` - Empty state messages
- **gray-600**: `#4b5563` - Body text, labels
  - `text-gray-600` - Regular content text
- **gray-700**: `#374151` - Headings, important text

### Dark Grays
- **gray-800**: `#1f2937` - Background accents
  - `bg-gray-800` - Social media icon backgrounds
- **gray-900**: `#111827` - Primary text, footer background
  - `text-gray-900` - Main headings, primary content
  - `bg-gray-900` - Footer background

## 3. Secondary/Accent Colors

### Green (Success Indicator)
- **Tailwind Classes**: `green-600`, `green-100`, `green-50`
- **Hex Values**:
  - `green-600`: `#16a34a`
  - `green-100`: `#dcfce7`
  - `green-50`: `#f0fdf4`
- **Usage**: Success states, completed payments, attendance present
- **Examples**:
  - `text-green-600` - Success icons, "Presente" status
  - `bg-green-100 text-green-800` - "Pagada" status badges
  - `bg-green-50 border-green-200` - Success alert backgrounds
  - `bg-green-600 hover:bg-green-700` - Confirm buttons

### Blue (Info Indicator)
- **Tailwind Classes**: `blue-800`, `blue-100`, `blue-50`
- **Hex Values**:
  - `blue-800`: `#1e40af`
  - `blue-100`: `#dbeafe`
  - `blue-50`: `#eff6ff`
- **Usage**: Informational messages, upcoming events
- **Examples**:
  - `bg-blue-100 text-blue-800` - "Próximo" event badges
  - `bg-blue-50 border-blue-200` - Info alert backgrounds
  - `text-blue-800` - Informational text

### Yellow (Warning Indicator)
- **Tailwind Classes**: `yellow-600`, `yellow-100`, `yellow-50`
- **Hex Values**:
  - `yellow-600`: `#ca8a04`
  - `yellow-100`: `#fef9c3`
  - `yellow-50`: `#fefce8`
- **Usage**: Pending states, warnings
- **Examples**:
  - `text-yellow-600` - Warning icons
  - `bg-yellow-100 text-yellow-800` - "Pendiente" status badges
  - `bg-yellow-50 border-yellow-200` - Pending payment backgrounds

### Purple (Special Status)
- **Tailwind Classes**: `purple-100`, `purple-800`
- **Hex Values**:
  - `purple-100`: `#f3e8ff`
  - `purple-800`: `#6b21a8`
- **Usage**: "En curso" (in progress) status
- **Examples**:
  - `bg-purple-100 text-purple-800` - "En curso" rehearsal badges

## 4. Gradients

### Primary Brand Gradient (Hero Sections)
```css
bg-gradient-to-br from-orange-600 to-red-600
```
- **Direction**: Bottom-right diagonal
- **Start Color**: `#CD201E` (orange-600 class displays red color)
- **End Color**: `#F69220` (red-600 class displays orange color)
- **Usage**: Mission page hero, prominent sections
- **Example**: Mision page hero section

### Light Brand Gradient (Accent Sections)
```css
bg-gradient-to-br from-red-50 to-orange-50
```
- **Direction**: Bottom-right diagonal
- **Start Color**: `#fef2f2` (red-50)
- **End Color**: `#fff7ed` (orange-50)
- **Usage**: Vision section, subtle background accents
- **Example**: Mision page vision section

## 5. CSS Custom Properties (Theme Variables)

### Light Theme (Default)
```css
:root {
  --background: #ffffff;
  --foreground: oklch(0.145 0 0);
  --primary: #030213;
  --primary-foreground: oklch(1 0 0);
  --secondary: oklch(0.95 0.0058 264.53);
  --secondary-foreground: #030213;
  --muted: #ececf0;
  --muted-foreground: #717182;
  --accent: #e9ebef;
  --accent-foreground: #030213;
  --brand-orange: #F69220;
  --brand-red: #CD201E;
  --destructive: #CD201E;
  --destructive-foreground: #ffffff;
  --border: rgba(0, 0, 0, 0.1);
  --input-background: #f3f3f5;
  --switch-background: #cbced4;
}
```

### Dark Theme
```css
.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  --primary: oklch(0.985 0 0);
  --primary-foreground: oklch(0.205 0 0);
  --secondary: oklch(0.269 0 0);
  --secondary-foreground: oklch(0.985 0 0);
  --muted: oklch(0.269 0 0);
  --muted-foreground: oklch(0.708 0 0);
  --accent: oklch(0.269 0 0);
  --accent-foreground: oklch(0.985 0 0);
  --destructive: oklch(0.396 0.141 25.723);
  --destructive-foreground: oklch(0.637 0.237 25.331);
  --border: oklch(0.269 0 0);
  --input: oklch(0.269 0 0);
  --ring: oklch(0.439 0 0);
}
```

### Chart Colors (Data Visualization)
```css
/* Light Theme */
--chart-1: oklch(0.646 0.222 41.116);
--chart-2: oklch(0.6 0.118 184.704);
--chart-3: oklch(0.398 0.07 227.392);
--chart-4: oklch(0.828 0.189 84.429);
--chart-5: oklch(0.769 0.188 70.08);

/* Dark Theme */
--chart-1: oklch(0.488 0.243 264.376);
--chart-2: oklch(0.696 0.17 162.48);
--chart-3: oklch(0.769 0.188 70.08);
--chart-4: oklch(0.627 0.265 303.9);
--chart-5: oklch(0.645 0.246 16.439);
```

### Sidebar Colors
```css
/* Light Theme */
--sidebar: oklch(0.985 0 0);
--sidebar-foreground: oklch(0.145 0 0);
--sidebar-primary: #030213;
--sidebar-primary-foreground: oklch(0.985 0 0);
--sidebar-accent: oklch(0.97 0 0);
--sidebar-accent-foreground: oklch(0.205 0 0);
--sidebar-border: oklch(0.922 0 0);
--sidebar-ring: oklch(0.708 0 0);

/* Dark Theme */
--sidebar: oklch(0.205 0 0);
--sidebar-foreground: oklch(0.985 0 0);
--sidebar-primary: oklch(0.488 0.243 264.376);
--sidebar-primary-foreground: oklch(0.985 0 0);
--sidebar-accent: oklch(0.269 0 0);
--sidebar-accent-foreground: oklch(0.985 0 0);
--sidebar-border: oklch(0.269 0 0);
--sidebar-ring: oklch(0.439 0 0);
```

## 6. Semantic Color Usage Patterns

### Status Indicators (Finanzas/Finance)
| Status | Background | Border | Icon Color | Badge |
|--------|-----------|--------|------------|-------|
| **Pagada (Paid)** | `bg-green-50` | `border-green-200` | `text-green-600` | `bg-green-100 text-green-800` |
| **Pendiente (Pending)** | `bg-yellow-50` | `border-yellow-200` | `text-yellow-600` | `bg-yellow-100 text-yellow-800` |
| **Vencida (Overdue)** | `bg-red-50` | `border-red-200` | `text-red-600` | `bg-red-100 text-red-800` |

### Event Status
| Status | Badge Class |
|--------|-------------|
| **Próximo (Upcoming)** | `bg-blue-100 text-blue-800` |
| **Pasado (Past)** | `bg-gray-100 text-gray-800` |
| **En Curso (In Progress)** | `bg-purple-100 text-purple-800` |
| **Completado (Completed)** | `bg-green-100 text-green-800` |

### Attendance Status
| Status | Icon | Color |
|--------|------|-------|
| **Presente (Present)** | CheckCircle | `text-green-600` |
| **Ausente (Absent)** | XCircle | `text-red-600` |

### Member Status
| Status | Badge Class |
|--------|-------------|
| **Activo (Active)** | `bg-green-100 text-green-800` |
| **Inactivo (Inactive)** | `bg-red-100 text-red-800` |

## 7. Interactive States

### Buttons
| Type | Default | Hover |
|------|---------|-------|
| **Primary** | `bg-red-600` | `hover:bg-red-700` |
| **Success** | `bg-green-600` | `hover:bg-green-700` |
| **Destructive** | Uses `--destructive` | Darker shade |

### Links & Hover
| Element | Class |
|---------|-------|
| **Footer links** | `hover:text-red-400` |
| **Social media icons** | `bg-gray-800 hover:bg-red-600` |
| **Text links** | `text-red-600 hover:text-red-700` |

### Borders
| Type | Class |
|------|-------|
| **Default** | `border-border` (CSS variable) |
| **Light** | `border-gray-200` |
| **Status-matched** | `border-green-200`, `border-red-200`, etc. |

## 8. Background Hierarchy

1. **Page Background**: `bg-gray-50` or `bg-white`
2. **Card/Section Background**: `bg-white` (on gray-50) or `bg-gray-50` (on white)
3. **Nested Elements**: `bg-gray-100` or color-specific backgrounds
4. **Interactive Elements**: `bg-red-100`, `bg-orange-100`, etc.

## 9. Color Accessibility

The design system maintains good contrast ratios:
- **Text on White**: Uses gray-900 (21:1), gray-700, gray-600
- **White on Red-600**: Meets WCAG AA standards
- **Status Colors**: All use appropriate background/text combinations for readability
- **OKLCH Color Space**: Used in CSS variables for perceptual uniformity and better color interpolation

## 10. Design System Summary

### Primary Palette (Most Common)
1. **Orange `#F69220`** (via `red-600` class) - Primary brand color (buttons, logo, interactive elements)
2. **Red `#CD201E`** (via `orange-600` class) - Secondary brand color (feature cards, icons, accents)
3. **Gray-900** (`#111827`) - Primary text and headings
4. **Gray-50** (`#f9fafb`) - Background color
5. **White** (`#ffffff`) - Card backgrounds, alternating sections

### Supporting Palette
6. **Green-600** (`#16a34a`) - Success states
7. **Yellow-600** (`#ca8a04`) - Warning states
8. **Blue-800** (`#1e40af`) - Informational states
9. **Gray-600** (`#4b5563`) - Body text
10. **Gray-400** (`#9ca3af`) - Placeholder text

### Usage Principles
- **Consistency**: Red/Orange used consistently for brand identity
- **Semantic Colors**: Green (success), Yellow (warning), Red (error/overdue), Blue (info)
- **Gradients**: Reserved for hero sections and prominent areas
- **Neutrals**: Gray scale provides visual hierarchy
- **Accessibility**: OKLCH color space used in CSS variables for perceptual uniformity

## 11. Quick Reference - Hex Color Codes

### Brand Colors
**Note**: Class names are swapped - `red-*` shows orange, `orange-*` shows red

| Tailwind Class | Visual Color | Hex Code | Brand Role |
|----------------|--------------|----------|------------|
| `red-600` | Orange | `#F69220` | Primary |
| `red-700` | Dark Orange | `#c7540b` | Primary Hover |
| `red-100` | Light Orange | `#ffecd9` | Primary Light |
| `red-50` | Pale Orange | `#fff8f1` | Primary Pale |
| `orange-600` | Red | `#CD201E` | Secondary |
| `orange-700` | Dark Red | `#991817` | Secondary Hover |
| `orange-100` | Light Red | `#fee2e2` | Secondary Light |
| `orange-50` | Pale Red | `#fef2f2` | Secondary Pale |
| `--destructive` | Red | `#CD201E` | Destructive |

### Neutral Colors
| Color | Hex Code |
|-------|----------|
| Gray-50 | `#f9fafb` |
| Gray-100 | `#f3f4f6` |
| Gray-200 | `#e5e7eb` |
| Gray-300 | `#d1d5db` |
| Gray-400 | `#9ca3af` |
| Gray-500 | `#6b7280` |
| Gray-600 | `#4b5563` |
| Gray-700 | `#374151` |
| Gray-800 | `#1f2937` |
| Gray-900 | `#111827` |

### Status Colors
| Color | Hex Code |
|-------|----------|
| Green-600 | `#16a34a` |
| Green-100 | `#dcfce7` |
| Green-50 | `#f0fdf4` |
| Yellow-600 | `#ca8a04` |
| Yellow-100 | `#fef9c3` |
| Yellow-50 | `#fefce8` |
| Blue-800 | `#1e40af` |
| Blue-100 | `#dbeafe` |
| Blue-50 | `#eff6ff` |
| Purple-800 | `#6b21a8` |
| Purple-100 | `#f3e8ff` |

---

**Last Updated**: March 2026
**Source**: Generated from analysis of `/Users/manuel/Projects/armentum/src/` codebase
**Files Analyzed**: theme.css, Navigation.tsx, Home.tsx, Finanzas.tsx, Mision.tsx, Footer.tsx, and admin components

This color palette creates a warm, welcoming identity for Armentum Choir while maintaining professional readability and clear visual hierarchy throughout the website.
