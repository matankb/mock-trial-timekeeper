import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient, PostgrestError } from '@supabase/supabase-js';
import { AppState } from 'react-native';

import 'react-native-url-polyfill/auto';
import { Database } from '../types/supabase';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Refresh the session automatically if the app is in the foreground.
// This should only be registered once.
AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

/**
 * Convert a Supabase error to an error that can be send via @link{openBugReportEmail}
 */
export function supabaseDbErrorToReportableError(error: PostgrestError) {
  // openBugReport email will only include the name, cause, message, and stack
  // so we combine the non-standard error properties into the `message` field
  return new Error(
    JSON.stringify({
      message: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint,
    }),
  );
}
