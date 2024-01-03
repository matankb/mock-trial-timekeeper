import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appearance } from 'react-native';

import { TrialSetup } from './trial';
import { Theme } from '../context/ThemeContext';
import { duration } from '../utils';

// settings theme is distinct from the themecontext theme,
// because settings theme can include auto, but the context
// exposes only light and dark
export enum SettingsTheme {
  LIGHT = 'light',
  DARK = 'dark',
  AUTO = 'auto',
}

export interface Settings {
  theme: SettingsTheme;
  setup: TrialSetup;
}

const defaultSettings = {
  theme: SettingsTheme.LIGHT,
  setup: {
    pretrialEnabled: false,
    statementsCombined: true,
    pretrialTime: null,
    statementTime: duration.minutes(14),
    openTime: null,
    closeTime: null,
    directTime: duration.minutes(25),
    crossTime: duration.minutes(25),
    allLoss: duration.hours(3),
  },
};

const SETTINGS_KEY = 'settings';
const SETTINGS_SCHEMA_VERSION_KEY = 'settings_schema_version';

export async function getSettings(): Promise<Settings> {
  const settings = await AsyncStorage.getItem('settings');
  console.log('in here', settings);
  return settings ? JSON.parse(settings) : defaultSettings;
}

export async function setSettings(newSettings: Partial<Settings>) {
  const settings = await getSettings();
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
