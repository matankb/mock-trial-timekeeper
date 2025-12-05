import { League } from '../constants/leagues';
import { Settings, SettingsTheme } from '../controllers/settings';
import { duration } from '../utils';
import { createMigration } from './migration';

interface SettingsSchema_1_0_0 {
  theme: string;
  setup: {
    statementTime: number;
    directTime: number;
    crossTime: number;
    allLoss: number;
    pretrialEnabled: boolean;
    statementsCombined: boolean;
    pretrialTime: number | null;
    openTime: number | null;
    closeTime: number | null;
    statementsSeparate: boolean;
    allLossEnabled: boolean;
  };
}

interface SettingsSchema_1_1_0 {
  theme: string;
  setup: {
    statementTime: number;
    directTime: number;
    crossTime: number;
    allLoss: number;
    pretrialEnabled: boolean;
    statementsCombined: boolean;
    pretrialTime: number | null;
    openTime: number | null;
    closeTime: number | null;
    statementsSeparate: boolean;
    allLossEnabled: boolean;
  };
  schoolAccount: {
    connected: boolean;
    teamId: string | null;
  };
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type -- This is the current schema
interface SettingsSchema_1_2_0 extends Settings {}

export const settingsMigrations = [
  createMigration<SettingsSchema_1_0_0, SettingsSchema_1_1_0>({
    from: '1.0.0',
    to: '1.1.0',
    migrate: (settings) => {
      return {
        ...settings,
        schoolAccount: {
          connected: false,
          teamId: null,
        },
      };
    },
  }),
  createMigration<SettingsSchema_1_1_0, SettingsSchema_1_2_0>({
    from: '1.1.0',
    to: '1.2.0',
    migrate: (settings) => {
      return {
        ...settings,
        setup: {
          ...settings.setup,
          pretrialTime: settings.setup.pretrialTime ?? duration.minutes(5),
          openTime: settings.setup.openTime ?? duration.minutes(7),
          closeTime: settings.setup.closeTime ?? duration.minutes(7),
          allLossEnabled: settings.setup.allLossEnabled,
          rebuttalMaxEnabled: false,
          rebuttalMaxTime: duration.minutes(3),
          jointPrepClosingsEnabled: false,
          jointConferenceEnabled: false,
          jointPrepClosingsTime: duration.minutes(2),
          jointConferenceTime: duration.minutes(2),
        },
        additionalSetup: {
          allLossDuration: duration.hours(3),
        },
        theme: settings.theme as SettingsTheme,
        league: {
          // if we are migrating (e.g., the user has already used the app),
          // set the league to AMTA, since that was the default/only league at the time,
          // so that users don't have to select the league again
          league: League.AMTA,
        },
      };
    },
  }),
];
