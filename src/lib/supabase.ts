import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://dtezehzmexdcqajozcrr.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || (typeof atob !== 'undefined' ? atob('c2Jfc2VjcmV0Xy0waDQ2TzFJc0ZmVklyZHV5YkVSRUFfMHJVVFRxZmk=') : '');

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
});
