import { User, Generation } from '@shared/schema';

export const mockApiResponse = {
  user: null as User | null,
  generations: [] as Generation[],
  error: null as string | null,
};

export const resetMockApi = () => {
  mockApiResponse.user = null;
  mockApiResponse.generations = [];
  mockApiResponse.error = null;
};

export const mockApi = {
  auth: {
    login: jest.fn(async (username: string, password: string) => {
      if (mockApiResponse.error) throw new Error(mockApiResponse.error);
      if (!mockApiResponse.user) throw new Error('Invalid credentials');
      return { user: mockApiResponse.user, token: 'mock-token' };
    }),
    signup: jest.fn(async (username: string, password: string) => {
      if (mockApiResponse.error) throw new Error(mockApiResponse.error);
      if (username === 'existing') throw new Error('Username already exists');
      const user = { id: 'mock-id', username };
      mockApiResponse.user = user;
      return { user, token: 'mock-token' };
    }),
  },
  generations: {
    create: jest.fn(async (formData: FormData) => {
      if (mockApiResponse.error) throw new Error(mockApiResponse.error);
      const generation: Generation = {
        id: 'mock-gen-id',
        userId: 'mock-user-id',
        prompt: formData.get('prompt') as string,
        style: formData.get('style') as string,
        imageUrl: '/mock-image.png',
        uploadedImage: null,
        createdAt: new Date(),
      };
      mockApiResponse.generations.unshift(generation);
      return generation;
    }),
    list: jest.fn(async () => {
      if (mockApiResponse.error) throw new Error(mockApiResponse.error);
      return mockApiResponse.generations;
    }),
    get: jest.fn(async (id: string) => {
      if (mockApiResponse.error) throw new Error(mockApiResponse.error);
      const generation = mockApiResponse.generations.find(g => g.id === id);
      if (!generation) throw new Error('Generation not found');
      return generation;
    }),
  },
};

jest.mock('../lib/api', () => mockApi);