import React from 'react';
import ErrorBoundary from './components/ErrorBoundary';
import BugList from './components/BugList';

export default function App() {
  return (
    <ErrorBoundary>
      <BugList />
    </ErrorBoundary>
  );
}
