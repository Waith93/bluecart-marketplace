import { render, screen, fireEvent } from '@testing-library/react';
import ResetPassword from '../src/components/Reset-password';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';

describe('ResetPassword Component', () => {
  it('renders all input fields and reset button', () => {
    render(
      <MemoryRouter>
        <ResetPassword />
      </MemoryRouter>
    );

    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^email$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/new password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /reset password/i })).toBeInTheDocument();
  });

  it('calls reset function on form submit', () => {
    const handleReset = jest.fn((e) => e.preventDefault());

    render(
      <MemoryRouter>
        <ResetPassword onSubmit={handleReset} />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: 'TestUser' },
    });
    fireEvent.change(screen.getByLabelText(/^email$/i), {
      target: { value: 'reset@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/new password/i), {
      target: { value: 'secret123' },
    });
    fireEvent.change(screen.getByLabelText(/confirm password/i), {
      target: { value: 'secret123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /reset password/i }));

    expect(handleReset).toHaveBeenCalled();
  });
});

