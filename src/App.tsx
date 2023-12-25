import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { registerRootComponent } from 'expo';
import * as SplashScreen from 'expo-splash-screen';
import { FC, useState } from 'react';
import { MenuProvider } from 'react-native-popup-menu';

import AMTAPolicy, {
  amtaPolicyScreenOptions,
} from './components/About/AMTAPolicy';
import About, { aboutScreenOptions } from './components/About/About';
import Disclaimer from './components/About/Disclaimer';
import CreateTrial, {
  createTrialScreenOptions,
} from './components/CreateTrial/CreateTrial';
import ErrorBoundary from './components/ErrorBoundary';
import AllTrials, { allTrialsScreenOptions } from './components/Home/AllTrials';
import Home, { homeScreenOptions } from './components/Home/Home';
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
import { TrialsContext } from './context/TrialsContext';
import { Trial } from './controllers/trial';

SplashScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator();

export type RouteProps = {
  [ScreenName.HOME]: undefined;
  [ScreenName.ABOUT]: undefined;
  [ScreenName.CREATE_TRIAL]: undefined;
  [ScreenName.ALL_TRIALS]: undefined;
  [ScreenName.TRIAL_MANAGER]: TrialManagerRouteProps;
  [ScreenName.SYNC_TRIAL]: SyncTrialRouteProps;
  [ScreenName.TIMES_BREAKDOWN]: TimeBreakdownRouteProps;
};

const App: FC = () => {
  const [trials, setTrials] = useState<Trial[]>(null);

  return (
    <ErrorBoundary>
      <MenuProvider>
        <NavigationContainer>
          <TrialsContext.Provider value={[trials, setTrials]}>
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
                name={ScreenName.ABOUT}
                options={aboutScreenOptions}
                component={About}
              />
              <Stack.Screen
                name={ScreenName.DISCLAIMER}
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
          </TrialsContext.Provider>
        </NavigationContainer>
      </MenuProvider>
    </ErrorBoundary>
  );
};

export default registerRootComponent(App);
