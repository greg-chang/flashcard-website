import { render, screen } from '@testing-library/react';
import Footer from '../footer';

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} alt={props.alt} />;
  },
}));

describe('Footer', () => {
  it('should render the brand name', () => {
    render(<Footer />);
    const brandElement = screen.getByText('studylounge');
    expect(brandElement).toBeInTheDocument();
  });

  it('should render the GitHub link with the correct href', () => {
    render(<Footer />);
    const githubLink = screen.getByRole('link', { name: /github/i });
    expect(githubLink).toBeInTheDocument();
    expect(githubLink).toHaveAttribute('href', 'https://github.com/greg-chang/flashcard-website');
  });
}); 