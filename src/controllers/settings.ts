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

export type SettingsSetup = Omit<TrialSetup, 'flexEnabled'>; // since flex is enabled on a per-tournament basis, it's not a setting

export interface SettingsSchoolAccount {
  connected: boolean;
  teamId: string;
}

export interface Settings {
  theme: SettingsTheme;
  setup: SettingsSetup;
  schoolAccount: SettingsSchoolAccount;
}

export const defaultSettings: Settings = {
  theme: SettingsTheme.LIGHT,
  setup: {
    pretrialEnabled: false,
    statementsSeparate: false,
    allLossEnabled: true,
    pretrialTime: duration.minutes(5),
    statementTime: duration.minutes(14),
    openTime: duration.minutes(7),
    closeTime: duration.minutes(7),
    directTime: duration.minutes(25),
    crossTime: duration.minutes(25),
  },
  schoolAccount: {
    connected: false,
    teamId: null,
  },
};

const SETTINGS_KEY = 'settings';
const SETTINGS_SCHEMA_VERSION_KEY = 'settings_schema_version';
const SETTINGS_SCHEMA_VERSION = '1.1.0';

function migrateSchemaVersion(oldSettings: any, oldVersion: string): Settings {
  // Version 1.1.0: Add schoolAccount
  if (oldVersion === '1.0.0') {
    const newSettings = {
      ...oldSettings,
      schoolAccount: {
        connected: false,
        teamId: null,
      },
    };

    return newSettings;
  }

  return oldSettings;
}

export async function getSettings(): Promise<Settings> {
  const settings = await AsyncStorage.getItem('settings');
  const schemaVersion = await AsyncStorage.getItem(SETTINGS_SCHEMA_VERSION_KEY);

  if (!settings) {
    return defaultSettings;
  }

  if (schemaVersion !== SETTINGS_SCHEMA_VERSION) {
    const newSettings = migrateSchemaVersion(
      JSON.parse(settings),
      schemaVersion,
    );

    // directly set new settings, to avoid any merging via setSettings
    AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings));
    AsyncStorage.setItem(SETTINGS_SCHEMA_VERSION_KEY, SETTINGS_SCHEMA_VERSION);

    return newSettings;
  }

  return JSON.parse(settings);
}

export async function setSettings(newSettings: Partial<Settings>) {
  const settings = await getSettings();
  const updatedSettings = { ...settings, ...newSettings };
  AsyncStorage.setItem(SETTINGS_SCHEMA_VERSION_KEY, SETTINGS_SCHEMA_VERSION);
  AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(updatedSettings));
}

export function settingsThemeToThemeContextTheme(settingsTheme: SettingsTheme) {
  if (settingsTheme === SettingsTheme.AUTO) {
    const systemColorScheme = Appearance.getColorScheme();

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
