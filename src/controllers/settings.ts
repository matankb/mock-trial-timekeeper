import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appearance } from 'react-native';

import { Theme } from '../types/theme';
import { TrialSetup } from './trial';
import { duration } from '../utils';
import { DeepNonNullable } from 'utility-types';
import { League } from '../constants/leagues';
import { settingsMigrations } from '../migrations/settings-migrations';
import { getStorageItem } from '../migrations/migration';

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
  additionalSetup: SettingsAdditionalSetup;
  schoolAccount: SettingsSchoolAccount;
  league: SettingsLeague;
}

export const defaultSettings: Settings = {
  theme: SettingsTheme.LIGHT,

  // The default setup is for AMTA
  setup: {
    pretrialEnabled: false,
    statementsSeparate: false,
    allLossEnabled: true,
    pretrialTime: duration.minutes(5),
    statementTime: duration.minutes(14),
    openTime: duration.minutes(7),
    closeTime: duration.minutes(7),
    rebuttalMaxEnabled: false,
    rebuttalMaxTime: duration.minutes(3),
    directTime: duration.minutes(25),
    crossTime: duration.minutes(25),
    jointPrepClosingsEnabled: false,
    jointConferenceEnabled: false,
    jointPrepClosingsTime: duration.minutes(2),
    jointConferenceTime: duration.minutes(2),
    reexaminationsEnabled: false,
  },

  additionalSetup: {
    allLossDuration: duration.hours(3),
  },

  schoolAccount: {
    connected: false,
    teamId: null,
  },

  league: {
    league: null,
  },
};

export const leagueSetupOverrides: Record<League, SettingsSetup> = {
  [League.AMTA]: defaultSettings.setup, // TODO: document why this needs to be contained here - it's so that it gets overridden when they switch leagues.
  [League.Minnesota]: {
    allLossEnabled: false,
    jointPrepClosingsEnabled: true,
    jointPrepClosingsTime: duration.minutes(2),
    jointConferenceEnabled: true,
    jointConferenceTime: duration.minutes(2),
    rebuttalMaxEnabled: true,
    rebuttalMaxTime: duration.minutes(3),
    statementsSeparate: true,
    openTime: duration.minutes(5),
    closeTime: duration.minutes(7),
    directTime: duration.minutes(25),
    crossTime: duration.minutes(18),
    pretrialEnabled: false,
    pretrialTime: defaultSettings.setup.pretrialTime,
    statementTime: defaultSettings.setup.statementTime,
    reexaminationsEnabled: false,
  },
  [League.Florida]: {
    allLossEnabled: false,
    jointPrepClosingsEnabled: false,
    jointPrepClosingsTime: duration.minutes(0),
    jointConferenceEnabled: false,
    jointConferenceTime: duration.minutes(0),
    rebuttalMaxEnabled: false,
    rebuttalMaxTime: duration.minutes(3),
    statementsSeparate: true,
    openTime: duration.minutes(5),
    closeTime: duration.minutes(5),
    directTime: duration.minutes(25),
    crossTime: duration.minutes(20),
    pretrialEnabled: false,
    pretrialTime: defaultSettings.setup.pretrialTime,
    statementTime: defaultSettings.setup.statementTime,
    reexaminationsEnabled: true,
  },
  [League.Idaho]: {
    allLossEnabled: false,
    jointPrepClosingsEnabled: true,
    jointPrepClosingsTime: duration.minutes(3),
    jointConferenceEnabled: true,
    jointConferenceTime: duration.minutes(10),
    rebuttalMaxEnabled: false,
    rebuttalMaxTime: duration.minutes(0),
    statementsSeparate: true,
    openTime: duration.minutes(5),
    closeTime: duration.minutes(5),
    directTime: duration.minutes(20),
    crossTime: duration.minutes(20),
    pretrialEnabled: false,
    pretrialTime: duration.minutes(0),
    statementTime: duration.minutes(0), // statements are separated
    reexaminationsEnabled: false,
  },
};

const SETTINGS_KEY = 'settings';
const SETTINGS_SCHEMA_VERSION_KEY = 'settings_schema_version';
const SETTINGS_SCHEMA_VERSION = '1.2.0';

export async function getSettings(): Promise<Settings> {
  return getStorageItem({
    key: SETTINGS_KEY,
    schemaVersionKey: SETTINGS_SCHEMA_VERSION_KEY,
    currentSchemaVersion: SETTINGS_SCHEMA_VERSION,
    migrations: settingsMigrations,
    defaultValue: defaultSettings,
  });
}

export async function setSettings(newSettings: Partial<Settings>) {
  const settings = await getSettings();
  const updatedSettings = { ...settings, ...newSettings };
  await AsyncStorage.setItem(
    SETTINGS_SCHEMA_VERSION_KEY,
    SETTINGS_SCHEMA_VERSION,
  );
  await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(updatedSettings));

  return updatedSettings;
}

export async function setLeague(league: League) {
  const settings = await getSettings();
  const updatedSettings = {
    ...settings,
    league: { league: league },
    // TODO: maybe warn if any settings are already overriden from the default?
    setup: {
      ...settings.setup,
      ...leagueSetupOverrides[league],
    },
  };

  return setSettings(updatedSettings);
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
