# Life Hub Frontend Design Guidelines

## Overview
This document outlines the design principles, component structure, and styling guidelines for the Life Hub frontend application.

## Design Philosophy
- **Component-First Architecture**: Build reusable, composable components
- **Global Component Usage**: Prefer existing global components over creating new ones
- **CSS Custom Properties**: Use CSS variables for theming and consistency
- **Dark/Light Mode**: All components must support both themes
- **Responsive Design**: Mobile-first approach with breakpoints
- **Accessibility**: WCAG 2.1 AA compliance

## Color System

### CSS Custom Properties
All colors are defined as CSS custom properties in `globals.css`:

#### Light Mode (`:root`)
```css
--primary-500: #667eea;        /* Primary brand color */
--secondary-500: #764ba2;      /* Secondary accent */
--gray-50: #f9fafb;            /* Lightest gray */
--gray-900: #111827;           /* Darkest gray */
--success: #10b981;            /* Success states */
--error: #dc2626;              /* Error states */
--warning: #f59e0b;            /* Warning states */
```

#### Dark Mode (`.dark`)
```css
--primary-500: #7f9cf5;        /* Lighter for contrast */
--secondary-500: #a78bfa;      /* Lighter purple */
--gray-50: #0a0a0a;            /* Near black */
--gray-900: #ffffff;           /* White */
--error: #ef4444;              /* Brighter red */
```

### Usage Patterns
```jsx
// ✅ Correct - Use CSS variables
<div className="bg-[var(--primary-500)] text-[var(--text-primary)]">

// ❌ Incorrect - Hardcoded colors
<div className="bg-[#667eea] text-[#1f2937]">
```

## Typography

### Font Scale
```css
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */
--text-4xl: 2.25rem;   /* 36px */
--text-5xl: 3rem;      /* 48px */
```

### Font Families
```css
--font-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
--font-mono: 'Courier New', monospace;
```

### Usage Patterns
```jsx
// Headings
<h1 className="text-[var(--text-3xl)] font-bold text-[var(--text-primary)]">
<h2 className="text-[var(--text-2xl)] font-semibold text-[var(--text-primary)]">

// Body text
<p className="text-[var(--text-base)] text-[var(--text-secondary)]">
<small className="text-[var(--text-sm)] text-[var(--text-tertiary)]">
```

## Spacing System

### Scale
```css
--spacing-unit-1: 0.25rem;   /* 4px */
--spacing-unit-2: 0.5rem;    /* 8px */
--spacing-unit-3: 0.75rem;   /* 12px */
--spacing-unit-4: 1rem;      /* 16px */
--spacing-unit-5: 1.25rem;   /* 20px */
--spacing-unit-6: 1.5rem;    /* 24px */
--spacing-unit-8: 2rem;      /* 32px */
--spacing-unit-10: 2.5rem;   /* 40px */
--spacing-unit-12: 3rem;     /* 48px */
--spacing-unit-16: 4rem;     /* 64px */
--spacing-unit-20: 5rem;     /* 80px */
```

### Usage Patterns
```jsx
// Margins
<div className="m-[var(--spacing-4)]">           // margin: 1rem
<div className="mx-[var(--spacing-6)]">         // margin-x: 1.5rem
<div className="my-[var(--spacing-8)]">         // margin-y: 2rem

// Padding
<div className="p-[var(--spacing-4)]">           // padding: 1rem
<div className="px-[var(--spacing-6)]">         // padding-x: 1.5rem
<div className="py-[var(--spacing-8)]">         // padding-y: 2rem
```

## Border Radius

### Scale
```css
--radius-sm: calc(var(--radius) - 4px);    // Small
--radius-md: calc(var(--radius) - 2px);    // Medium
--radius-lg: var(--radius);                 // Large (default)
--radius-xl: calc(var(--radius) + 4px);     // Extra large
--radius-2xl: calc(var(--radius) + 8px);   // 2x large
--radius-3xl: calc(var(--radius) + 12px);  // 3x large
--radius-4xl: calc(var(--radius) + 16px);  // 4x large
```

### Usage Patterns
```jsx
// Border radius
<div className="rounded-[var(--radius-lg)]">        // Default
<div className="rounded-[var(--radius-xl)]">        // Extra large
<div className="rounded-full">                        // Circle
```

## Shadows

### Scale
```css
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
--shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
```

### Usage Patterns
```jsx
// Shadows
<div className="shadow-[var(--shadow-md)]">   // Medium shadow
<div className="shadow-[var(--shadow-lg)]">   // Large shadow
```

## Component Structure

### Global Components (`src/components/common/`)
**Always check here first before creating new components:**

#### Available Components
- **Buttons**: `components/common/buttons/`
- **Forms**: `components/common/forms/`
- **Table**: `components/common/table/`
- **ConfirmDialog**: `components/common/ConfirmDialog.jsx`
- **ErrorState**: `components/common/ErrorState.jsx`
- **FilterModal**: `components/common/FilterModal.jsx`
- **ImageUpload**: `components/common/ImageUpload.jsx`
- **Loader**: `components/common/Loader.jsx`
- **NotFoundState**: `components/common/NotFoundState.jsx`
- **ProfileImageUpload**: `components/common/ProfileImageUpload.jsx`
- **ThemeToggle**: `components/common/ThemeToggle.jsx`

#### Component Usage Pattern
```jsx
// ✅ Correct - Use existing global component
import { Button } from "@/components/common/buttons/Button";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";

// ❌ Incorrect - Create duplicate component
import { MyButton } from "@/components/myButton";
```

### Specialized Components
Only create new components in feature-specific folders when:
1. Global component doesn't exist
2. Feature requires unique, non-reusable UI
3. Component is highly specialized to a specific domain

