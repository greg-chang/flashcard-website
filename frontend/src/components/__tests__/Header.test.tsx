import { render, screen } from '@testing-library/react';
import Header from '../Header';

// Mock the @clerk/nextjs module
jest.mock('@clerk/nextjs', () => ({
  useUser: jest.fn(),
  UserButton: () => <div data-testid="user-button"></div>,
  SignUpButton: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} alt={props.alt} />;
  },
}));

// Import the mocked hook to control its return value
const { useUser } = require('@clerk/nextjs');

describe('Header', () => {
  it('should render the Sign Up button when the user is not signed in', () => {
    // Arrange: Mock the hook to return a logged-out state
    (useUser as jest.Mock).mockReturnValue({
      isLoaded: true,
      isSignedIn: false,
    });

    // Act
    render(<Header />);

    // Assert
    const signUpButton = screen.getByText('Sign Up');
    expect(signUpButton).toBeInTheDocument();
  });

  it('should render the UserButton when the user is signed in', () => {
    // Arrange: Mock the hook to return a logged-in state
    (useUser as jest.Mock).mockReturnValue({
      isLoaded: true,
      isSignedIn: true,
    });

    // Act
    render(<Header />);

    // Assert
    const userButton = screen.getByTestId('user-button');
    expect(userButton).toBeInTheDocument();
  });

  it('should render the brand name', () => {
    (useUser as jest.Mock).mockReturnValue({ isLoaded: true });
    render(<Header />);
    const brandElement = screen.getByText('studylounge');
    expect(brandElement).toBeInTheDocument();
  });
}); 