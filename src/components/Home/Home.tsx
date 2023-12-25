import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as SplashScreen from 'expo-splash-screen';
import React, { FC, useContext, useEffect } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import AirplaneModeWarning from './AirplaneModeWarning';
import HomeHeaderIcon from './HomeHeaderIcon';
import TrialsList from './TrialsList';
import { RouteProps } from '../../App';
import { ScreenName } from '../../constants/screen-names';
import { TrialsContext } from '../../context/TrialsContext';
import { Trial, getTrialsFromStorage } from '../../controllers/trial';
import Button from '../Button';

type HomeProps = NativeStackScreenProps<RouteProps, ScreenName.HOME>;

export const homeScreenOptions = ({ navigation, route }) => ({
  title: 'Mock Trial Timekeeper',
  headerLeft: () => <HomeHeaderIcon navigation={navigation} route={route} />,
});

const MAX_DISPLAYED_TRIALS = 9;

const Home: FC<HomeProps> = ({ navigation }) => {
  const [trials, setTrials] = useContext(TrialsContext);

  const handleTrialSelect = (trial: Trial) => {
    navigation.navigate(ScreenName.TRIAL_MANAGER, {
      trialId: trial.id,
      trialName: trial.name, // name included to set as header title
    });
  };

  useEffect(() => {
    if (!trials) {
      getTrialsFromStorage().then((trials) => {
        setTrials(trials);
        SplashScreen.hideAsync();
      });
    }
  }, [trials]);

  if (!trials) {
    return;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View>
        <TrialsList
          trials={trials
            .sort((a, b) => b.date - a.date)
            .slice(0, MAX_DISPLAYED_TRIALS)}
          handleSelect={handleTrialSelect}
          showAllTrialsLink={trials.length > MAX_DISPLAYED_TRIALS}
          onAllTrialsPress={() => navigation.navigate(ScreenName.ALL_TRIALS)}
        />
        <Button
          title="New Trial"
          onPress={() => navigation.navigate(ScreenName.CREATE_TRIAL)}
        />
      </View>
      <AirplaneModeWarning />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingTop: 10,
    paddingBottom: 40,
    height: '100%',
  },
});

export default Home;
