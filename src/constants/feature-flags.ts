// Disabled October 2025, since some more work is needed to bring

import { Platform } from 'react-native';

// team accounts to GA.
export const TEAM_ACCOUNT_PROMO_ENABLED = Platform.OS !== 'web';
export const TEAM_TRIALS_IN_APP_ENABLED = Platform.OS !== 'web';
