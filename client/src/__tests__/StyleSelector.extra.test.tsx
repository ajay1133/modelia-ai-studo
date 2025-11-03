import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { StyleSelector } from '@/components/StyleSelector';
import { ThemeProvider } from '@/components/ThemeProvider';

// Mock the @radix-ui/react-select based select wrapper used by the app
jest.mock('@/components/ui/select', () => {
  const MockSelect = ({ children, value, onValueChange }: any) => {
    const handleOptionClick = (optionValue: string) => {
      onValueChange?.(optionValue);
    };

    const childrenWithProps = React.Children.map(children, (child: any) => {
      if (child.type && child.type.name === 'SelectContent') {
        return React.cloneElement(child, {
          children: React.Children.map(child.props.children, (option: any) =>
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
      <div role="option" data-value={value} data-testid={`style-option-${value}`} onClick={onClick} {...props}>
        {children}
      </div>
    ),
    SelectValue: ({ children, placeholder }: any) => <span>{children || placeholder}</span>,
  };
});

test('Selecting a style from dropdown calls onStyleChange with correct value', () => {
  const mockOnChange = jest.fn();

  render(
    <ThemeProvider defaultTheme="light">
      <StyleSelector selectedStyle="" onStyleChange={mockOnChange} />
    </ThemeProvider>
  );

  const artisticOption = screen.getByTestId('style-option-artistic');
  fireEvent.click(artisticOption);

  expect(mockOnChange).toHaveBeenCalledWith('artistic');
});
