import { PostHog } from 'posthog-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const posthog = new PostHog(process.env.EXPO_PUBLIC_POSTHOG_KEY, {
  host: process.env.EXPO_PUBLIC_POSTHOG_HOST,
  customStorage: AsyncStorage,
  errorTracking: {
    autocapture: {
      uncaughtExceptions: true, // Captures unhandled exceptions
      unhandledRejections: true, // Captures promise rejections
      console: ['error', 'warn'], // Captures console errors and warnings
    },
  },
});