**Preferred locations:**
- `src/components/dashboard/` - Dashboard-specific components
- `src/components/portfolio/` - Portfolio-specific components
- `src/components/travelspots/` - Travel spots components

## Styling Guidelines

### CSS Modules vs Global CSS
**Use CSS Modules for:**
- Component-specific styles
- Complex layouts
- Feature-specific styling

**Use Global CSS for:**
- Utility classes
- Theme-related styles
- Base styles

### File Organization
```
src/styles/
├── application/          # Application-specific styles
├── auth/                 # Authentication pages
├── common/               # Common styles
├── dashboard/            # Dashboard styles
├── layout/               # Layout styles
├── pages/                # Page-specific styles
├── portfolio/            # Portfolio styles
└── travelspots/          # Travel spots styles
```

### CSS Module Pattern
```css
/* Example: src/styles/dashboard/UserManagement.module.css */
.container {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-unit-4);
  padding: var(--spacing-unit-6);
  background-color: var(--card);
  border-radius: var(--radius-lg);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-unit-6);
}

.tableContainer {
  overflow-x: auto;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
}
```

## Dark Mode Implementation

### Automatic Support
All components using CSS custom properties automatically support dark mode.

### Manual Dark Mode (if needed)
```jsx
// ✅ Correct - CSS variables handle dark mode automatically
<div className="bg-[var(--card)] text-[var(--card-foreground)]">

// ❌ Incorrect - Manual dark mode classes
<div className="bg-white dark:bg-black text-gray-800 dark:text-white">
```

### Dark Mode Toggle
Use the existing `ThemeToggle` component:
```jsx
import { ThemeToggle } from "@/components/common/ThemeToggle";

<ThemeToggle />
```

## Responsive Design

### Breakpoints
```jsx
// Mobile-first approach
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
```

### Common Patterns
```jsx
// Responsive spacing
<div className="p-[var(--spacing-4)] md:p-[var(--spacing-6)] lg:p-[var(--spacing-8)]">

// Responsive typography
<h1 className="text-[var(--text-2xl)] md:text-[var(--text-3xl)] lg:text-[var(--text-4xl)]">

// Responsive grid
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
```

## Form Guidelines

### Form Components
Use global form components from `components/common/forms/`:
- Input fields
- Select dropdowns
- Textareas
- Checkboxes
- Radio buttons
- File uploads

### Form Validation
```jsx
// Use react-hook-form with zod validation
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(schema),
});
```

## API Integration

### Redux Toolkit Query
Use RTK Query for API calls:
```jsx
import { useUserListQuery, useUserEditMutation } from "@/services/api/userApi";

function UserManagement() {
  const { data, isLoading, error } = useUserListQuery();
  const [editUser, { isLoading: isEditing }] = useUserEditMutation();
}
```

### Error Handling
```jsx
// Use global ErrorState component
import { ErrorState } from "@/components/common/ErrorState";

if (error) {
  return <ErrorState message="Failed to load users" onRetry={refetch} />;
}
```

## Loading States

### Global Loader
```jsx
import { Loader } from "@/components/common/Loader";

<Loader />
```

### Skeleton Loading
```jsx
// For complex UI, use skeleton loaders
<div className="animate-pulse bg-[var(--gray-200)] h-4 w-full rounded" />
```

## Accessibility

### ARIA Labels
```jsx
<button aria-label="Close modal">✕</button>
<input aria-label="Email address" />
```

### Keyboard Navigation
```jsx
// Ensure all interactive elements are keyboard accessible
<button
  onClick={handleClick}
  onKeyDown={(e) => e.key === 'Enter' && handleClick()}
>
  Click me
</button>
```

### Focus Management
```jsx
// Manage focus for modals and dynamic content
useEffect(() => {
  if (isOpen) {
    modalRef.current?.focus();
  }
}, [isOpen]);
```

## Performance Guidelines

### Code Splitting
```jsx
// Lazy load heavy components
const HeavyComponent = lazy(() => import('./HeavyComponent'));

<Suspense fallback={<Loader />}>
  <HeavyComponent />
</Suspense>
```

### Image Optimization
```jsx
// Use Next.js Image component
import Image from 'next/image';

<Image
  src="/path/to/image.jpg"
  alt="Description"
  width={500}
  height={300}
  priority
/>
```

## Testing Guidelines

### Component Testing
```jsx
// Test components in isolation
import { render, screen } from '@testing-library/react';
import { UserManagement } from './UserManagement';

test('renders user list', () => {
  render(<UserManagement />);
  expect(screen.getByText('Users')).toBeInTheDocument();
});
```

## Best Practices Summary

### ✅ DO
- Use CSS custom properties for all styling
- Leverage existing global components
- Implement dark mode automatically via CSS variables
- Use CSS Modules for component-specific styles
- Follow mobile-first responsive design
- Ensure accessibility compliance
- Use TypeScript for type safety
- Implement proper error handling
- Use loading states for async operations

### ❌ DON'T
- Hardcode colors or values
- Create duplicate global components
- Use manual dark mode classes
- Mix CSS Modules with inline styles unnecessarily
- Ignore mobile responsiveness
- Skip accessibility features
- Use any types
- Ignore error states
- Show unhandled loading states

## Resources

### Component Library
- Global components: `src/components/common/`
- Dashboard components: `src/components/dashboard/`
- Portfolio components: `src/components/portfolio/`

### Styles
- Global CSS: `src/app/globals.css`
- Component styles: `src/styles/`
- Module styles: `[ComponentName].module.css`

### Documentation
- Component documentation in component files
- API documentation in service files
- This design document for guidelines

## Updating This Document
When adding new components or patterns:
1. Update this document with usage examples
2. Document any new CSS custom properties
3. Add component to appropriate section
4. Include accessibility considerations
5. Note any breaking changes