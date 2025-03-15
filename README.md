# 📌 Project: To-Do App with Authentication

## Tech Stack:

- Frontend: Next.js (TypeScript) + React Query + Tailwind CSS + Zod (for form validation)
- Backend: Laravel + Sanctum (for authentication)
- Database: MySQL
- Deployment: Docker (for local development)
- Code Quality: Husky + Prettier + ESLint

## 📌 Phase 1: Project Setup

✅ Task 1: Initialize the repository

- Create a new branch `[dev name]`
- Set up a frontend/ folder (Next.js) and a backend/ folder (Laravel)
- Configure .gitignore for both frontend and backend

✅ Task 2: Set up Docker for local development

- Create a docker-compose.yml file to run MySQL, Laravel, and Next.js
-  Write Dockerfile for Laravel and Next.js

✅ Task 3: Set up Laravel backend

- Install Laravel (composer create-project laravel/laravel backend)
- Configure .env for MySQL database
- Install Laravel Sanctum for authentication

✅ Task 4: Set up Next.js frontend

- Create a Next.js project (npx create-next-app@latest frontend --typescript)
- Install dependencies:
```
npm install @tanstack/react-query axios react-hook-form zod next-auth @headlessui/react
```

- Configure .env.local for API base URL

✅ Task 5: Set up ESLint, Prettier, and Husky in Next.js
- Install ESLint and Prettier
- Install Husky and Configure Pre-Commit Hooks: `npm install -D husky lint-staged`
  - Enable Husky and Modify .husky/pre-commit to run linting and formatting.
  - Add Lint-Staged config in package.json

## 📌 Phase 2: User Authentication

✅ Task 6: Implement authentication (Backend - Laravel)

- Install and configure Laravel Sanctum
- Create authentication endpoints:
   - Register (`POST /api/auth/register`)
   - Login (`POST /api/auth/login`)
   - Logout (`POST /api/auth/logout`)
   - Fetch user (`GET /api/auth/me`)
- Protect routes using Sanctum middleware

✅ Task 7: Implement authentication (Frontend - Next.js)

- Create Login and Registration pages
- Use React Query + Axios to handle API calls
- Store the authentication token in cookies
- Redirect users based on authentication state

## 📌 Phase 3: To-Do CRUD Functionality

✅ Task 8: Create To-Do model and API (Backend - Laravel)

- Define ToDo model with fields:
   - id (Auto-increment)
   - title (String)
   - description (Text, optional)
   - is_completed (Boolean, default false)
   - user_id (Foreign key to users)
   - created_at & updated_at (Timestamps)
- Create To-Do API endpoints:
   - Create a task (`POST /api/todos`)
   - Get user’s tasks (`GET /api/todos`)
   - Update a task (`PUT /api/todos/:id`)
   - Delete a task (`DELETE /api/todos/:id`)
- Protect these routes with authentication

✅ Task 9: Implement To-Do functionality (Frontend - Next.js)

- Create ToDoList.tsx component to display tasks
- Create ToDoForm.tsx component for adding/editing tasks
- Use React Query for:
  - Fetching tasks (useQuery)
  - Creating tasks (useMutation)
  - Updating tasks (useMutation)
  - Deleting tasks (useMutation)
 
## 📌 Phase 4: UI Improvements & User Experience

✅ Task 10: Improve UI/UX with Tailwind CSS

- Style components using Tailwind CSS
- Add form validation using Zod + react-hook-form

✅ Task 11: Implement filtering and sorting

- Allow users to filter completed and pending tasks
- Enable sorting by created_at or updated_at

✅ Task 12: Implement authentication guards

- Protect dashboard and To-Do pages from unauthorized access
- Redirect users to login if they are not authenticated

## 📌 Phase 5: Testing & Deployment

✅ Task 14: Write unit tests

- Backend: Use PestPHP for Laravel testing
- Frontend: Use Jest + React Testing Library

✅ Task 15: Deploy locally using Docker

- Use docker-compose up to start MySQL, Laravel, and Next.js
- Ensure everything works correctly

✅ Task 16: Code review & documentation

- Conduct a team code review
- Write API documentation using Postman

## References
- [React Query](https://tanstack.com/query/latest)
- [NextJS](https://nextjs.org/)
- [Husky](https://typicode.github.io/husky/)
- [Lint-Staged](https://github.com/lint-staged/lint-staged)
- [Jest](https://jestjs.io/)
- [Laravel](https://laravel.com/docs/11.x)
- [PestPHP](https://pestphp.com/docs/installation)
- [Laravel Sanctum](https://laravel.com/docs/11.x/sanctum)
- [Docker](https://docs.docker.com/get-started/)
