import React, { useState } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { GenerationWorkspace } from '@/components/GenerationWorkspace';

function Wrapper() {
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('realistic');

  return (
    <GenerationWorkspace
      prompt={prompt}
      setPrompt={setPrompt}
      style={style}
      setStyle={setStyle}
      uploadedImage={null}
      uploadPreview={null}
      onImageSelect={() => {}}
      onClearImage={() => {}}
      onGenerate={() => {}}
      isGenerating={false}
      generatedImage={null}
      onAbort={() => {}}
      retryCount={0}
      retryLimit={3}
    />
  );
}

test('Generate button is disabled when prompt is empty and enabled when prompt has text', () => {
  render(<Wrapper />);

  const generateBtn = screen.getByTestId('button-generate') as HTMLButtonElement;
  expect(generateBtn).toBeDisabled();

  const promptInput = screen.getByTestId('input-prompt') as HTMLTextAreaElement;
  fireEvent.change(promptInput, { target: { value: 'A scenic mountain at dusk' } });

  expect(generateBtn).toBeEnabled();
});
