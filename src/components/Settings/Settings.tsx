import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';

import AppearenceSettings from './AppearenceSettings';
import SetupSettings from './SetupSettings';
import { ThemeContext } from '../../context/ThemeContext';
import {
  Settings as SettingsData,
  SettingsSetup,
  SettingsTheme,
  defaultSettings,
  getSettings,
  setSettings,
  settingsThemeToThemeContextTheme,
} from '../../controllers/settings';
import Card from '../Card';
import LinkButton from '../LinkButton';
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

  const handleSetupChange = (setup: SettingsSetup) => {
    setSettings({ setup });
    setCurrentSettings({ ...currentSettings, setup });
  };

  const handleSetupReset = () => {
    handleSetupChange(defaultSettings.setup);
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
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionName}>Trial Setup</Text>
            <Text style={styles.sectionDescription}>
              Changes will only apply to new trials
            </Text>
          </View>
          <LinkButton title="Reset" onPress={handleSetupReset} />
        </View>

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
  sectionHeader: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default Settings;
