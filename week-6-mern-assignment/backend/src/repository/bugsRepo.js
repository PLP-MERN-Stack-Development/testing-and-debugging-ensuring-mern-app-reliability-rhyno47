// In-memory repository (no external DB)
// NOTE: This is intentionally simple for testing/debugging exercises.

let _bugs = [];
let _idCounter = 1;

function _clone(x) { return JSON.parse(JSON.stringify(x)); }

async function create({ title, description = '' }) {
  const bug = {
    id: String(_idCounter++),
    title,
    description,
    status: 'open',
    createdAt: new Date().toISOString()
  };
  _bugs.unshift(bug);
  return _clone(bug);
}

async function findAll() {
  return _clone(_bugs);
}

async function updateById(id, update) {
  const idx = _bugs.findIndex(b => b.id === String(id));
  if (idx === -1) return null;
  _bugs[idx] = { ..._bugs[idx], ...update };
  return _clone(_bugs[idx]);
}

async function deleteById(id) {
  const idx = _bugs.findIndex(b => b.id === String(id));
  if (idx === -1) return false;
  _bugs.splice(idx, 1);
  return true;
}

// Helpers for tests
function __reset(data = []) { _bugs = _clone(data); _idCounter = data.length ? Math.max(...data.map(d => Number(d.id)||0)) + 1 : 1; }

module.exports = { create, findAll, updateById, deleteById, __reset };
