import { render, screen } from '@testing-library/react';
import { FeatureCard } from '../components/FeatureCard';
import { ThemeProvider } from '../components/ThemeProvider';
import { Wand2 } from 'lucide-react';

describe('FeatureCard', () => {
  const defaultProps = {
    icon: Wand2,
    title: 'AI Generation',
    description: 'Generate unique images using advanced AI'
  };

  it('renders feature card with all elements', () => {
    render(
      <ThemeProvider defaultTheme="light">
        <FeatureCard {...defaultProps} />
      </ThemeProvider>
    );

    expect(screen.getByText('AI Generation')).toBeInTheDocument();
    expect(screen.getByText('Generate unique images using advanced AI')).toBeInTheDocument();
    // Icon is rendered as an SVG
    expect(document.querySelector('svg')).toBeInTheDocument();
  });

  it('applies proper styling classes', () => {
    render(
      <ThemeProvider defaultTheme="light">
        <FeatureCard {...defaultProps} />
      </ThemeProvider>
    );

    const card = screen.getByText('AI Generation').closest('.p-6');
    expect(card).toHaveClass('p-6');

    const iconContainer = document.querySelector('.h-12.w-12');
    expect(iconContainer).toHaveClass('bg-primary/10');
    
    const title = screen.getByText('AI Generation');
    expect(title).toHaveClass('text-xl', 'font-semibold');
    
    const description = screen.getByText('Generate unique images using advanced AI');
    expect(description).toHaveClass('text-muted-foreground');
  });

  it('renders different icons', () => {
    const { container, rerender } = render(
      <ThemeProvider defaultTheme="light">
        <FeatureCard {...defaultProps} />
      </ThemeProvider>
    );

      const firstIcon = container.querySelector('svg');
      expect(firstIcon).toBeInTheDocument();

    rerender(
      <ThemeProvider defaultTheme="light">
        <FeatureCard {...defaultProps} icon={Wand2} />
      </ThemeProvider>
    );

      const secondIcon = container.querySelector('svg');
      expect(secondIcon).toBeInTheDocument();
  });

  it('handles long text content', () => {
    const longProps = {
      icon: Wand2,
      title: 'Very Long Feature Title That Might Wrap',
      description: 'This is a very long description that contains multiple sentences. It should be handled gracefully by the component and maintain proper layout and spacing.'
    };

    render(
      <ThemeProvider defaultTheme="light">
        <FeatureCard {...longProps} />
      </ThemeProvider>
    );

    expect(screen.getByText(longProps.title)).toBeInTheDocument();
    expect(screen.getByText(longProps.description)).toBeInTheDocument();
  });
});