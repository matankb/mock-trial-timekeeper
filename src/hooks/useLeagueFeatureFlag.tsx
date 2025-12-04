import { LeagueFeature, leagueFeatures } from '../constants/leagues';
import { useSettingsLeague } from './useSettings';

/**
 * Returns a boolean indicating whether the feature is enabled for the current league.
 */
export const useLeagueFeatureFlag = (feature: LeagueFeature) => {
  const league = useSettingsLeague();

  return league && leagueFeatures[league][feature];
};
