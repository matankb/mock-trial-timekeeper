import {
  DarkTheme,
  DefaultTheme,
  DocumentTitleOptions,
  NavigationContainer,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { setStatusBarStyle, StatusBar } from 'expo-status-bar';
import React, { FC } from 'react';

import { ScreenName } from './constants/screen-names';
import { Theme } from './types/theme';
import useTheme from './hooks/useTheme';

import AMTAPolicy, {
  amtaPolicyScreenOptions,
} from './components/About/AMTAPolicy';
import About, { aboutScreenOptions } from './components/About/About';
import Disclaimer, {
  disclaimerScreenOptions,
} from './components/About/Disclaimer';
import CreateTrial, {
  createTrialScreenOptions,
} from './components/CreateTrial/CreateTrial';
import TournamentSelector, {
  tournamentSelectorScreenOptions,
} from './components/CreateTrial/TrialDetails/TournamentSelector/TournamentSelector';
import UpdateTrial, {
  UpdateTrialRouteProps,
  updateTrialScreenOptions,
} from './components/CreateTrial/UpdateTrial';
import AllTrials, { allTrialsScreenOptions } from './components/Home/AllTrials';
import Home, { homeScreenOptions } from './components/Home/Home';
import SchoolAccountLogin, {
  schoolAccountLoginScreenOptions,
} from './components/Settings/SchoolAccount/SchoolAccountLogin';
import Settings, {
  settingsScreenOptions,
} from './components/Settings/Settings';
import TimesBreakdown, {
  TimeBreakdownRouteProps,
  timesBreakdownScreenOptions,
} from './components/TimesBreakdown/TimesBreakdown';
import TrialManager, {
  TrialManagerRouteProps,
  trialManagerScreenOptions,
} from './components/TrialManager/TrialManager';
import TeamTimesBreakdown, {
  TeamTimesBreakdownRouteProps,
  teamTimesBreakdownScreenOptions,
} from './components/TimesBreakdown/TeamTimesBreakdown';
import { ScreenNavigationOptions, ScreenProps } from './types/navigation';
import WitnessSelectorScreen, {
  witnessSelectorScreenOptions,
} from './components/CreateTrial/TrialDetails/WitnessSelector/WitnessSelectorScreen';
import Welcome, { welcomeScreenOptions } from './components/Welcome/Welcome';
import LeagueSelectionScreen, {
  leagueSelectionScreenOptions,
} from './components/Settings/LeagueSettings/LeagueSelectionScreen';
import SetupSettings, {
  setupSettingsScreenOptions,
} from './components/Settings/SetupSettings';
import { Version, versionScreenOptions } from './components/About/Version';
import TeamAccountExplainer, {
  teamAccountExplainerScreenOptions,
} from './components/About/TeamAccountExplainer';
import TeamAccountHowItWorks, {
  TeamAccountHowItWorksRouteProps,
  teamAccountHowItWorksScreenOptions,
} from './components/About/TeamAccountHowItWorks';
import TeamAccountSignup, {
  teamAccountSignupScreenOptions,
} from './components/About/TeamAccountSignup';
import {
  TeamTrials,
  teamTrialsScreenOptions,
} from './components/Home/TeamTrials';
import SchoolAccountManager, {
  schoolAccountManagerScreenOptions,
} from './components/Settings/SchoolAccount/SchoolAccountManager';
import { Platform } from 'react-native';

const Stack = createNativeStackNavigator<RouteProps>();

export type RouteProps = {
  // Home
  [ScreenName.HOME]: undefined;
  [ScreenName.ALL_TRIALS]: undefined;
  [ScreenName.WELCOME]: undefined;
  [ScreenName.TEAM_TRIALS]: undefined;

  // Trial Manager
  [ScreenName.TRIAL_MANAGER]: TrialManagerRouteProps;
  [ScreenName.TIMES_BREAKDOWN]: TimeBreakdownRouteProps;
  [ScreenName.TEAM_TIMES_BREAKDOWN]: TeamTimesBreakdownRouteProps;

  // About
  [ScreenName.ABOUT]: undefined;
  [ScreenName.DISCLAIMER]: undefined;
  [ScreenName.AMTA_POLICY]: undefined;
  [ScreenName.TEAM_ACCOUNT_EXPLAINER]: undefined;
  [ScreenName.TEAM_ACCOUNT_HOW_IT_WORKS]: TeamAccountHowItWorksRouteProps;
  [ScreenName.TEAM_ACCOUNT_SIGNUP]: undefined;
  [ScreenName.VERSION]: undefined;

  // Settings
  [ScreenName.SETTINGS]: undefined;
  [ScreenName.SETUP_SETTINGS]: undefined;
  [ScreenName.SCHOOL_ACCOUNT_LOGIN]: undefined;
  [ScreenName.LEAGUE_SELECTION]: undefined;
  [ScreenName.SCHOOL_ACCOUNT_MANAGER]: undefined;

  // Create Trial
  [ScreenName.CREATE_TRIAL]: undefined;
  [ScreenName.UPDATE_TRIAL]: UpdateTrialRouteProps;
  [ScreenName.WITNESS_SELECTOR]: undefined;
  [ScreenName.TOURNAMENT_SELECTOR]: undefined;
};

type ScreenConfiguration = {
  [Screen in keyof RouteProps]: {
    name: Screen;
    component: FC<ScreenProps<Screen>>;
    options: ScreenNavigationOptions<Screen>;
  };
}[keyof RouteProps];

const Navigation = () => {
  const theme = useTheme();
  const navigationTheme = theme === Theme.DARK ? DarkTheme : DefaultTheme;
  const statusBarTheme = theme === Theme.DARK ? 'light' : 'dark';
  const statusBarBackgroundColor = theme === Theme.DARK ? 'black' : 'white'; // android-only

  /* prettier-ignore */

  const screens: ScreenConfiguration[] = [
    // Home
    { name: ScreenName.HOME, component: Home, options: homeScreenOptions },
    { name: ScreenName.ALL_TRIALS, component: AllTrials, options: allTrialsScreenOptions },
    { name: ScreenName.WELCOME, component: Welcome, options: welcomeScreenOptions },
    { name: ScreenName.TEAM_TRIALS, component: TeamTrials, options: teamTrialsScreenOptions },

    // Trial Manager
    { name: ScreenName.TRIAL_MANAGER, component: TrialManager, options: trialManagerScreenOptions },
    { name: ScreenName.TIMES_BREAKDOWN, component: TimesBreakdown, options: timesBreakdownScreenOptions },
    { name: ScreenName.TEAM_TIMES_BREAKDOWN, component: TeamTimesBreakdown, options: teamTimesBreakdownScreenOptions },

    // Settings
    { name: ScreenName.SETTINGS, component: Settings, options: settingsScreenOptions },
    { name: ScreenName.SCHOOL_ACCOUNT_LOGIN, component: SchoolAccountLogin, options: schoolAccountLoginScreenOptions },
    { name: ScreenName.LEAGUE_SELECTION, component: LeagueSelectionScreen, options: leagueSelectionScreenOptions },
    { name: ScreenName.SETUP_SETTINGS, component: SetupSettings, options: setupSettingsScreenOptions },
    { name: ScreenName.SCHOOL_ACCOUNT_MANAGER, component: SchoolAccountManager, options: schoolAccountManagerScreenOptions }, 

    // About
    { name: ScreenName.ABOUT, component: About, options: aboutScreenOptions },
    { name: ScreenName.DISCLAIMER, component: Disclaimer, options: disclaimerScreenOptions },
    { name: ScreenName.AMTA_POLICY, component: AMTAPolicy, options: amtaPolicyScreenOptions },
    { name: ScreenName.VERSION, component: Version, options: versionScreenOptions },

    // Team Accounts
    { name: ScreenName.TEAM_ACCOUNT_EXPLAINER, component: TeamAccountExplainer, options: teamAccountExplainerScreenOptions },
    { name: ScreenName.TEAM_ACCOUNT_HOW_IT_WORKS, component: TeamAccountHowItWorks, options: teamAccountHowItWorksScreenOptions },
    { name: ScreenName.TEAM_ACCOUNT_SIGNUP, component: TeamAccountSignup, options: teamAccountSignupScreenOptions },

    // Create Trial
    { name: ScreenName.CREATE_TRIAL, component: CreateTrial, options: createTrialScreenOptions },
    { name: ScreenName.UPDATE_TRIAL, component: UpdateTrial, options: updateTrialScreenOptions },
    { name: ScreenName.WITNESS_SELECTOR, component: WitnessSelectorScreen, options: witnessSelectorScreenOptions },
    { name: ScreenName.TOURNAMENT_SELECTOR, component: TournamentSelector, options: tournamentSelectorScreenOptions },
  ];

  // Format title for web
  const pageTitleFormatter: DocumentTitleOptions['formatter'] = (options) => {
    const pageTitle = options?.title;

    if (
      !pageTitle ||
      typeof pageTitle !== 'string' ||
      pageTitle === 'Mock Trial Timer'
    ) {
      return 'Mock Trial Timer';
    }

    return `${options?.title} - Mock Trial Timer`;
  };

  return (
    <NavigationContainer theme={navigationTheme}>
      <StatusBar style={statusBarTheme} />
      <Stack.Navigator id={undefined} initialRouteName={ScreenName.HOME}>
        {screens.map(({ name, component, options }) => (
          <Stack.Screen
            key={name}
            // @ts-ignore -- TODO: fix this
            name={name}
            // @ts-ignore -- TODO: fix this
            options={options}
            // @ts-ignore -- TODO: fix this
            component={component}
          />
        ))}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
