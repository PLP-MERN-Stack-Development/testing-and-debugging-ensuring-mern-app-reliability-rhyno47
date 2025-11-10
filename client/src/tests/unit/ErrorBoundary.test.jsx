import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ErrorBoundary from '../../components/ErrorBoundary';

function Boom() { throw new Error('Boom'); }

describe('ErrorBoundary', () => {
  test('shows fallback UI on error', () => {
    render(
      <ErrorBoundary>
        <Boom />
      </ErrorBoundary>
    );
    expect(screen.getByRole('alert')).toHaveTextContent(/Something went wrong/i);
  });
});
