# Frontend Documentation

## Overview

The frontend of Naria is built with Next.js 13+ using the App Router, featuring a modern and responsive user interface for task management. The application implements client-side state management using Redux Toolkit for efficient data handling and seamless user experience.

## State Management with Redux

### Redux Setup

The application uses Redux Toolkit for state management, specifically for:

-   Managing user authentication state
-   Handling task data and operations
-   Maintaining UI states (loading, error messages, etc.)

### Store Configuration

The Redux store is configured in `src/lib/redux/store.ts` with the following key features:

-   Axios for API integration
-   Redux Persist for maintaining auth state across sessions
-   Redux Thunk for handling asynchronous actions

### Key Slices

1. **Auth Slice**

    - Manages user authentication state
    - Handles login/logout operations
    - Stores JWT token and user information

2. **Tasks Slice**
    - Manages task-related operations
    - Handles CRUD operations for tasks
    - Maintains task list and individual task states

## Setup Instructions

### Prerequisites

-   Node.js 18.0 or higher
-   npm or yarn package manager

### Installation

1. Clone the repository

```bash
git clone <repository-url>
cd naria-next
```

2. Install dependencies

```bash
npm install
# or
yarn install
```

3. Set up environment variables
   Create a `.env.local` file in the root directory with:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

4. Start the development server

```bash
npm run dev
# or
yarn dev
```

## Project Structure

```
src/
├── app/             # Next.js 13 App Router pages
├── components/      # Reusable UI components
├── lib/
│   └── redux/      # Redux setup and slices
├── types/          # TypeScript type definitions
└── utils/          # Utility functions
```

## Key Features

### Authentication

-   JWT-based authentication
-   Persistent login state
-   Protected routes

### Task Management

-   Create, read, update, and delete tasks
-   Task filtering and sorting
-   Real-time updates

### UI/UX

-   Responsive design
-   Loading states
-   Error handling
-   Form validation

## Design Decisions

### Next.js App Router

Chose Next.js App Router for:

-   Improved performance with React Server Components
-   Built-in API routes
-   Simplified routing and layouts

### Redux Toolkit

Selected Redux Toolkit for:

-   Simplified Redux setup with less boilerplate
-   Built-in immutable state updates
-   Integrated async thunks
-   RTK Query for efficient API calls

### TypeScript

Implemented TypeScript for:

-   Type safety
-   Better developer experience
-   Improved code maintainability

## Testing

The frontend includes:

-   Jest for unit testing
-   React Testing Library for component testing
-   Integration tests for Redux actions and reducers

Run tests with:

```bash
npm test
# or
yarn test
```

## Contributing

1. Create a feature branch
2. Make your changes
3. Submit a pull request

## Performance Considerations

-   Implemented code splitting
-   Optimized images and assets
-   Minimized bundle size
-   Efficient state updates
