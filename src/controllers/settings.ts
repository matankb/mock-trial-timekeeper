import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appearance } from 'react-native';

import { Theme } from '../context/ThemeContext';

// settings theme is distinct from the themecontext theme,
// because settings theme can include auto, but the context
// exposes only light and dark
export enum SettingsTheme {
  LIGHT,
  DARK,
  AUTO,
}

export interface Settings {
  theme: SettingsTheme;
}

const defaultSettings = {
  theme: SettingsTheme.LIGHT,
};

const SETTINGS_KEY = 'settings';
const SETTINGS_SCHEMA_VERSION_KEY = 'settings_schema_version';

export async function getSettings(): Promise<Settings> {
  const settings = await AsyncStorage.getItem('settings');
  return settings ? JSON.parse(settings) : defaultSettings;
}

export function setSettings(newSettings: Partial<Settings>) {
  const settings = getSettings();
  const updatedSettings = { ...settings, ...newSettings };
  AsyncStorage.setItem(SETTINGS_SCHEMA_VERSION_KEY, '1.0.0');
  AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(updatedSettings));
}

export function settingsThemeToThemeContextTheme(settingsTheme: SettingsTheme) {
  if (settingsTheme === SettingsTheme.AUTO) {
    const systemColorScheme = Appearance.getColorScheme();
    console.log('systemColorScheme', systemColorScheme);
    if (systemColorScheme === 'dark') {
      return Theme.DARK;
    } else {
      return Theme.LIGHT;
    }
  }

  if (settingsTheme === SettingsTheme.DARK) {
    return Theme.DARK;
  } else {
    return Theme.LIGHT;
  }
}
