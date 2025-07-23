import { render, screen, fireEvent } from '@testing-library/react';
import Signup from '../src/components/SignupForm';
import '@testing-library/jest-dom';

describe('Signup Component', () => {
  it('renders form inputs and button', () => {
    render(<Signup />);
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
  });

  it('submits the form with entered data', () => {
    const handleSubmit = jest.fn((e) => e.preventDefault());
    render(<Signup onSubmit={handleSubmit} />);
    
    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'stacy' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'stacy@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
    
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    expect(handleSubmit).toHaveBeenCalled();
  });
});
