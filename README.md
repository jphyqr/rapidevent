# Data Management UI

name: RapidEvents
target user: Community manager for ad hoc large event

Based on the requirement I figured a usage for an app like this would be a flexible event check in app.  The requirement for large datasets+fast loading and no requirements on 

Solution:
A responsive single-page application for managing and visualizing tabular and statistical data. 




## Running Locally

```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.





## Technical Implementation

### Core Requirements & Solutions

**Form Submission & Validation**
- Custom field system with enterprise feature previews
- Real-time validation with field-level error states
- Reusable NumberInput component handling currency, integers
- Email uniqueness validation

**Data Management & Performance**
- Server-side pagination and sorting
- Debounced search functionality
- Optimistic updates for immediate feedback
- Data revalidation patterns for real-time consistency

**Visualization**
- Age distribution analytics
- Submission timeline tracking
- Responsive charts with proper loading states

### Key Features

**Smart Form Fields**
- Extensible custom field system
- Enterprise feature previews (disabled but visible)
- Intelligent validation based on field type

**Optimized Data Grid**
- Server-side operations for large datasets
- Smooth loading states preserving table dimensions
- Intuitive sorting and filtering

**Edit Workflow**
- Compact inline editing
- Original field preservation
- Smart validation handling

### Technical Decisions

**Next.js 15**
- Server Components for heavy data operations
- Streaming for progressive loading
- Efficient component-level code splitting

**State Management**
- Server-side sorting/filtering for scalability
- Client-side state for immediate feedback
- Optimistic updates for better UX
- Application level state (useContext) for darkmode and newSubmission highlighting

**Data Visualization**
- Recharts for optimized chart rendering
- Server-aggregated data for performance
- Real-time updates through revalidation

### Performance Optimizations
- Debounced search
- Paginated data fetching
- Progressive loading
- Optimistic updates
- Component-level code splitting

### Architecture Highlights
- Form/Table/Chart component isolation
- Server/client responsibility separation
- TypeScript for type safety
- Reusable component patterns


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


## Future Improvements

- Enhanced analytics dashboard with more visualization options
- Batch operations for multiple records
- Export functionality for data
- Advanced filtering capabilities
- More extensive test coverage

## Technical Challenges Overcome

1. **Large Dataset Performance**
   - Implemented efficient pagination
   - Optimized state management
   - Smart loading strategies

2. **Complex Form Validation**
   - Real-time validation
   - Custom field handling
   - Type-safe form submissions

3. **Testing Complexity**
   - Server action mocking
   - Snapshot testing setup
   - Comprehensive coverage

## Testing Strategy

### Coverage and Approach
- Comprehensive test suite with >80% coverage across key metrics
- Integration tests for form submission and data handling
- Snapshot testing for UI stability and API contracts
- Jest and React Testing Library for reliable, user-centric tests

## Test Coverage

![Test Coverage Report](./coverage-report.png)
*Current test coverage showing >80% coverage across statements, branches, and lines*

### Key Test Areas
1. **Form Validation Tests**
   - Email format validation
   - Age boundary conditions
   - Custom field dynamics
   - Submission error states

2. **Data Management Tests**
   - CRUD operations
   - Pagination behavior
   - Search functionality
   - Data transformation

3. **UI Component Tests**
   - Responsive layout
   - Dynamic form fields
   - Error state displays
   - Loading indicators

To update snapshots when making intentional changes:

```bash
npm test -- -u
```
