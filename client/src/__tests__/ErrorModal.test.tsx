import { render, screen, fireEvent } from '@testing-library/react';
import { ErrorModal } from '../components/ErrorModal';
import { ThemeProvider } from '../components/ThemeProvider';

describe('ErrorModal', () => {
  const mockOnClose = jest.fn();
  const mockOnRetry = jest.fn();
  const defaultProps = {
    open: true,
    onClose: mockOnClose,
    onRetry: mockOnRetry,
    message: 'An error occurred during generation'
  };

  beforeEach(() => {
    mockOnClose.mockClear();
    mockOnRetry.mockClear();
  });

  it('renders error modal when open', () => {
    render(
      <ThemeProvider defaultTheme="light">
        <ErrorModal {...defaultProps} />
      </ThemeProvider>
    );

    expect(screen.getByText('Generation Failed')).toBeInTheDocument();
    expect(screen.getByText('An error occurred during generation')).toBeInTheDocument();
    expect(screen.getByTestId('button-close-error')).toBeInTheDocument();
    expect(screen.getByTestId('button-retry')).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(
      <ThemeProvider defaultTheme="light">
        <ErrorModal {...defaultProps} open={false} />
      </ThemeProvider>
    );

    expect(screen.queryByTestId('modal-error')).not.toBeInTheDocument();
  });

  it('calls onClose when Cancel button is clicked', () => {
    render(
      <ThemeProvider defaultTheme="light">
        <ErrorModal {...defaultProps} />
      </ThemeProvider>
    );

    fireEvent.click(screen.getByTestId('button-close-error'));
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('calls onRetry when Try Again button is clicked', () => {
    render(
      <ThemeProvider defaultTheme="light">
        <ErrorModal {...defaultProps} />
      </ThemeProvider>
    );

    fireEvent.click(screen.getByTestId('button-retry'));
    expect(mockOnRetry).toHaveBeenCalled();
  });

  it('displays custom error message', () => {
    const customMessage = 'Custom error message for testing';
    render(
      <ThemeProvider defaultTheme="light">
        <ErrorModal {...defaultProps} message={customMessage} />
      </ThemeProvider>
    );

    expect(screen.getByText(customMessage)).toBeInTheDocument();
  });

  it('calls onClose when dialog close is triggered', () => {
    render(
      <ThemeProvider defaultTheme="light">
        <ErrorModal {...defaultProps} />
      </ThemeProvider>
    );

    // Trigger dialog close through onOpenChange
    const dialog = screen.getByTestId('modal-error').parentElement;
    if (dialog) {
      fireEvent.keyDown(dialog, { key: 'Escape', code: 'Escape' });
    }
    
    expect(mockOnClose).toHaveBeenCalled();
  });
});