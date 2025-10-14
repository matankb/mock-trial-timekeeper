import {
  NativeStackNavigationOptions,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import React, { FC, useContext } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import AirplaneModeWarning from './AirplaneModeWarning';
import AndroidMessage from './AndroidMessage';
import { HomeHeaderIconLeft, HomeHeaderIconRight } from './HomeHeaderIcons';
import SwingTimingMessage from './SwingTimingMessage';
import TrialsList from './TrialsList';
import { RouteProps } from '../../Navigation';
import { BETA_TEST_FORM_URL } from '../../constants/external-urls';
import { ScreenName } from '../../constants/screen-names';
import { TrialsContext } from '../../context/TrialsContext';
import { Trial } from '../../controllers/trial';
import Button from '../Button';

type HomeProps = NativeStackScreenProps<RouteProps, ScreenName.HOME>;

export const homeScreenOptions = (): NativeStackNavigationOptions => ({
  title: 'Mock Trial Timekeeper',
  headerTitleAlign: 'center',
});

const MAX_DISPLAYED_TRIALS = 9;

const Home: FC<HomeProps> = ({ navigation, route }) => {
  const [trials] = useContext(TrialsContext);

  const handleTrialSelect = (trial: Trial) => {
    navigation.navigate(ScreenName.TRIAL_MANAGER, {
      trialId: trial.id,
      trialName: trial.name, // name included to set as header title
    });
  };

  // This is a workaround to prevent a known issue
  // Ideally, options would be set in homeScreenOptions
  // see: https://github.com/react-navigation/react-navigation/issues/8657
  const setHeaderButtons = () => {
    navigation.setOptions({
      headerLeft: () => (
        <HomeHeaderIconLeft navigation={navigation} route={route} />
      ),
      headerRight: () => (
        <HomeHeaderIconRight navigation={navigation} route={route} />
      ),
    });
  };

  if (!trials) {
    return;
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      onLayout={() => setHeaderButtons()}
    >
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
      <View>
        <AndroidMessage onPress={() => Linking.openURL(BETA_TEST_FORM_URL)} />
        <SwingTimingMessage
          onPress={() => navigation.navigate(ScreenName.SWING_TIMING_EXPLAINER)}
        />
        <AirplaneModeWarning />
      </View>
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
