import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useContext, useEffect, useState, FC } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';

import AppearenceSettings from './AppearenceSettings';
import SchoolAccountSettings from './SchoolAccount/SchoolAccountSettings';
import SetupSettings from './SetupSettings';
import { RouteProps } from '../../Navigation';
import { ScreenName } from '../../constants/screen-names';
import { ThemeContext } from '../../context/ThemeContext';
import {
  Settings as SettingsData,
  SettingsSchoolAccount,
  SettingsSetup,
  SettingsTheme,
  getSettings,
  setSettings,
  settingsThemeToThemeContextTheme,
} from '../../controllers/settings';

type SettingsProps = NativeStackScreenProps<RouteProps, ScreenName.SETTINGS>;

export const settingsScreenOptions = {
  title: 'Settings',
  headerBackTitle: 'Home',
};

const Settings: FC<SettingsProps> = ({ navigation }) => {
  const [, setTheme] = useContext(ThemeContext);
  const [currentSettings, setCurrentSettings] = useState<SettingsData>(null);

  useEffect(() => {
    getSettings().then((settings) => {
      setCurrentSettings(settings);
    });
  }, []);

  const handleThemeChange = (theme: SettingsTheme) => {
    setTheme(settingsThemeToThemeContextTheme(theme));
    setSettings({ theme });
    setCurrentSettings({ ...currentSettings, theme });
  };

  const handleSetupChange = (setup: SettingsSetup) => {
    setSettings({ setup });
    setCurrentSettings({ ...currentSettings, setup });
  };

  const handleSchoolAccountChange = (schoolAccount: SettingsSchoolAccount) => {
    setSettings({ schoolAccount });
    setCurrentSettings({ ...currentSettings, schoolAccount });
  };

  if (!currentSettings) {
    return <View />;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <AppearenceSettings
        theme={currentSettings.theme}
        handleThemeChange={handleThemeChange}
      />
      <SchoolAccountSettings
        navigation={navigation}
        schoolAccountSettings={currentSettings.schoolAccount}
        handleSchoolAccountSettingsChange={handleSchoolAccountChange}
      />
      <SetupSettings
        setup={currentSettings.setup}
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
