import React, { useEffect, useState } from 'react';
import { fetchBugs, createBug, updateBugStatus, deleteBug } from '../services/bugsApi';

// Intentional subtle bug for debugging exercise: using 'statuz' instead of 'status' when displaying
// (Students should notice mismatch causing undefined UI column.)

export default function BugList() {
  const [bugs, setBugs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [title, setTitle] = useState('');

  async function load() {
    setLoading(true); setError('');
    try {
      const data = await fetchBugs();
      setBugs(data);
    } catch (e) {
      console.error('[BugList] fetch error', e);
      setError('Failed to load bugs');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleCreate(e) {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      const created = await createBug({ title });
      setBugs(prev => [created, ...prev]);
      setTitle('');
    } catch (e) {
      console.error('[BugList] create error', e);
      setError('Failed to create bug');
    }
  }

  async function handleStatus(id, status) {
    try {
      const updated = await updateBugStatus(id, status);
      setBugs(prev => prev.map(b => b.id === id ? updated : b));
    } catch (e) {
      console.error('[BugList] update error', e);
      setError('Failed to update bug');
    }
  }

  async function handleDelete(id) {
    try {
      await deleteBug(id);
      setBugs(prev => prev.filter(b => b.id !== id));
    } catch (e) {
      console.error('[BugList] delete error', e);
      setError('Failed to delete bug');
    }
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p role="alert">{error}</p>;
  if (!bugs.length) return (
    <div>
      <form onSubmit={handleCreate}>
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Bug title" />
        <button type="submit">Add Bug</button>
      </form>
      <p>No bugs yet</p>
    </div>
  );

  return (
    <div>
      <form onSubmit={handleCreate}>
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Bug title" />
        <button type="submit">Add Bug</button>
      </form>
      <table>
        <thead>
          <tr><th>Title</th><th>Status</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {bugs.map(b => (
            <tr key={b.id}>
              <td>{b.title}</td>
              <td>{b.statuz || b.status}</td>
              <td>
                <button onClick={() => handleStatus(b.id, 'in-progress')}>In-Progress</button>
                <button onClick={() => handleStatus(b.id, 'resolved')}>Resolve</button>
                <button onClick={() => handleDelete(b.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
