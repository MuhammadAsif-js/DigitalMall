const mockCreateClient = jest.fn();

jest.mock('react-native-url-polyfill/auto', () => ({}));
jest.mock('@supabase/supabase-js', () => ({
  createClient: mockCreateClient,
}));
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
}));

describe('Supabase Client Initialization', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('should initialize the supabase client with correct url, anon key and options', () => {
    const mockUrl = 'https://mock-supabase-url.supabase.co';
    const mockAnonKey = 'mock-anon-key';
    process.env.EXPO_PUBLIC_SUPABASE_URL = mockUrl;
    process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY = mockAnonKey;

    const { createClient } = require('@supabase/supabase-js');
    const AsyncStorage = require('@react-native-async-storage/async-storage');
    require('./supabase');

    expect(createClient).toHaveBeenCalledTimes(1);
    expect(createClient).toHaveBeenCalledWith(mockUrl, mockAnonKey, {
      auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    });
  });
});
