import { render, screen, fireEvent } from '@testing-library/react';
import { ImageUpload } from '../components/ImageUpload';
import { ThemeProvider } from '../components/ThemeProvider';

describe('ImageUpload', () => {
  const mockOnImageSelect = jest.fn();
  const mockOnClearImage = jest.fn();

  beforeEach(() => {
    mockOnImageSelect.mockClear();
    mockOnClearImage.mockClear();
  });

  it('renders upload interface when no image is selected', () => {
    render(
      <ThemeProvider defaultTheme="light">
        <ImageUpload 
          onImageSelect={mockOnImageSelect}
          onClearImage={mockOnClearImage}
          selectedImage={null}
        />
      </ThemeProvider>
    );

    expect(screen.getByText(/Drop your image here or click to browse/i)).toBeInTheDocument();
    expect(screen.getByText(/PNG, JPG, or GIF up to 10MB/i)).toBeInTheDocument();
    expect(screen.getByTestId('input-file')).toBeInTheDocument();
  });

  it('handles file selection through input', () => {
    render(
      <ThemeProvider defaultTheme="light">
        <ImageUpload 
          onImageSelect={mockOnImageSelect}
          onClearImage={mockOnClearImage}
          selectedImage={null}
        />
      </ThemeProvider>
    );

    const file = new File(['test'], 'test.png', { type: 'image/png' });
    const input = screen.getByTestId('input-file');

    Object.defineProperty(input, 'files', {
      value: [file]
    });

    fireEvent.change(input);
    expect(mockOnImageSelect).toHaveBeenCalledWith(file);
  });

  it('renders selected image preview', () => {
    render(
      <ThemeProvider defaultTheme="light">
        <ImageUpload 
          onImageSelect={mockOnImageSelect}
          onClearImage={mockOnClearImage}
          selectedImage="data:image/png;base64,fake-image-data"
        />
      </ThemeProvider>
    );

    const img = screen.getByAltText('Selected upload');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', 'data:image/png;base64,fake-image-data');
  });

  it('allows clearing selected image', () => {
    render(
      <ThemeProvider defaultTheme="light">
        <ImageUpload 
          onImageSelect={mockOnImageSelect}
          onClearImage={mockOnClearImage}
          selectedImage="data:image/png;base64,fake-image-data"
        />
      </ThemeProvider>
    );

    const clearButton = screen.getByTestId('button-clear-image');
    fireEvent.click(clearButton);
    expect(mockOnClearImage).toHaveBeenCalled();
  });

  it('handles drag and drop', () => {
    render(
      <ThemeProvider defaultTheme="light">
        <ImageUpload 
          onImageSelect={mockOnImageSelect}
          onClearImage={mockOnClearImage}
          selectedImage={null}
        />
      </ThemeProvider>
    );

    const dropzone = screen.getByTestId('dropzone-upload');
    const file = new File(['test'], 'test.png', { type: 'image/png' });
    
    // Mock dataTransfer
    const dataTransfer = {
      files: [file],
    };

    fireEvent.dragOver(dropzone);
    fireEvent.drop(dropzone, { dataTransfer });

    expect(mockOnImageSelect).toHaveBeenCalledWith(file);
  });
});