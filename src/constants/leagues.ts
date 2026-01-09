export enum League {
  AMTA = 'amta',
  Minnesota = 'minnesota',
  Florida = 'florida',
}

export const leagueNames: Record<League, string> = {
  [League.AMTA]: 'College Mock Trial',
  [League.Minnesota]: 'Minnesota High School Mock Trial',
  [League.Florida]: 'Florida High School Mock Trial',
};

export enum LeagueFeature {
  TIMES_BREAKDOWN = 'times-breakdown',
  TEAM_ACCOUNTS = 'team-accounts',
  WITNESS_SELECTION = 'witness-selection',
}

export const leagueFeatures: Record<League, Record<LeagueFeature, boolean>> = {
  [League.AMTA]: {
    [LeagueFeature.TIMES_BREAKDOWN]: true,
    [LeagueFeature.TEAM_ACCOUNTS]: true,
    [LeagueFeature.WITNESS_SELECTION]: true,
  },
  [League.Minnesota]: {
    [LeagueFeature.TIMES_BREAKDOWN]: false,
    [LeagueFeature.TEAM_ACCOUNTS]: false,
    [LeagueFeature.WITNESS_SELECTION]: false,
  },
  [League.Florida]: {
    [LeagueFeature.TIMES_BREAKDOWN]: true,
    [LeagueFeature.TEAM_ACCOUNTS]: false,
    [LeagueFeature.WITNESS_SELECTION]: false,
  },
};
