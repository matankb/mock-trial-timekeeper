import { NavigationProp } from '@react-navigation/native';
import * as SplashScreen from 'expo-splash-screen';
import React, { FC, useContext, useEffect } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import AirplaneModeWarning from './AirplaneModeWarning';
import TrialsList from './TrialsList';
import { TrialsContext } from '../../context/TrialsContext';
import { Trial, getTrialsFromStorage } from '../../controllers/trial';
import Button from '../Button';

interface HomeProps {
  navigation: NavigationProp<any>;
}

const MAX_TRIALS = 9;

const Home: FC<HomeProps> = ({ navigation }) => {
  const [trials, setTrials] = useContext(TrialsContext);

  const handleTrialSelect = (trial: Trial) => {
    navigation.navigate('TrialManager', {
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
          trials={trials.sort((a, b) => b.date - a.date).slice(0, MAX_TRIALS)}
          handleSelect={handleTrialSelect}
          showAllTrialsLink={trials.length > MAX_TRIALS}
          onAllTrialsPress={() => navigation.navigate('All_Trials')}
        />
        <Button
          title="New Trial"
          onPress={() => navigation.navigate('CreateTrial')}
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
