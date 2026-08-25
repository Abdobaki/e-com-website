import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://dtezehzmexdcqajozcrr.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0ZXplaHptZXhkY3Fham96Y3JyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc1Njc1MjgsImV4cCI6MjEwMzE0MzUyOH0.UtWhpsoEh1WhpGl4xRLZbu2WY8jlcgtiCp3eHG4UoKY';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
});
