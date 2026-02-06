import { useNetworkState } from 'expo-network';
import React, { FC, useEffect } from 'react';

import SchoolAccountConnectedSettings from './SchoolAccountConnectedSettings';
import SchoolAccountOffline from './SchoolAccountOffline';
import SchoolAccountUnconnectedSettings from './SchoolAccountUnconnectedSettings';
import { ScreenName } from '../../../constants/screen-names';
import { SettingsSchoolAccount } from '../../../controllers/settings';
import { supabase } from '../../../utils/supabase';
import { NavigationProp } from '../../../types/navigation';
import { posthog } from '../../../utils/posthog';

interface AppearenceSettingsProps {
  schoolAccountSettings: SettingsSchoolAccount;
  handleSchoolAccountSettingsChange: (
    schoolAccount: SettingsSchoolAccount,
  ) => void;
  navigation: NavigationProp<ScreenName.SETTINGS>;
}

const SchoolAccountSettings: FC<AppearenceSettingsProps> = ({
  navigation,
  schoolAccountSettings,
  handleSchoolAccountSettingsChange,
}) => {
  const network = useNetworkState();

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        if (!session.user.id) {
          posthog.capture('error', {
            message: 'User signed in but no user ID',
            error: JSON.stringify(session),
          });
          return;
        }

        handleSchoolAccountSettingsChange({
          connected: true,
          teamId: session.user.id,
          coachMode: false,
        });
      }
    });

    return () => data.subscription.unsubscribe();
  }, []);

  if (!network.isConnected) {
    return (
      <SchoolAccountOffline
        accountConnected={schoolAccountSettings.connected}
      />
    );
  }

  if (schoolAccountSettings.connected) {
    return (
      <SchoolAccountConnectedSettings
        schoolAccountSettings={schoolAccountSettings}
        handleSchoolAccountSettingsChange={handleSchoolAccountSettingsChange}
      />
    );
  }

  return (
    <SchoolAccountUnconnectedSettings
      onPress={() => navigation.navigate(ScreenName.SCHOOL_ACCOUNT_LOGIN)}
    />
  );
};

export default SchoolAccountSettings;
