import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StyleSelector } from '../components/StyleSelector';
import { ThemeProvider } from '../components/ThemeProvider';

// Mock the @radix-ui/react-select components
jest.mock('@/components/ui/select', () => {
  const MockSelect = ({ children, value, onValueChange }: any) => {
    const handleOptionClick = (optionValue: string) => {
      onValueChange?.(optionValue);
    };

    const childrenWithProps = React.Children.map(children, child => {
      if (child.type.name === 'SelectContent') {
        return React.cloneElement(child, {
          children: React.Children.map(child.props.children, option =>
            React.cloneElement(option, { onClick: () => handleOptionClick(option.props.value) })
          ),
        });
      }
      return child;
    });

    return (
      <div data-testid="mock-select" data-value={value}>
        {childrenWithProps}
      </div>
    );
  };

  return {
    Select: MockSelect,
    SelectTrigger: ({ children, className, ...props }: any) => (
      <button className={className} {...props}>
        {children}
      </button>
    ),
    SelectContent: ({ children }: any) => <div data-testid="select-content">{children}</div>,
    SelectItem: ({ children, value, onClick, ...props }: any) => (
      <div
        role="option"
        data-value={value}
        data-testid={`style-option-${value}`}
        onClick={onClick}
        {...props}
      >
        {children}
      </div>
    ),
    SelectValue: ({ children, placeholder }: any) => (
      <span>{children || placeholder}</span>
    ),
  };
});

describe('StyleSelector', () => {
  const mockOnStyleChange = jest.fn();

  beforeEach(() => {
    mockOnStyleChange.mockClear();
  });

  it('renders with default selection', () => {
    render(
      <ThemeProvider defaultTheme="light">
        <StyleSelector selectedStyle="realistic" onStyleChange={mockOnStyleChange} />
      </ThemeProvider>
    );

    expect(screen.getByTestId('style-dropdown')).toBeInTheDocument();
    expect(screen.getByText('Photo-realistic style')).toBeInTheDocument();
  });

  it('shows all style options', () => {
    render(
      <ThemeProvider defaultTheme="light">
        <StyleSelector selectedStyle="realistic" onStyleChange={mockOnStyleChange} />
      </ThemeProvider>
    );

    const styles = [
      { name: 'Realistic', desc: 'Photo-realistic style' },
      { name: 'Artistic', desc: 'Painterly and creative' },
      { name: 'Abstract', desc: 'Modern and abstract' },
      { name: 'Cyberpunk', desc: 'Futuristic neon aesthetic' },
    ];

    styles.forEach(style => {
      expect(screen.getByText(style.name)).toBeInTheDocument();
      expect(screen.getByText(style.desc)).toBeInTheDocument();
    });
  });

  it('calls onStyleChange when a new style is selected', () => {
    render(
      <ThemeProvider defaultTheme="light">
        <StyleSelector selectedStyle="realistic" onStyleChange={mockOnStyleChange} />
      </ThemeProvider>
    );

    // Find the artistic style option and click it
    const artisticOption = screen.getByTestId('style-option-artistic');
    fireEvent.click(artisticOption);

    // The mock should simulate the value change
    expect(mockOnStyleChange).toHaveBeenCalledWith('artistic');
  });

  it('displays the selected style', () => {
    const selectedStyle = 'artistic';
    render(
      <ThemeProvider defaultTheme="light">
        <StyleSelector selectedStyle={selectedStyle} onStyleChange={mockOnStyleChange} />
      </ThemeProvider>
    );

    expect(screen.getByText('Painterly and creative')).toBeInTheDocument();
  });
});