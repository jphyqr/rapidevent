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


Data Management UI
Original Requirements Analysis
1. "Allow the user to submit a form with Name, Email, and Age"
Solution Implemented:

Built a type-safe form using React Hook Form + Zod
Real-time validation with immediate feedback
Clean error handling with toast notifications
Form maintains state during validation errors

2. "Allow users to add/remove custom fields dynamically"
Solution Implemented:

Created a reusable NumberInput component for different field types
Implemented an extensible custom field system
Built with enterprise features in mind (showed disabled advanced field types)
Maintains field state even after submission for better UX

3. "Validate inputs (e.g., Email format, Age as positive number)"
Solution Implemented:

Zod schema validation for strong typing and runtime checks
Custom NumberInput component with min/max validation
Email format validation
Custom field type-specific validation

4. "View data of submissions in a table"
Solution Implemented:

Server-side pagination for handling large datasets
Debounced search functionality
Column sorting
Responsive table design using shadcn/ui
Optimistic updates for immediate feedback

5. "Edit previously submitted data"
Solution Implemented:

Inline edit functionality through modal
Optimistic updates for immediate feedback
Form reuse for consistency
Maintains data integrity during edits

6. "Visualize data as a chart"
Solution Implemented:

Recharts integration for performant data visualization
Real-time updates with data changes
Responsive design for all screen sizes

Key Technical Requirement: "Optimized for fast loading and handle large data entries"
Solutions Implemented:

Server-side pagination
Debounced search
Optimistic updates
Data caching
Efficient state management
Component-level code splitting

Performance Optimizations

Virtual rendering for large datasets
Debounced search to prevent unnecessary API calls
Optimistic updates for better perceived performance
Server-side sorting and filtering
Progressive loading with suspense boundaries

Type Safety & Data Integrity

Full TypeScript implementation
Zod schema validation
Proper error handling
Data consistency checks

User Experience Enhancements

Loading states
Toast notifications
Animation for new/updated records
Responsive design
Accessible components