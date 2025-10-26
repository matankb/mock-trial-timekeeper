import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { FC } from 'react';
import { ScrollView, StyleSheet } from 'react-native';

import TrialsList from './TrialsList/TrialsList';
import { RouteProps } from '../../Navigation';
import { ScreenName } from '../../constants/screen-names';
import { Trial } from '../../controllers/trial';
import { useProvidedContext } from '../../context/ContextProvider';
import { ScreenNavigationOptions } from '../../types/navigation';

type AllTrialsProps = NativeStackScreenProps<RouteProps, ScreenName.ALL_TRIALS>;

export const allTrialsScreenOptions: ScreenNavigationOptions<ScreenName.ALL_TRIALS> =
  {
    title: 'All Trials',
    headerBackTitle: 'Home',
  };

const AllTrials: FC<AllTrialsProps> = ({ navigation }) => {
  const {
    trials: { trials },
  } = useProvidedContext();

  const orderedTrials = trials?.sort((a, b) => b.date - a.date) ?? [];

  const handleTrialSelect = (trial: Trial) => {
    navigation.navigate(ScreenName.TRIAL_MANAGER, {
      trialId: trial.id,
      trialName: trial.name, // name included to set as header title
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TrialsList
        orderedTrials={orderedTrials}
        handleSelect={handleTrialSelect}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 30,
  },
});

export default AllTrials;
