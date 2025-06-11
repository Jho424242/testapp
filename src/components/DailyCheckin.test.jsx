import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import DailyCheckin from './DailyCheckin';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { useTranslation } from 'react-i18next';

// Mock the required hooks and modules
vi.mock('../contexts/AuthContext', () => ({
  useAuth: vi.fn(),
}));

vi.mock('../lib/supabaseClient', () => ({
  supabase: {
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
  },
}));

vi.mock('react-i18next', () => ({
  useTranslation: vi.fn(),
}));

describe('DailyCheckin Component', () => {
  beforeEach(() => {
    useAuth.mockReturnValue({
      user: { id: 'test-user-id' },
    });

    useTranslation.mockReturnValue({
      t: (key) => key,
    });

    supabase.from.mockImplementation(() => ({
      select: () => ({
        eq: () => ({
          order: () => ({
            then: (callback) => callback({
              data: [
                { quiz_name: 'mental_health_assessment', score: 60 },
                { quiz_name: 'longevity_quiz', score: 40 },
              ],
              error: null,
            }),
          }),
        }),
      }),
    }));

    supabase.insert.mockImplementation(() => ({
      then: (callback) => callback({ error: null }),
    }));
  });

  it('renders the form with all fields', () => {
    render(<DailyCheckin />);
    
    expect(screen.getByLabelText('date')).toBeInTheDocument();
    expect(screen.getByLabelText('feeling_rating')).toBeInTheDocument();
    expect(screen.getByLabelText('notes')).toBeInTheDocument();
    expect(screen.getByText('submit')).toBeInTheDocument();
  });

  it('allows changing the date', () => {
    render(<DailyCheckin />);
    const dateInput = screen.getByLabelText('date');
    fireEvent.change(dateInput, { target: { value: '2025-06-11' } });
    expect(dateInput.value).toBe('2025-06-11');
  });

  it('allows changing the feeling rating', () => {
    render(<DailyCheckin />);
    const ratingInput = screen.getByLabelText('feeling_rating');
    fireEvent.change(ratingInput, { target: { value: '8' } });
    expect(ratingInput.value).toBe('8');
  });

  it('allows adding notes', () => {
    render(<DailyCheckin />);
    const notesInput = screen.getByLabelText('notes');
    fireEvent.change(notesInput, { target: { value: 'Test note' } });
    expect(notesInput.value).toBe('Test note');
  });

  it('submits the form successfully', async () => {
    render(<DailyCheckin />);
    const submitButton = screen.getByText('submit');
    
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(supabase.from).toHaveBeenCalledWith('daily_checkins');
      expect(supabase.insert).toHaveBeenCalled();
    });
  });

  it('handles API errors gracefully', async () => {
    supabase.insert.mockImplementation(() => ({
      then: (callback) => callback({ error: { message: 'Test error' } }),
    }));

    render(<DailyCheckin />);
    const submitButton = screen.getByText('submit');
    
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(supabase.from).toHaveBeenCalledWith('daily_checkins');
    });
  });
});
