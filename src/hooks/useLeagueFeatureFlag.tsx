import {
  League,
  leagueCaseType,
  LeagueFeature,
  leagueFeatures,
} from '../constants/leagues';
import { useSettingsLeague } from './useSettings';
import { CaseType } from '../constants/case-type';
import { Side } from '../types/side';

/**
 * Returns a boolean indicating whether the feature is enabled for the current league.
 */
export const useLeagueFeatureFlag = (feature: LeagueFeature) => {
  const league = useSettingsLeague();

  return league && leagueFeatures[league][feature];
};

// TODO: refactor league-related hooks into here

export function getSideName(side: Side, league: League, trialDate?: Date) {
  const date = trialDate ?? new Date();
  const caseType = leagueCaseType[league](date);
  const piSideName =
    caseType === CaseType.Criminal ? 'Prosecution' : 'Plaintiff';

  if (side === 'p') {
    return piSideName;
  } else if (side === 'd') {
    return 'Defense';
  }
  return 'Unknown Side';
}

export const useLeagueSideName = (side: Side, trialDate?: Date) => {
  const league = useSettingsLeague();

  // TODO: ugh figure this out
  if (!league) {
    return '';
  }

  const piSideName = getSideName(side, league, trialDate);
  return side === 'p' ? piSideName : 'Defense';
};
