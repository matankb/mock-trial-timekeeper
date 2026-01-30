import { Side } from '../types/side';
import { KeysWithTrue } from '../utils';
import { CaseType, createAlternatingCaseTypeResolver } from './case-type';

/**
 * League constants and features
 */

export enum League {
  AMTA = 'amta',
  Minnesota = 'minnesota',
  Florida = 'florida',
  Idaho = 'idaho',
}

export const leagueNames: Record<League, string> = {
  [League.AMTA]: 'College Mock Trial',
  [League.Minnesota]: 'Minnesota High School Mock Trial',
  [League.Florida]: 'Florida High School Mock Trial',
  [League.Idaho]: 'Idaho High School Mock Trial',
};

export enum LeagueFeature {
  TIMES_BREAKDOWN = 'times-breakdown',
  TEAM_ACCOUNTS = 'team-accounts',
  WITNESS_SELECTION = 'witness-selection',
  SHOW_OVERTIME = 'overtime',
}

export const leagueFeatures: Record<League, Record<LeagueFeature, boolean>> = {
  [League.AMTA]: {
    [LeagueFeature.TIMES_BREAKDOWN]: true,
    [LeagueFeature.TEAM_ACCOUNTS]: true,
    [LeagueFeature.WITNESS_SELECTION]: true,
    [LeagueFeature.SHOW_OVERTIME]: false,
  },
  [League.Minnesota]: {
    [LeagueFeature.TIMES_BREAKDOWN]: false,
    [LeagueFeature.TEAM_ACCOUNTS]: false,
    [LeagueFeature.WITNESS_SELECTION]: false,
    [LeagueFeature.SHOW_OVERTIME]: false,
  },
  [League.Florida]: {
    [LeagueFeature.TIMES_BREAKDOWN]: true,
    [LeagueFeature.TEAM_ACCOUNTS]: false,
    [LeagueFeature.WITNESS_SELECTION]: true,
    [LeagueFeature.SHOW_OVERTIME]: false,
  },
  [League.Idaho]: {
    [LeagueFeature.TIMES_BREAKDOWN]: true,
    [LeagueFeature.TEAM_ACCOUNTS]: false, // TODO: enable team accounts for Idaho
    [LeagueFeature.WITNESS_SELECTION]: true,
    [LeagueFeature.SHOW_OVERTIME]: true,
  },
} as const satisfies Record<League, Record<LeagueFeature, boolean>>;

export const leagueWitnesses: Record<
  LeaguesWithWitnessSelection,
  LeagueWitnessSet
> = {
  [League.AMTA]: {
    p: ['Riley Kaye', 'Atlas Hartley', 'Taren Rivera', 'Rowan Patel'],
    d: ['Charlie Martin', 'Grey Marlowe', 'Micah Lin'],
    swing: ['Nel Doos', 'Indigo Quade', 'Taylor Jha', 'Lennox Reynolds'],
  },
  [League.Florida]: {
    p: ['Cheyenne Overstone', 'Cal Herron', 'Bobbie Chaney'],
    d: ['Ray Addison', 'Brit Tomlinson', 'Tate Eastbrook'],
    swing: [], // no swing witnesses in FL
  },
  [League.Idaho]: {
    p: ['Sloane Wilder', 'Brussell McKay', 'Alva Snorkelsson'],
    d: ['Rudy Carnap', 'Casey Kowalski', 'Jordan Ellis'],
    swing: [], // no swing witnesses in Idaho // TODO: this needs to be typed so that not having p, d, or swing is an error
  },
};

export const leagueCaseType: Record<League, (date: Date) => CaseType> = {
  [League.AMTA]: createAlternatingCaseTypeResolver(2023, CaseType.Civil),
  [League.Minnesota]: () => CaseType.Criminal, // obviously need to check this
  [League.Florida]: createAlternatingCaseTypeResolver(2025, CaseType.Civil), // TODO: check this too
  [League.Idaho]: () => CaseType.Civil, // TODO: get the update schedule - I know it's civil this year
};

/**
 * Type helpers
 */

type LeaguesWithWitnessSelection = KeysWithTrue<
  typeof leagueFeatures,
  LeagueFeature.WITNESS_SELECTION
>;

export const isLeagueWithWitnessSelection = (
  league: League,
): league is LeaguesWithWitnessSelection => {
  return (
    league in leagueFeatures &&
    leagueFeatures[league][LeagueFeature.WITNESS_SELECTION]
  );
};

export type LeagueWitnessSet = Record<Side | 'swing', string[]>;
