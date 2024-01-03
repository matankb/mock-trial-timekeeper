import { useTheme } from '@react-navigation/native';
import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
} from 'react-native';

import AppearenceSettings from './AppearenceSettings';
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
import TimeEditor from '../TimeEditor/TimeEditor';
import SetupSettings from './SetupSettings';
import colors from '../../constants/colors';

export const settingsScreenOptions = {
  title: 'Settings',
  headerBackTitle: 'Home',
};

const Settings = () => {
  const [theme, setTheme] = useContext(ThemeContext);
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
    <ScrollView>
      <Card>
        <Text style={{ fontSize: 16, fontWeight: 'bold', padding: 10 }}>
          Appearence
        </Text>

        <AppearenceSettings
          theme={currentSettings.theme}
          handleThemeChange={handleThemeChange}
        />
      </Card>
      <Card>
        <Text style={{ fontSize: 16, fontWeight: 'bold', padding: 10 }}>
          Trial Setup
        </Text>
        <Text style={{ padding: 10, paddingVertical: 5, color: 'gray' }}>
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

const styles = StyleSheet.create({});

export default Settings;
