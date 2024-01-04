import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';

import AppearenceSettings from './AppearenceSettings';
import SetupSettings from './SetupSettings';
import { ThemeContext } from '../../context/ThemeContext';
import {
  Settings as SettingsData,
  SettingsTheme,
  getSettings,
  setSettings,
  settingsThemeToThemeContextTheme,
} from '../../controllers/settings';
import { TrialSetup } from '../../controllers/trial';
import Card from '../Card';
import Text from '../Text';

export const settingsScreenOptions = {
  title: 'Settings',
  headerBackTitle: 'Home',
};

const Settings = () => {
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

  const handleSetupChange = (setup: TrialSetup) => {
    setSettings({ setup });
    setCurrentSettings({ ...currentSettings, setup });
  };

  if (!currentSettings) {
    return <View />;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card>
        <Text style={styles.sectionName}>Appearence</Text>

        <AppearenceSettings
          theme={currentSettings.theme}
          handleThemeChange={handleThemeChange}
        />
      </Card>

      <Card>
        <Text style={styles.sectionName}>Trial Setup</Text>
        <Text style={styles.sectionDescription}>
          Changes will only apply to new trials
        </Text>

        <SetupSettings
          setup={currentSettings.setup}
          handleSetupChange={handleSetupChange}
        />
      </Card>
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
});

export default Settings;
