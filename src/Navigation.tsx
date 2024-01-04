import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

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
import AllTrials, { allTrialsScreenOptions } from './components/Home/AllTrials';
import Home, { homeScreenOptions } from './components/Home/Home';
import Settings, {
  settingsScreenOptions,
} from './components/Settings/Settings';
import SyncTrial, {
  SyncTrialRouteProps,
  syncTrialScreenOptions,
} from './components/SyncTrial/SyncTrial';
import TimesBreakdown, {
  TimeBreakdownRouteProps,
  timesBreakdownScreenOptions,
} from './components/TimesBreakdown/TimesBreakdown';
import TrialManager, {
  TrialManagerRouteProps,
  trialManagerScreenOptions,
} from './components/TrialManager/TrialManager';
import { ScreenName } from './constants/screen-names';
import { Theme } from './context/ThemeContext';
import useTheme from './hooks/useTheme';
import { StatusBar } from 'expo-status-bar';

const Stack = createNativeStackNavigator();

export type RouteProps = {
  [ScreenName.HOME]: undefined;
  [ScreenName.ABOUT]: undefined;
  [ScreenName.CREATE_TRIAL]: undefined;
  [ScreenName.ALL_TRIALS]: undefined;
  [ScreenName.SETTINGS]: undefined;
  [ScreenName.DISCLAIMER]: undefined;
  [ScreenName.AMTA_POLICY]: undefined;
  [ScreenName.TRIAL_MANAGER]: TrialManagerRouteProps;
  [ScreenName.SYNC_TRIAL]: SyncTrialRouteProps;
  [ScreenName.TIMES_BREAKDOWN]: TimeBreakdownRouteProps;
};

const Navigation = () => {
  const theme = useTheme();
  const navigationTheme = theme === Theme.DARK ? DarkTheme : DefaultTheme;
  const statusBarTheme = theme === Theme.DARK ? 'light' : 'dark';

  return (
    <NavigationContainer theme={navigationTheme}>
      <StatusBar style={statusBarTheme} />
      <Stack.Navigator initialRouteName={ScreenName.HOME}>
        <Stack.Screen
          name={ScreenName.HOME}
          options={homeScreenOptions}
          component={Home}
        />
        <Stack.Screen
          name={ScreenName.ALL_TRIALS}
          options={allTrialsScreenOptions}
          component={AllTrials}
        />
        <Stack.Screen
          name={ScreenName.TRIAL_MANAGER}
          component={TrialManager}
          options={trialManagerScreenOptions}
        />
        <Stack.Screen
          name={ScreenName.TIMES_BREAKDOWN}
          options={timesBreakdownScreenOptions}
          component={TimesBreakdown}
        />
        <Stack.Screen
          name={ScreenName.SETTINGS}
          options={settingsScreenOptions}
          component={Settings}
        />
        <Stack.Screen
          name={ScreenName.ABOUT}
          options={aboutScreenOptions}
          component={About}
        />
        <Stack.Screen
          name={ScreenName.DISCLAIMER}
          options={disclaimerScreenOptions}
          component={Disclaimer}
        />
        <Stack.Screen
          name={ScreenName.AMTA_POLICY}
          options={amtaPolicyScreenOptions}
          component={AMTAPolicy}
        />
        <Stack.Screen
          name={ScreenName.CREATE_TRIAL}
          options={createTrialScreenOptions}
          component={CreateTrial}
        />
        <Stack.Screen
          name={ScreenName.SYNC_TRIAL}
          options={syncTrialScreenOptions}
          component={SyncTrial}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
