import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test('renders Start button', () => {
  const { getByText } = render(<App />);
  const linkElement = getByText(/Start/i);
  expect(linkElement).toBeInTheDocument();
});
