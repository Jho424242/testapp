import { screen, waitFor, act } from '@testing-library/react';
import { render } from '../test-utils';
import App from '../App';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { vi } from 'vitest';

vi.mock('../contexts/AuthContext', async () => {
  const actual = await vi.importActual('../contexts/AuthContext');
  return {
    ...actual,
    useAuth: vi.fn(),
  };
});

vi.mock('../lib/supabaseClient', () => ({
  supabase: {
    auth: {
      updateUser: vi.fn(),
      getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
      onAuthStateChange: vi.fn().mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } }),
    },
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          order: vi.fn().mockResolvedValue({ data: [], error: null }),
        })),
      })),
    })),
  },
}));

const mockUser = {
  id: 'test-user-id',
  email: 'test@example.com',
  user_metadata: {
    subscription: 'free',
  },
};

describe('DashboardPage Integration Test', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('a logged in user should be able to see the quizzes on the dashboard', async () => {
    useAuth.mockReturnValue({ user: mockUser });

    await act(async () => {
      render(<App />, { route: '/dashboard' });
    });

    await waitFor(() => {
      expect(screen.getByText(/Longevity Quiz/i)).toBeInTheDocument();
    });
  });
});
