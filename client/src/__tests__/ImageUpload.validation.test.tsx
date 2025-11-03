import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ImageUpload } from '@/components/ImageUpload';

test('Rejects non-jpg/png files and shows error message', () => {
  const mockOnImageSelect = jest.fn();
  render(<ImageUpload onImageSelect={mockOnImageSelect} selectedImage={null} onClearImage={() => {}} />);

  const dropzone = screen.getByTestId('dropzone-upload');
  const file = new File(['hello'], 'note.txt', { type: 'text/plain' });

  fireEvent.drop(dropzone, {
    dataTransfer: {
      files: [file],
      types: ['Files'],
    },
  } as unknown as DragEvent);

  expect(mockOnImageSelect).not.toHaveBeenCalled();
  expect(screen.getByTestId('upload-error')).toHaveTextContent('Only JPG or PNG files are allowed');
});

test('Rejects files larger than 10MB and shows size error', () => {
  const mockOnImageSelect = jest.fn();
  render(<ImageUpload onImageSelect={mockOnImageSelect} selectedImage={null} onClearImage={() => {}} />);

  const dropzone = screen.getByTestId('dropzone-upload');
  // Create a fake file with size > 10MB by setting size property via Object.defineProperty
  const bigFile = new File(['a'.repeat(1024 * 1024)], 'big.png', { type: 'image/png' });
  Object.defineProperty(bigFile, 'size', { value: 11 * 1024 * 1024 });

  fireEvent.drop(dropzone, {
    dataTransfer: {
      files: [bigFile],
      types: ['Files'],
    },
  } as unknown as DragEvent);

  expect(mockOnImageSelect).not.toHaveBeenCalled();
  expect(screen.getByTestId('upload-error')).toHaveTextContent('File is too large');
});
