import { render, screen, waitFor } from '@testing-library/react';
import DashboardPage from '../Dashboard';

// --- Mocks ---
const mockPush = jest.fn();
const mockToast = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

jest.mock('@chakra-ui/react', () => {
  const originalChakra = jest.requireActual('@chakra-ui/react');
  return {
    ...originalChakra,
    useToast: () => mockToast,
  };
});

jest.mock('@clerk/nextjs', () => ({
  useAuth: () => ({
    getToken: async () => 'test-token',
  }),
}));

jest.mock('@/components/footer', () => {
    return function DummyFooter() {
      return <div data-testid="footer"></div>;
    };
});

jest.mock('next/image', () => ({
    __esModule: true,
    default: (props: any) => {
      // eslint-disable-next-line @next/next/no-img-element
      return <img {...props} alt={props.alt} />;
    },
}));

global.fetch = jest.fn();

// --- Tests ---
describe('DashboardPage', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
    mockPush.mockClear();
    mockToast.mockClear();
  });

  it('should display a loading spinner initially', () => {
    (fetch as jest.Mock).mockImplementation(() => new Promise(() => {})); // Never resolves
    render(<DashboardPage />);
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('should display an error message if fetching decks fails', async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error('API Error'));
    render(<DashboardPage />);
    
    const errorMessage = await screen.findByText('Failed to load decks');
    expect(errorMessage).toBeInTheDocument();
  });

  it('should display "No decks found" when there are no decks', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });
    render(<DashboardPage />);
    
    const noDecksMessage = await screen.findByText('No decks found');
    expect(noDecksMessage).toBeInTheDocument();
  });

  it('should render the list of decks on successful fetch', async () => {
    const mockDecks = [
      { id: '1', title: 'React Basics', description: 'Fundamentals of React', labels: ['JS'] },
      { id: '2', title: 'Go Patterns', description: 'Best practices in Go', labels: ['Go'] },
    ];
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockDecks,
    });
    render(<DashboardPage />);
    
    // Wait for the deck titles to appear
    await waitFor(() => {
        expect(screen.getByRole('heading', { name: /react basics/i })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: /go patterns/i })).toBeInTheDocument();
    });
  });
}); 