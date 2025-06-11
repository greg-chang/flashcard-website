import { render, screen } from '@testing-library/react';
import Homepage from '../Homepage';

// Mock the Footer component as it's not the focus of this test
jest.mock('@/components/footer', () => {
  return function DummyFooter() {
    return <div data-testid="footer"></div>;
  };
});

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} alt={props.alt} />;
  },
}));

describe('Homepage', () => {
  it('should render the hero image', () => {
    render(<Homepage />);

    const heroImage = screen.getByAltText('Hero Image');
    expect(heroImage).toBeInTheDocument();
  });
}); 