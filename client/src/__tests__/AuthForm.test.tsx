import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AuthForm } from '../components/AuthForm';
import { ThemeProvider } from '../components/ThemeProvider';

// Mock useToast for testing error notifications
jest.mock('../hooks/use-toast', () => ({
  useToast: () => ({
    toast: jest.fn(),
  }),
}));

describe('AuthForm', () => {
  const mockOnSubmit = jest.fn();
  const mockOnToggleMode = jest.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
    mockOnToggleMode.mockClear();
  });

  describe('Login Mode', () => {
    it('renders login form by default', () => {
      render(
        <ThemeProvider defaultTheme="light">
          <AuthForm mode="login" onSubmit={mockOnSubmit} onToggleMode={mockOnToggleMode} />
        </ThemeProvider>
      );

      expect(screen.getByText(/Sign In/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/Enter your username/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/Enter your password/i)).toBeInTheDocument();
    });

    it('handles successful login', async () => {
      render(
        <ThemeProvider defaultTheme="light">
          <AuthForm mode="login" onSubmit={mockOnSubmit} onToggleMode={mockOnToggleMode} />
        </ThemeProvider>
      );

      fireEvent.change(screen.getByPlaceholderText(/Enter your username/i), {
        target: { value: 'testuser' },
      });
      fireEvent.change(screen.getByPlaceholderText(/Enter your password/i), {
        target: { value: 'password123' },
      });

      fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));

      expect(mockOnSubmit).toHaveBeenCalledWith('testuser', 'password123');
    });

    it('requires username and password', async () => {
      render(
        <ThemeProvider defaultTheme="light">
          <AuthForm mode="login" onSubmit={mockOnSubmit} onToggleMode={mockOnToggleMode} />
        </ThemeProvider>
      );

      const submitButton = screen.getByRole('button', { name: /Sign In/i });
      const usernameInput = screen.getByPlaceholderText(/Enter your username/i);
      const passwordInput = screen.getByPlaceholderText(/Enter your password/i);

      fireEvent.click(submitButton);
      expect(mockOnSubmit).not.toHaveBeenCalled();
      expect(usernameInput).toBeRequired();
      expect(passwordInput).toBeRequired();
    });
  });

  describe('Signup Mode', () => {
    it('renders signup form', () => {
      render(
        <ThemeProvider defaultTheme="light">
          <AuthForm mode="signup" onSubmit={mockOnSubmit} onToggleMode={mockOnToggleMode} />
        </ThemeProvider>
      );

      expect(screen.getByRole('button', { name: /Sign Up/i })).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/Enter your username/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/Enter your password/i)).toBeInTheDocument();
    });

    it('handles successful signup', async () => {
      render(
        <ThemeProvider defaultTheme="light">
          <AuthForm mode="signup" onSubmit={mockOnSubmit} onToggleMode={mockOnToggleMode} />
        </ThemeProvider>
      );

      fireEvent.change(screen.getByPlaceholderText(/Enter your username/i), {
        target: { value: 'newuser' },
      });
      fireEvent.change(screen.getByPlaceholderText(/Enter your password/i), {
        target: { value: 'password123' },
      });

      fireEvent.click(screen.getByRole('button', { name: /Sign Up/i }));

      expect(mockOnSubmit).toHaveBeenCalledWith('newuser', 'password123');
    });
  });

  it('toggles between login and signup modes', () => {
    render(
      <ThemeProvider defaultTheme="light">
        <AuthForm mode="login" onSubmit={mockOnSubmit} onToggleMode={mockOnToggleMode} />
      </ThemeProvider>
    );

    const toggleButton = screen.getByTestId('button-toggle-mode');
    fireEvent.click(toggleButton);
    expect(mockOnToggleMode).toHaveBeenCalled();
  });
});