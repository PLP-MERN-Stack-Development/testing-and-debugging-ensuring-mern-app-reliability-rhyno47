# Week 6: Bug Tracker Testing & Debugging Implementation

This repository contains an implementation to the Week 6 assignment: comprehensive testing & debugging for a MERN-style app, focused on a Bug Tracker. It intentionally avoids any real MongoDB connection (strictly in-memory data) per requirement.

## Assignment Overview (Implemented)

1. Backend Express API (in-memory) providing CRUD for bugs: create, list, update status, delete.
2. Backend unit tests for validation logic; integration tests for routes using Jest + Supertest with repository mocking.
3. Frontend React components (`BugList`, `Button`, `ErrorBoundary`) plus unit & integration tests covering empty state, creation, status update, deletion, error boundary.
4. Debugging aids: console logs, intentional typo bug (`statuz` field), ErrorBoundary, Node inspector guidance.
5. Central Jest config with multi-project coverage thresholds (≥70% statements/lines/functions; 60% branches).
6. Documentation of testing & debugging approach below.

## Project Structure (Relevant Parts)

```
client/
  src/
    components/ (Button, BugList, ErrorBoundary)
    services/ (bugsApi.js)
    tests/
      unit/ (Button.test.jsx, ErrorBoundary.test.jsx)
      integration/ (BugList.integration.test.jsx)
week-6-mern-assignment/
  backend/
    src/ (app, routes, controllers, repository, middleware, utils)
    tests/ (validation.test.js, bugs.routes.test.js)
jest.config.js
.babelrc
README.md
```

## Getting Started

Install dependencies (root + backend):
```bash
npm install
cd week-6-mern-assignment/backend && npm install && cd ../../..
```

Run all tests:
```bash
npm test
```
Run only backend tests:
```bash
npx jest --selectProjects backend
```
Run only client tests:
```bash
npx jest --selectProjects client
```

Run backend server:
```bash
node week-6-mern-assignment/backend/src/index.js
```
Or with auto-reload (after installing dev deps):
```bash
npm --prefix week-6-mern-assignment/backend run dev
```

## Requirements

- Node.js v18+
- npm
- NO MongoDB needed (in-memory repository).

## Testing Tools & Strategy

- Jest: Test runner & assertions
- Supertest: HTTP route integration
- React Testing Library: Component rendering & user interaction
- identity-obj-proxy: CSS module stubbing
- Manual jest mocks: Replace repository for deterministic route tests

Approach highlights:
* Unit: Pure validation function constraints & error conditions.
* Integration (backend): Route + controller + error handling with repo mock to isolate HTTP layer.
* Integration (frontend): Simulated fetch interactions (mocked global `fetch`) covering lifecycle + CRUD flows.
* ErrorBoundary test ensures graceful UI failure handling.

## Debugging & Intentional Bugs

- Intentional bug: `BugList.jsx` uses `b.statuz || b.status` to surface mismatch for inspection.
- Console logs: Startup debug, controller errors, fetch operation traces.
- Node Inspector:
  ```bash
  node --inspect-brk week-6-mern-assignment/backend/src/index.js
  # Open chrome://inspect
  ```
- React Error Boundary: Captures render exceptions.
* Suggested exercise: Trigger error by temporarily throwing in a component and observing boundary.

## Error Handling

- Backend: Central Express error middleware (`errorHandler.js`) includes stack in development.
- Frontend: ErrorBoundary fallback UI with `role="alert"` for accessibility.

## Coverage

Run tests and view coverage summary in console. For HTML report, open:
```
coverage/backend/index.html
coverage/client/index.html
```
(after first run)

## Submission Checklist

1. Ensure tests pass: `npm test`.
2. Review coverage meets thresholds.
3. Commit & push:
   ```bash
   git add .
   git commit -m "Week6 bug tracker testing & debugging"
   git push origin main
   ```
4. (Optional) Add screenshots of coverage reports to repository.
5. Document any extended debugging (append here or separate DOCS.md).

## Future Enhancements (Optional)

- Add E2E tests (Playwright or Cypress) for full user flows.
- Introduce performance profiling (Node --prof, React Profiler).
- Add accessibility tests (axe). 
- Replace intentional bug after exercise completion.

## Resources

- [Jest](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Supertest](https://github.com/visionmedia/supertest)
- [Playwright](https://playwright.dev/) / [Cypress](https://docs.cypress.io/)
