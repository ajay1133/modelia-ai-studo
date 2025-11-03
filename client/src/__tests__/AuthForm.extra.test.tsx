import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthForm } from '@/components/AuthForm';

test('Submitting auth form calls onSubmit with entered credentials and toggle calls onToggleMode', async () => {
  const user = userEvent.setup();
  const submitMock = jest.fn();
  const toggleMock = jest.fn();

  render(<AuthForm mode="login" onSubmit={submitMock} onToggleMode={toggleMock} />);

  await user.type(screen.getByTestId('input-username'), 'alice');
  await user.type(screen.getByTestId('input-password'), 's3cret');

  await user.click(screen.getByTestId('button-submit'));

  expect(submitMock).toHaveBeenCalledWith('alice', 's3cret');

  await user.click(screen.getByTestId('button-toggle-mode'));
  expect(toggleMock).toHaveBeenCalled();
});
