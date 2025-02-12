import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNetworkState } from 'expo-network';
import React, { FC, useEffect } from 'react';

import SchoolAccountConnectedSettings from './SchoolAccountConnectedSettings';
import SchoolAccountOffline from './SchoolAccountOffline';
import SchoolAccountUnconnectedSettings from './SchoolAccountUnconnectedSettings';
import { ScreenName } from '../../../constants/screen-names';
import { SettingsSchoolAccount } from '../../../controllers/settings';
import { supabase } from '../../../utils/supabase';

interface AppearenceSettingsProps {
  schoolAccountSettings: SettingsSchoolAccount;
  handleSchoolAccountSettingsChange: (
    schoolAccount: SettingsSchoolAccount,
  ) => void;
  navigation: NativeStackNavigationProp<any>;
}

const SchoolAccountSettings: FC<AppearenceSettingsProps> = ({
  navigation,
  schoolAccountSettings,
  handleSchoolAccountSettingsChange,
}) => {
  const network = useNetworkState();

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        handleSchoolAccountSettingsChange({
          connected: true,
          teamId: session.user.id,
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
