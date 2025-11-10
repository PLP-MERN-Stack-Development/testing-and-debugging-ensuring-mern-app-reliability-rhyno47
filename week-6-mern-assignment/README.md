# Week 6 MERN Assignment - Backend & Tests

This folder hosts the backend implementation (in-memory, no external DB) and tests.

## Quick start

```bash
cd week-6-mern-assignment/backend
npm install
npm test
npm run dev # optional, requires nodemon
```

## API

- POST /api/bugs { title, description? }
- GET /api/bugs
- PATCH /api/bugs/:id { status? , title?, description? }
- DELETE /api/bugs/:id

## Notes

- Repository: `src/repository/bugsRepo.js` stores data in-memory.
- Error handling: `src/middleware/errorHandler.js`.
- Validation: `src/utils/validation.js`.
- Tests: `tests/validation.test.js`, `tests/bugs.routes.test.js`.
