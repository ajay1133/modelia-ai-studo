import '@testing-library/jest-dom';

// Mock window.matchMedia
globalThis.matchMedia = globalThis.matchMedia || function() {
  return {
    matches: false,
    media: '',
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  };
} as unknown as MediaQueryList;

// Mock IntersectionObserver
class MockIntersectionObserver implements IntersectionObserver {
  readonly root: Element | null = null;
  readonly rootMargin: string = '0px';
  readonly thresholds: ReadonlyArray<number> = [0];
  
  constructor(private readonly callback: IntersectionObserverCallback) {}
  
  disconnect(): void { /* no-op */ }
  observe(_target: Element): void { /* no-op */ }
  unobserve(_target: Element): void { /* no-op */ }
  takeRecords(): IntersectionObserverEntry[] { return []; }
}

globalThis.IntersectionObserver = MockIntersectionObserver;