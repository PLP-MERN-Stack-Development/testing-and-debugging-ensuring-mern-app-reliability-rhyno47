const BASE = '/api/bugs';

export async function fetchBugs() {
  const res = await fetch(BASE);
  if (!res.ok) throw new Error('Fetch failed');
  return res.json();
}

export async function createBug({ title, description = '' }) {
  const res = await fetch(BASE, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title, description }) });
  if (!res.ok) throw new Error('Create failed');
  return res.json();
}

export async function updateBugStatus(id, status) {
  const res = await fetch(`${BASE}/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) });
  if (!res.ok) throw new Error('Update failed');
  return res.json();
}

export async function deleteBug(id) {
  const res = await fetch(`${BASE}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Delete failed');
  return res.json();
}
