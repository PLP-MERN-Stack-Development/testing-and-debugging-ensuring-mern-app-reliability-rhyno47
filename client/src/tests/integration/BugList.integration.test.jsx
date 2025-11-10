import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import BugList from '../../components/BugList';

// Mock fetch API
const fetchMock = () => {
  const store = { bugs: [] };
  global.fetch = jest.fn(async (url, opts = {}) => {
    if (url === '/api/bugs' && !opts.method) {
      return { ok: true, json: async () => store.bugs };
    }
    if (url === '/api/bugs' && opts.method === 'POST') {
      const body = JSON.parse(opts.body);
      const newBug = { id: String(store.bugs.length + 1), title: body.title, description: body.description || '', status: 'open', createdAt: new Date().toISOString() };
      store.bugs.unshift(newBug);
      return { ok: true, json: async () => newBug };
    }
    if (url.match(/\/api\/bugs\/\d+/) && opts.method === 'PATCH') {
      const id = url.split('/').pop();
      const body = JSON.parse(opts.body);
      store.bugs = store.bugs.map(b => b.id === id ? { ...b, status: body.status } : b);
      const updated = store.bugs.find(b => b.id === id);
      return { ok: true, json: async () => updated };
    }
    if (url.match(/\/api\/bugs\/\d+/) && opts.method === 'DELETE') {
      const id = url.split('/').pop();
      store.bugs = store.bugs.filter(b => b.id !== id);
      return { ok: true, json: async () => ({ success: true }) };
    }
    return { ok: false };
  });
};

beforeEach(() => {
  fetchMock();
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('BugList Integration', () => {
  test('renders empty state then creates and lists bug', async () => {
    render(<BugList />);
    expect(screen.getByText(/No bugs yet/i)).toBeInTheDocument();
    fireEvent.change(screen.getByPlaceholderText(/Bug title/i), { target: { value: 'First bug' } });
    fireEvent.click(screen.getByText(/Add Bug/i));

    await waitFor(() => expect(screen.getByText('First bug')).toBeInTheDocument());
  });

  test('updates bug status to resolved', async () => {
    render(<BugList />);
    fireEvent.change(screen.getByPlaceholderText(/Bug title/i), { target: { value: 'Status bug' } });
    fireEvent.click(screen.getByText(/Add Bug/i));

    await waitFor(() => screen.getByText('Status bug'));
    fireEvent.click(screen.getByText(/Resolve/i));

    await waitFor(() => expect(screen.getByText(/resolved/i)).toBeInTheDocument());
  });

  test('deletes a bug from the list', async () => {
    render(<BugList />);
    fireEvent.change(screen.getByPlaceholderText(/Bug title/i), { target: { value: 'Delete bug' } });
    fireEvent.click(screen.getByText(/Add Bug/i));
    await waitFor(() => screen.getByText('Delete bug'));

    fireEvent.click(screen.getByText(/Delete/i));
    await waitFor(() => expect(screen.queryByText('Delete bug')).not.toBeInTheDocument());
  });
});
