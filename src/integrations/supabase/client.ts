
import { createClient } from '@supabase/supabase-js';
import { Database } from './types';

// Supabase configuration
const supabaseUrl = 'https://plwbcmhvgpgjcmcjajsm.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsd2JjbWh2Z3BnamNtY2phanNtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM2OTc1MzMsImV4cCI6MjA1OTI3MzUzM30.7x-i2fi6BoGwTbpQQULeJ3rpd-MdtQP0DlVTrgvToBU';

// Create Supabase client with customized local storage handling
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: localStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});
