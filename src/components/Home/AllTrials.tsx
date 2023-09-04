import { NavigationProp } from '@react-navigation/native';
import React, { FC, useContext } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';

import TrialsList from './TrialsList';
import { TrialsContext } from '../../context/TrialsContext';
import { Trial } from '../../controllers/trial';

interface AllTrialsProps {
  navigation: NavigationProp<any>;
}

const AllTrials: FC<AllTrialsProps> = ({ navigation }) => {
  const [trials] = useContext(TrialsContext);

  const handleTrialSelect = (trial: Trial) => {
    navigation.navigate('TrialManager', {
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

const styles = StyleSheet.create({});
export default AllTrials;
