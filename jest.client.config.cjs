/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  testTimeout: 300000,
  roots: ['<rootDir>/client'],
  testMatch: ['**/__tests__/**/*.test.tsx', '**/__tests__/**/*.test.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/client/src/$1',
    '\\.css$': 'identity-obj-proxy',
    '^@shared/(.*)$': '<rootDir>/shared/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/client/src/__tests__/setup.ts'],
  collectCoverageFrom: [
    'client/src/**/*.{ts,tsx}',
    '!**/*.d.ts',
    '!**/__tests__/**',
  ],
  coverageDirectory: 'coverage/client',
  coverageReporters: ['text', 'lcov', 'html'],
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: 'tsconfig.test.json',
    }],
  },
  modulePaths: ['<rootDir>'],
  coverageThreshold: {
    global: {
      branches: 30,
      functions: 30,
      lines: 30,
      statements: 30
    },
    './client/src/components/AuthForm.tsx': {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    },
    './client/src/components/GenerationWorkspace.tsx': {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
};