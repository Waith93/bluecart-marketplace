import { render, screen, fireEvent } from '@testing-library/react';
import Favourites from '../src/components/favourites';
import '@testing-library/jest-dom';

describe('Favourites Component', () => {
  const mockFavorites = [
    { id: 1, name: 'Product A', price: 50 },
    { id: 2, name: 'Product B', price: 75 },
  ];

  it('displays list of favorite items', () => {
    render(<Favourites favorites={mockFavorites} />);
    expect(screen.getByText(/product a/i)).toBeInTheDocument();
    expect(screen.getByText(/product b/i)).toBeInTheDocument();
  });

  it('calls remove handler when remove button is clicked', () => {
    const handleRemove = jest.fn();
    render(<Favourites favorites={mockFavorites} onRemove={handleRemove} />);

    const removeButtons = screen.getAllByRole('button', { name: /remove/i });
    fireEvent.click(removeButtons[0]);

    expect(handleRemove).toHaveBeenCalledWith(mockFavorites[0].id);
  });
});