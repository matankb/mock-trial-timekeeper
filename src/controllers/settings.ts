import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appearance } from 'react-native';

import { Theme } from '../types/theme';
import { TrialSetup } from './trial';
import { duration } from '../utils';
import { DeepNonNullable } from 'utility-types';

// settings theme is distinct from the themecontext theme,
// because settings theme can include auto, but the context
// exposes only light and dark
export enum SettingsTheme {
  LIGHT = 'light',
  DARK = 'dark',
  AUTO = 'auto',
}

// since flex is enabled on a per-tournament basis, it's not a setting
export type SettingsSetup = DeepNonNullable<Omit<TrialSetup, 'flexEnabled'>>;

// Settings that are part of the advanced trial setup section, but
// should not be copied to the trial.setup object when creating a new trial.
export interface SettingsAdditionalSetup {
  // sets the default duration for the all loss input
  // but when the trial is created, the exact loss time
  // is set from the input value
  allLossDuration: number;
}

export type SettingsLeague = {
  league: League | null;
};
export interface SettingsSchoolAccount {
  connected: boolean;
  teamId: string | null;
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

  additionalSetup: {
    allLossDuration: duration.hours(3),
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

  // if the schema version is missing, then we won't be able to migrate/recover
  // the stored settings, so return the default settings
  if (!settings || schemaVersion === null) {
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
