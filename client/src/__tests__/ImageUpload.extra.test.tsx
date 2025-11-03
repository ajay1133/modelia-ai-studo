import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ImageUpload } from '@/components/ImageUpload';

test('Dropping an image file calls onImageSelect', () => {
  const mockOnImageSelect = jest.fn();

  render(<ImageUpload onImageSelect={mockOnImageSelect} selectedImage={null} onClearImage={() => {}} />);

  const dropzone = screen.getByTestId('dropzone-upload');

  const file = new File(['dummy'], 'photo.png', { type: 'image/png' });

  fireEvent.drop(dropzone, {
    dataTransfer: {
      files: [file],
      types: ['Files'],
    },
  } as unknown as DragEvent);

  expect(mockOnImageSelect).toHaveBeenCalled();
});
