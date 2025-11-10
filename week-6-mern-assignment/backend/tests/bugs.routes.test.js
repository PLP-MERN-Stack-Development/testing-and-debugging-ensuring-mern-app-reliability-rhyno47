const request = require('supertest');
const app = require('../src/app');

// Mock repository for create/list/update/delete
jest.mock('../src/repository/bugsRepo', () => {
  let data = [];
  let idCounter = 1;
  return {
    create: jest.fn(async ({ title, description }) => {
      const bug = { id: String(idCounter++), title, description: description || '', status: 'open', createdAt: new Date().toISOString() };
      data.push(bug); return bug;
    }),
    findAll: jest.fn(async () => data),
    updateById: jest.fn(async (id, update) => {
      const idx = data.findIndex(b => b.id === id);
      if (idx === -1) return null;
      data[idx] = { ...data[idx], ...update }; return data[idx];
    }),
    deleteById: jest.fn(async (id) => {
      const idx = data.findIndex(b => b.id === id);
      if (idx === -1) return false;
      data.splice(idx, 1); return true;
    }),
  };
});

const repo = require('../src/repository/bugsRepo');

describe('Bugs API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('POST /api/bugs creates a bug', async () => {
    const payload = { title: 'New bug', description: 'Details' };
    const res = await request(app).post('/api/bugs').send(payload).expect(201);
    expect(res.body.title).toBe(payload.title);
    expect(repo.create).toHaveBeenCalled();
  });

  test('GET /api/bugs returns list', async () => {
    await request(app).post('/api/bugs').send({ title: 'Bug A' });
    const res = await request(app).get('/api/bugs').expect(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(repo.findAll).toHaveBeenCalled();
  });

  test('PATCH /api/bugs/:id updates status', async () => {
    const createRes = await request(app).post('/api/bugs').send({ title: 'Bug B' });
    const id = createRes.body.id;
    const res = await request(app).patch(`/api/bugs/${id}`).send({ status: 'resolved' }).expect(200);
    expect(res.body.status).toBe('resolved');
    expect(repo.updateById).toHaveBeenCalledWith(id, { status: 'resolved' });
  });

  test('DELETE /api/bugs/:id deletes bug', async () => {
    const createRes = await request(app).post('/api/bugs').send({ title: 'Bug C' });
    const id = createRes.body.id;
    const res = await request(app).delete(`/api/bugs/${id}`).expect(200);
    expect(res.body.success).toBe(true);
    expect(repo.deleteById).toHaveBeenCalledWith(id);
  });

  test('PATCH /api/bugs/:id returns 404 if not found', async () => {
    const res = await request(app).patch('/api/bugs/999').send({ status: 'open' }).expect(404);
    expect(res.body.message).toBe('Bug not found');
  });
});
