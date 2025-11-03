import { render, screen, fireEvent } from '@testing-library/react';
import { GenerationWorkspace } from '../components/GenerationWorkspace';
import { ThemeProvider } from '../components/ThemeProvider';
import React from 'react';

jest.mock('../hooks/use-toast', () => ({
  useToast: () => ({
    toast: jest.fn(),
  }),
}));

describe('GenerationWorkspace', () => {
  const mockOnGenerate = jest.fn();
  const mockOnAbort = jest.fn();

  // Helper to render the workspace with local state so interactions update the UI
  const renderWorkspace = (opts: any = {}) => {
    const mockOnImageSelect = jest.fn();
    const mockOnClearImage = jest.fn();

    const Wrapper = () => {
      const [prompt, setPrompt] = React.useState<string>(opts.prompt ?? '');
      const [style, setStyle] = React.useState<string>(opts.style ?? 'realistic');
      const [uploadedImage, setUploadedImage] = React.useState<File | null>(null);
      const [uploadPreview, setUploadPreview] = React.useState<string | null>(null);
      const [retryCount] = React.useState<number>(opts.retryCount ?? 0);
      const retryLimit = opts.retryLimit ?? 3;

      const onImageSelect = (file: File) => {
        setUploadedImage(file);
        setUploadPreview('');
        mockOnImageSelect(file);
      };

      const onClearImage = () => {
        setUploadedImage(null);
        setUploadPreview(null);
        mockOnClearImage();
      };

      const onGenerate = () => mockOnGenerate(prompt, style, uploadedImage);
      const onAbort = () => mockOnAbort();

      return (
        <ThemeProvider defaultTheme="light">
          <GenerationWorkspace 
            prompt={prompt}
            setPrompt={setPrompt}
            style={style}
            setStyle={setStyle}
            uploadedImage={uploadedImage}
            uploadPreview={uploadPreview}
            onImageSelect={onImageSelect}
            onClearImage={onClearImage}
            onGenerate={onGenerate}
            isGenerating={opts.isGenerating ?? false}
            generatedImage={opts.generatedImage ?? null}
            onAbort={onAbort}
            retryCount={opts.retryCount ?? 0}
            retryLimit={opts.retryLimit ?? 3}
          />
        </ThemeProvider>
      );
    };

    const utils = render(<Wrapper />);
    return { ...utils, mockOnImageSelect, mockOnClearImage };
  };

  beforeEach(() => {
    mockOnGenerate.mockClear();
    mockOnAbort.mockClear();
  });

  it('renders prompt input and style selector', () => {
    renderWorkspace({ isGenerating: false, generatedImage: null });

  expect(screen.getByRole('textbox')).toBeInTheDocument();
  // StyleSelector is a dropdown; ensure the trigger is rendered and shows the default style
  const styleTrigger = screen.getByTestId('style-dropdown');
  expect(styleTrigger).toBeInTheDocument();
  expect(styleTrigger).toHaveTextContent('Realistic');
  });

  it('calls onGenerate when form is submitted', () => {
    renderWorkspace({ isGenerating: false, generatedImage: null });

    const prompt = 'A beautiful sunset';
    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: prompt },
    });

    // Style is already set to "realistic" by default
    fireEvent.click(screen.getByRole('button', { name: /Generate/i }));

    expect(mockOnGenerate).toHaveBeenCalledWith(prompt, 'realistic', null);
  });

  it('shows loading state during generation', () => {
    renderWorkspace({ isGenerating: true, generatedImage: null });

    expect(screen.getByText(/Generating/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Abort/i })).toBeInTheDocument();
  });

  it('shows generated image when available', () => {
    renderWorkspace({ isGenerating: false, generatedImage: '/test-image.png' });

    const img = screen.getByTestId('img-generated');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', '/test-image.png');
  });

  it('disables generate button without prompt', () => {
    renderWorkspace({ isGenerating: false, generatedImage: null });

    const generateButton = screen.getByRole('button', { name: /Generate/i });
    expect(generateButton).toBeDisabled();

    // Add prompt and verify button is enabled
    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: 'Test prompt' },
    });
    expect(generateButton).toBeEnabled();
  });

  it('supports image upload', () => {
    const { mockOnImageSelect } = renderWorkspace({ isGenerating: false, generatedImage: null });

    const file = new File(['test'], 'test.png', { type: 'image/png' });
    const input = screen.getByTestId('input-file');

    Object.defineProperty(input, 'files', {
      value: [file],
    });

    fireEvent.change(input);
    expect(mockOnImageSelect).toHaveBeenCalled();

    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: 'Transform this image' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Generate/i }));

    expect(mockOnGenerate).toHaveBeenCalledWith('Transform this image', 'realistic', file);
  });
});