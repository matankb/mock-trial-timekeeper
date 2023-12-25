import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { FC, useContext } from 'react';
import { ScrollView } from 'react-native';

import TrialsList from './TrialsList';
import { RouteProps } from '../../App';
import { ScreenName } from '../../constants/screen-names';
import { TrialsContext } from '../../context/TrialsContext';
import { Trial } from '../../controllers/trial';

type AllTrialsProps = NativeStackScreenProps<RouteProps, ScreenName.ALL_TRIALS>;

export const allTrialsScreenOptions = {
  title: 'All Trials',
  headerBackTitle: 'Home',
};

const AllTrials: FC<AllTrialsProps> = ({ navigation }) => {
  const [trials] = useContext(TrialsContext);

  const handleTrialSelect = (trial: Trial) => {
    navigation.navigate(ScreenName.TRIAL_MANAGER, {
      trialId: trial.id,
      trialName: trial.name, // name included to set as header title
    });
  };

  return (
    <ScrollView>
      <TrialsList
        trials={trials}
        showAllTrialsLink={false}
        handleSelect={handleTrialSelect}
      />
    </ScrollView>
  );
};

export default AllTrials;
