import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as SplashScreen from 'expo-splash-screen';
import { FC, useState } from 'react';

import AMTAPolicy from './src/components/About/AMTAPolicy';
import About from './src/components/About/About';
import Disclaimer from './src/components/About/Disclaimer';
import CreateTrial from './src/components/CreateTrial/CreateTrial';
import CreateTrialHeaderIcon from './src/components/CreateTrial/CreateTrialHeaderIcon';
import ErrorBoundary from './src/components/ErrorBoundary';
import AllTrials from './src/components/Home/AllTrials';
import Home from './src/components/Home/Home';
import HomeHeaderIcon from './src/components/Home/HomeHeaderIcon';
import TimesBreakdown from './src/components/TimesBreakdown/TimesBreakdown';
import TrialManager from './src/components/TrialManager/TrialManager';
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
              name="home"
              options={({ navigation }) => ({
                title: 'Mock Trial Timekeeper',
                headerLeft: () => <HomeHeaderIcon navigation={navigation} />,
              })}
              component={Home}
            />
            <Stack.Screen
              name="All_Trials"
              options={{
                title: 'All Trials',
                headerBackTitle: 'Home',
              }}
              component={AllTrials}
            />
            <Stack.Screen
              name="TrialManager"
              component={TrialManager}
              options={({ route }) => ({
                title: route.params.trialName,
                headerBackTitle: 'Home',
              })}
            />
            <Stack.Screen
              name="breakdown"
              options={({ route }) => ({
                title: `${route.params.trialName} Individual Times`,
                headerBackTitleVisible: false,
              })}
              component={TimesBreakdown}
            />
            <Stack.Screen
              name="About"
              options={{
                headerBackTitle: 'Home',
              }}
              component={About}
            />
            <Stack.Screen name="Disclaimer" component={Disclaimer} />
            <Stack.Screen
              name="AMTA_Policy"
              options={{ title: 'AMTA Policy' }}
              component={AMTAPolicy}
            />
            <Stack.Screen
              name="CreateTrial"
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
