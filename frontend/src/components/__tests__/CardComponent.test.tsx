import { render, screen, fireEvent } from '@testing-library/react';
import CardComponent from '../CardComponent';

// Mock the navigator.clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn().mockResolvedValue(undefined),
  },
});

const mockCard = {
  id: 'user-123',
  name: 'John Doe',
  email: 'john.doe@example.com',
};

describe('CardComponent', () => {
  it('should render the user name and email', () => {
    render(<CardComponent card={mockCard} />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Email: john.doe@example.com')).toBeInTheDocument();
  });

  it('should copy the user ID to the clipboard when the copy button is clicked', async () => {
    render(<CardComponent card={mockCard} />);

    const copyButton = screen.getByTitle('Copy ID to clipboard');
    
    // Check initial state
    expect(copyButton.textContent).toBe('📋 Copy');

    // Act: Click the button
    fireEvent.click(copyButton);

    // Assert: Check that clipboard.writeText was called with the correct ID
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('user-123');
    
    // Assert: Check that the button text changes to "Copied!"
    // We use findByText because the state update is asynchronous
    const copiedButton = await screen.findByText('✓ Copied!');
    expect(copiedButton).toBeInTheDocument();
  });
}); 