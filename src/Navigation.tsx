import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
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
import SwingTimingExplainer, {
  swingTimingExplainerScreenOptions,
} from './components/About/SwingTimingExplainer';
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
import TimeReport, {
  timeReportScreenOptions,
} from './components/TimeReport/TimeReport';
import TimesBreakdown, {
  TimeBreakdownRouteProps,
  timesBreakdownScreenOptions,
} from './components/TimesBreakdown/TimesBreakdown';
import TrialManager, {
  TrialManagerRouteProps,
  trialManagerScreenOptions,
} from './components/TrialManager/TrialManager';
import {
  TeamAccountPopup,
  teamAccountPopupScreenOptions,
} from './components/Home/Promos/TeamAccountPopup';

import {
  TeamTrials,
  teamTrialsScreenOptions,
} from './components/Home/TeamTrials';
import TeamTimesBreakdown, {
  TeamTimesBreakdownRouteProps,
  teamTimesBreakdownScreenOptions,
} from './components/TimesBreakdown/TeamTimesBreakdown';
import { ScreenNavigationOptions, ScreenProps } from './types/navigation';
import WitnessSelectorScreen, {
  witnessSelectorScreenOptions,
} from './components/CreateTrial/TrialDetails/WitnessSelector/WitnessSelectorScreen';

const Stack = createNativeStackNavigator<RouteProps>();

export type RouteProps = {
  // Home
  [ScreenName.HOME]: undefined;
  [ScreenName.ALL_TRIALS]: undefined;
  [ScreenName.TEAM_TRIALS]: undefined;
  // Trial Manager
  [ScreenName.TRIAL_MANAGER]: TrialManagerRouteProps;
  [ScreenName.TIMES_BREAKDOWN]: TimeBreakdownRouteProps;
  [ScreenName.TEAM_TIMES_BREAKDOWN]: TeamTimesBreakdownRouteProps;
  [ScreenName.TIMEKEEPER_REPORT]: TimeBreakdownRouteProps;
  // About
  [ScreenName.ABOUT]: undefined;
  [ScreenName.DISCLAIMER]: undefined;
  [ScreenName.AMTA_POLICY]: undefined;
  [ScreenName.SWING_TIMING_EXPLAINER]: undefined;
  [ScreenName.TEAM_ACCOUNT_POPUP]: undefined;
  // Settings
  [ScreenName.SETTINGS]: undefined;
  [ScreenName.SCHOOL_ACCOUNT_LOGIN]: undefined;
  // Create Trial
  [ScreenName.CREATE_TRIAL]: undefined;
  [ScreenName.UPDATE_TRIAL]: UpdateTrialRouteProps;
  [ScreenName.WITNESS_SELECTOR]: undefined;
  [ScreenName.TOURNAMENT_SELECTOR]: undefined;
};

type ScreenConfiguration = {
  [Screen in ScreenName]: {
    name: Screen;
    component: FC<ScreenProps<Screen>>;
    options: ScreenNavigationOptions<Screen>;
  };
}[ScreenName];

const Navigation = () => {
  const theme = useTheme();
  const navigationTheme = theme === Theme.DARK ? DarkTheme : DefaultTheme;
  const statusBarTheme = theme === Theme.DARK ? 'light' : 'dark';

  /* prettier-ignore */

  const screens: ScreenConfiguration[] = [
    // Home
    { name: ScreenName.HOME, component: Home, options: homeScreenOptions },
    { name: ScreenName.ALL_TRIALS, component: AllTrials, options: allTrialsScreenOptions },
    { name: ScreenName.TEAM_TRIALS, component: TeamTrials, options: teamTrialsScreenOptions },

    // Trial Manager
    { name: ScreenName.TRIAL_MANAGER, component: TrialManager, options: trialManagerScreenOptions },
    { name: ScreenName.TIMES_BREAKDOWN, component: TimesBreakdown, options: timesBreakdownScreenOptions },
    { name: ScreenName.TIMEKEEPER_REPORT, component: TimeReport, options: timeReportScreenOptions },
    { name: ScreenName.TEAM_TIMES_BREAKDOWN, component: TeamTimesBreakdown, options: teamTimesBreakdownScreenOptions },

    // Settings
    { name: ScreenName.SETTINGS, component: Settings, options: settingsScreenOptions },
    { name: ScreenName.SCHOOL_ACCOUNT_LOGIN, component: SchoolAccountLogin, options: schoolAccountLoginScreenOptions },

    // About
    { name: ScreenName.ABOUT, component: About, options: aboutScreenOptions },
    { name: ScreenName.DISCLAIMER, component: Disclaimer, options: disclaimerScreenOptions },
    { name: ScreenName.SWING_TIMING_EXPLAINER, component: SwingTimingExplainer, options: swingTimingExplainerScreenOptions },
    { name: ScreenName.AMTA_POLICY, component: AMTAPolicy, options: amtaPolicyScreenOptions },
    { name: ScreenName.TEAM_ACCOUNT_POPUP, component: TeamAccountPopup, options: teamAccountPopupScreenOptions },

    // Create Trial
    { name: ScreenName.CREATE_TRIAL, component: CreateTrial, options: createTrialScreenOptions },
    { name: ScreenName.UPDATE_TRIAL, component: UpdateTrial, options: updateTrialScreenOptions },
    { name: ScreenName.WITNESS_SELECTOR, component: WitnessSelectorScreen, options: witnessSelectorScreenOptions },
    { name: ScreenName.TOURNAMENT_SELECTOR, component: TournamentSelector, options: tournamentSelectorScreenOptions },
  ];

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
