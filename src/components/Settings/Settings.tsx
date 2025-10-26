import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState, FC } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';

import AppearenceSettings from './AppearenceSettings';
import SchoolAccountSettings from './SchoolAccount/SchoolAccountSettings';
import SetupSettings from './SetupSettings';
import { RouteProps } from '../../Navigation';
import { ScreenName } from '../../constants/screen-names';
import {
  Settings as SettingsData,
  SettingsSchoolAccount,
  SettingsSetup,
  SettingsTheme,
  getSettings,
  setSettings,
  settingsThemeToThemeContextTheme,
} from '../../controllers/settings';
import { useProvidedContext } from '../../context/ContextProvider';

type SettingsProps = NativeStackScreenProps<RouteProps, ScreenName.SETTINGS>;

export const settingsScreenOptions = {
  title: 'Settings',
  headerBackTitle: 'Home',
};

const Settings: FC<SettingsProps> = ({ navigation }) => {
  const {
    theme: { setTheme },
  } = useProvidedContext();
  const [settingsState, setSettingsState] = useState<SettingsData | null>(null);

  useEffect(() => {
    getSettings().then((settings) => {
      setSettingsState(settings);
    });
  }, []);

  if (!settingsState) {
    return <View />;
  }

  // Merge new settings into the state and storage
  const updateSettings = (newSettings: Partial<SettingsData>) => {
    setSettings(newSettings);
    setSettingsState((oldSettings) => {
      // this will never happen, since the handlers are not
      // triggerable until the settings state loads
      if (!oldSettings) {
        return null;
      }

      return {
        ...oldSettings,
        ...newSettings,
      };
    });
  };

  const handleThemeChange = (theme: SettingsTheme) => {
    setTheme(settingsThemeToThemeContextTheme(theme));
    updateSettings({ theme });
  };

  const handleSetupChange = (setup: SettingsSetup) => {
    updateSettings({ setup });
  };

  const handleSchoolAccountChange = (schoolAccount: SettingsSchoolAccount) => {
    updateSettings({ schoolAccount });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <AppearenceSettings
        theme={settingsState.theme}
        handleThemeChange={handleThemeChange}
      />
      <SchoolAccountSettings
        navigation={navigation}
        schoolAccountSettings={settingsState.schoolAccount}
        handleSchoolAccountSettingsChange={handleSchoolAccountChange}
      />
      <SetupSettings
        setup={settingsState.setup}
        handleSetupChange={handleSetupChange}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 10,
  },
  sectionName: {
    fontSize: 16,
    fontWeight: 'bold',
    padding: 10,
  },
  sectionDescription: {
    padding: 10,
    paddingVertical: 5,
    color: 'gray',
  },
  sectionHeader: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default Settings;
