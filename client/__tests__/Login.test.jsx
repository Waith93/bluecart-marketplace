import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginForm from '../src/components/LoginForm';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';

describe('LoginForm Component', () => {
  it('renders the login form fields', () => {
    render(
      <MemoryRouter>
        <LoginForm />
      </MemoryRouter>
    );

    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it('submits the form and logs the values', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    render(
      <MemoryRouter>
        <LoginForm />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: 'stacy' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'bluecart123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Login submitted:', {
        username: 'stacy',
        password: 'bluecart123',
      });
    });

    consoleSpy.mockRestore();
  });
});

