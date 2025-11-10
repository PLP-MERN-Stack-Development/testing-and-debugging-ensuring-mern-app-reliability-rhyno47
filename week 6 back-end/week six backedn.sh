#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="week-6-mern-assignment"
BACKEND_DIR="$ROOT_DIR/backend"

mkdir -p "$BACKEND_DIR/src/models"
mkdir -p "$BACKEND_DIR/src/controllers"
mkdir -p "$BACKEND_DIR/src/routes"
mkdir -p "$BACKEND_DIR/src/utils"
mkdir -p "$BACKEND_DIR/src/middleware"
mkdir -p "$BACKEND_DIR/tests"

cat > "$ROOT_DIR/.gitignore" <<'EOF'
node_modules
npm-debug.log
.env
EOF

cat > "$ROOT_DIR/README.md" <<'EOF'
# Week 6 MERN Assignment - Backend

This folder contains the backend portion of the Week 6 MERN assignment (Bug Tracker). It is an Express-based API with tests and debugging-friendly setup. The code does not require a live MongoDB connection to start; database calls will error without a MONGO_URI, but tests mock the model methods.

Quick start:
1. cd week-6-mern-assignment/backend
2. npm install
3. npm test
4. npm run dev (starts server without DB if MONGO_URI not set)
EOF

cat > "$BACKEND_DIR/package.json" <<'EOF'
{
  "name": "week6-mern-bugtracker-backend",
  "version": "1.0.0",
  "main": "src/index.js",
  "scripts": {
    "start": "node src/index.js",
    "dev": "nodemon src/index.js",
    "test": "jest --runInBand",
    "debug": "node --inspect-brk src/index.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^7.3.0"
  },
  "devDependencies": {
    "jest": "^29.6.0",
    "supertest": "^6.3.3",
    "nodemon": "^3.0.1"
  }
}
EOF

cat > "$BACKEND_DIR/src/index.js" <<'EOF'
const app = require('./app');
const mongoose = require('mongoose');

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || '';

if (MONGO_URI) {
  mongoose.connect(MONGO_URI)
    .then(() => {
      console.log('Connected to MongoDB');
      app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
    })
    .catch(err => {
      console.error('Mongo connection error:', err);
      process.exit(1);
    });
} else {
  // Start server without DB for local testing/demo (DB ops will error)
  app.listen(PORT, () => console.log(`Server (no DB) listening on ${PORT}`));
}
EOF

cat > "$BACKEND_DIR/src/app.js" <<'EOF'
const express = require('express');
const bugsRouter = require('./routes/bugs');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(express.json());

app.use('/api/bugs', bugsRouter);

// Health
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Error middleware last
app.use(errorHandler);

module.exports = app;
EOF

cat > "$BACKEND_DIR/src/models/bug.js" <<'EOF'
const mongoose = require('mongoose');

const BugSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  status: { type: String, enum: ['open', 'in-progress', 'resolved'], default: 'open' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Bug', BugSchema);
EOF

cat > "$BACKEND_DIR/src/utils/validation.js" <<'EOF'
function validateBugPayload({ title, description }) {
  const errors = [];
  if (!title || typeof title !== 'string' || title.trim().length < 3) {
    errors.push('Title must be at least 3 characters long');
  }
  if (description && description.length > 1000) {
    errors.push('Description is too long');
  }
  return {
    valid: errors.length === 0,
    errors
  };
}

module.exports = { validateBugPayload };
EOF

cat > "$BACKEND_DIR/src/controllers/bugsController.js" <<'EOF'
const Bug = require('../models/bug');
const { validateBugPayload } = require('../utils/validation');

async function createBug(req, res, next) {
  try {
    const { title, description } = req.body;
    const { valid, errors } = validateBugPayload({ title, description });
    if (!valid) return res.status(400).json({ errors });

    const created = await Bug.create({ title, description });
    return res.status(201).json(created);
  } catch (err) {
    next(err);
  }
}

async function getBugs(req, res, next) {
  try {
    const bugs = await Bug.find().sort({ createdAt: -1 });
    res.json(bugs);
  } catch (err) {
    next(err);
  }
}

async function updateBug(req, res, next) {
  try {
    const { id } = req.params;
    const update = {};
    if (req.body.title) update.title = req.body.title;
    if (req.body.description) update.description = req.body.description;
    // NOTE: property name is 'status'
    if (req.body.status) update.status = req.body.status;

    const updated = await Bug.findByIdAndUpdate(id, update, { new: true });
    if (!updated) return res.status(404).json({ message: 'Bug not found' });
    res.json(updated);
  } catch (err) {
    next(err);
  }
}

async function deleteBug(req, res, next) {
  try {
    const { id } = req.params;
    const deleted = await Bug.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'Bug not found' });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

module.exports = { createBug, getBugs, updateBug, deleteBug };
EOF

cat > "$BACKEND_DIR/src/routes/bugs.js" <<'EOF'
const express = require('express');
const router = express.Router();
const { createBug, getBugs, updateBug, deleteBug } = require('../controllers/bugsController');

router.post('/', createBug);
router.get('/', getBugs);
router.patch('/:id', updateBug);
router.delete('/:id', deleteBug);

module.exports = router;
EOF

cat > "$BACKEND_DIR/src/middleware/errorHandler.js" <<'EOF'
function errorHandler(err, req, res, next) {
  console.error('Server error:', err && err.stack ? err.stack : err);
  const status = err.status || 500;
  const payload = {
    message: err.message || 'Internal Server Error'
  };
  if (process.env.NODE_ENV === 'development') {
    payload.stack = err.stack;
  }
  res.status(status).json(payload);
}

module.exports = errorHandler;
EOF

cat > "$BACKEND_DIR/tests/validation.test.js" <<'EOF'
const { validateBugPayload } = require('../src/utils/validation');

describe('validateBugPayload', () => {
  test('valid payload returns valid true', () => {
    const { valid, errors } = validateBugPayload({ title: 'Fix login', description: 'Error on line 34' });
    expect(valid).toBe(true);
    expect(errors.length).toBe(0);
  });

  test('short title returns error', () => {
    const { valid, errors } = validateBugPayload({ title: 'hi', description: '' });
    expect(valid).toBe(false);
    expect(errors).toContain('Title must be at least 3 characters long');
  });

  test('long description returns error', () => {
    const longDesc = 'a'.repeat(2000);
    const { valid, errors } = validateBugPayload({ title: 'Good title', description: longDesc });
    expect(valid).toBe(false);
    expect(errors).toContain('Description is too long');
  });
});
EOF

cat > "$BACKEND_DIR/tests/bugs.routes.test.js" <<'EOF'
/**
 * Integration tests for API routes using Supertest.
 * Database calls are mocked to keep tests fast and deterministic.
 */

const request = require('supertest');
const app = require('../src/app');

// Mock the Bug model entirely
jest.mock('../src/models/bug', () => {
  return {
    create: jest.fn(),
    find: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn()
  };
});

const Bug = require('../src/models/bug');

describe('Bugs API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('POST /api/bugs - creates a bug', async () => {
    const payload = { title: 'New bug', description: 'Details' };
    const created = { _id: '1', ...payload, status: 'open' };
    Bug.create.mockResolvedValue(created);

    const res = await request(app).post('/api/bugs').send(payload).expect(201);
    expect(res.body).toEqual(created);
    expect(Bug.create).toHaveBeenCalledWith(payload);
  });

  test('GET /api/bugs - returns list', async () => {
    const list = [{ _id: '1', title: 'a' }];
    Bug.find.mockReturnValue({
      sort: () => Promise.resolve(list)
    });

    const res = await request(app).get('/api/bugs').expect(200);
    expect(res.body).toEqual(list);
    expect(Bug.find).toHaveBeenCalled();
  });

  test('PATCH /api/bugs/:id - updates bug (not found)', async () => {
    Bug.findByIdAndUpdate.mockResolvedValue(null);
    const res = await request(app).patch('/api/bugs/123').send({ status: 'resolved' }).expect(404);
    expect(res.body.message).toBe('Bug not found');
  });

  test('DELETE /api/bugs/:id - deletes bug', async () => {
    Bug.findByIdAndDelete.mockResolvedValue({ _id: '123' });
    const res = await request(app).delete('/api/bugs/123').expect(200);
    expect(res.body.success).toBe(true);
    expect(Bug.findByIdAndDelete).toHaveBeenCalledWith('123');
  });
});
EOF

echo "Created files under $BACKEND_DIR"
echo "Next: cd into your repo root and run:"
echo "  chmod +x create_week6_backend.sh"
echo "  ./create_week6_backend.sh"