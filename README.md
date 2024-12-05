# Data Management UI

A responsive single-page application for managing and visualizing tabular data.

## Running Locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Technical Decisions

### Framework: Next.js 15
- Offers automatic code splitting and optimization for fast initial load times
- Ensures consistent performance even with large datasets through efficient component rendering
- Provides robust TypeScript support out of the box for type safety and better developer experience

### Component Library: shadcn/ui
- Offers highly accessible, customizable components based on Radix UI primitives
- Provides a consistent design system while maintaining full styling control
- Zero runtime bundle size impact as components are copied into the project

### Form Management: React Hook Form + Zod
- React Hook Form provides performant form handling with minimal re-renders
- Zod enables robust TypeScript-first schema validation
- Combined approach ensures type safety from form submission through data management

### Data Visualization: Recharts
- React-centric charting library with efficient rendering
- Smooth updates for real-time data changes
- Responsive design support built-in

## Project Structure

```
app/
  page.tsx                      # Main SPA page
  _components/                  # Route-level components
    data-form/                 # Form submission components
    data-table/               # Table visualization components
    data-chart/              # Chart visualization components
  lib/                        # Utilities and configurations
    validations.ts           # Zod schemas
    types.ts                # TypeScript type definitions
```

This structure:
- Co-locates components with their routes for better maintainability
- Isolates feature-specific components in _components directory
- Keeps shared utilities and types centralized