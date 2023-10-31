import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as SplashScreen from 'expo-splash-screen';
import { FC, useState } from 'react';

import AMTAPolicy from './src/components/About/AMTAPolicy';
import About from './src/components/About/About';
import Disclaimer from './src/components/About/Disclaimer';
import Button from './src/components/Button';
import CreateTrial from './src/components/CreateTrial/CreateTrial';
import CreateTrialHeaderIcon from './src/components/CreateTrial/CreateTrialHeaderIcon';
import ErrorBoundary from './src/components/ErrorBoundary';
import AllTrials from './src/components/Home/AllTrials';
import Home from './src/components/Home/Home';
import HomeHeaderIcon from './src/components/Home/HomeHeaderIcon';
import TimesBreakdown from './src/components/TimesBreakdown/TimesBreakdown';
import TrialManager from './src/components/TrialManager/TrialManager';
import { ScreenName } from './src/constants/screen-names';
import { TrialsContext } from './src/context/TrialsContext';
import { Trial } from './src/controllers/trial';

SplashScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator();

const App: FC = () => {
  const [trials, setTrials] = useState<Trial[]>(null);

  return (
    <ErrorBoundary>
      <NavigationContainer>
        <TrialsContext.Provider value={[trials, setTrials]}>
          <Stack.Navigator>
            <Stack.Screen
              name={ScreenName.HOME}
              options={({ navigation }) => ({
                title: 'Mock Trial Timekeeper',
                headerLeft: () => <HomeHeaderIcon navigation={navigation} />,
              })}
              component={Home}
            />
            <Stack.Screen
              name={ScreenName.ALL_TRIALS}
              options={{
                title: 'All Trials',
                headerBackTitle: 'Home',
              }}
              component={AllTrials}
            />
            <Stack.Screen
              name={ScreenName.TRIAL_MANAGER}
              component={TrialManager}
              options={({ route }) => ({
                title: route.params.trialName,
                headerBackTitle: 'Home',
              })}
            />
            <Stack.Screen
              name={ScreenName.TIMES_BREAKDOWN}
              options={({ route }) => ({
                title: `${route.params.trialName} Individual Times`,
                headerBackTitleVisible: false,
                headerRight: () => <Button title="Edit" onPress={() => {}} />,
              })}
              component={TimesBreakdown}
            />
            <Stack.Screen
              name={ScreenName.ABOUT}
              options={{
                headerBackTitle: 'Home',
              }}
              component={About}
            />
            <Stack.Screen name={ScreenName.DISCLAIMER} component={Disclaimer} />
            <Stack.Screen
              name={ScreenName.AMTA_POLICY}
              options={{ title: 'AMTA Policy' }}
              component={AMTAPolicy}
            />
            <Stack.Screen
              name={ScreenName.CREATE_TRIAL}
              options={({ navigation }) => ({
                presentation: 'modal',
                title: 'Create Trial',
                headerLeft: () => (
                  <CreateTrialHeaderIcon navigation={navigation} />
                ),
              })}
              component={CreateTrial}
            />
          </Stack.Navigator>
        </TrialsContext.Provider>
      </NavigationContainer>
    </ErrorBoundary>
  );
};

export default App;
