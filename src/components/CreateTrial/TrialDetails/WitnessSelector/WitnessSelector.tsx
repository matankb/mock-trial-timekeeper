import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import React, { FC, useContext } from 'react';
import { View, StyleSheet, Platform } from 'react-native';

import WitnessSelectorCard from './WitnessSelectorCard';
import colors from '../../../../constants/colors';
import { CreateTrialContext } from '../../../../context/CreateTrialContext';
import { TrialWitnessCall } from '../../../../controllers/trial';
import { Side } from '../../../../types/side';
import LinkButton from '../../../LinkButton';

export const witnessSelectorScreenOptions = ({
  navigation,
}): NativeStackNavigationOptions => ({
  title: 'Select Witness',
  ...(Platform.OS === 'ios' && {
    presentation: 'modal',
    headerRight: () => (
      <LinkButton title="Done" onPress={() => navigation.goBack()} />
    ),
  }),
});

interface WitnessSelectorProps {
  inline?: boolean;
}

const WitnessSelector: FC<WitnessSelectorProps> = ({ inline }) => {
  const [createTrialState, setCreateTrialState] =
    useContext(CreateTrialContext);

  const { pWitnessCall, dWitnessCall } = createTrialState;

  // Given an existing witness call, generate a new witness call with the new witness
  const generateWitnessCall = (
    call: TrialWitnessCall,
    position: number,
    witness: string,
  ): TrialWitnessCall => {
    const newCall: TrialWitnessCall = [...call];
    newCall[position] = witness;
    return newCall;
  };

  const handleWitnessSelect = (
    side: Side,
    position: number,
    witness: string,
  ) => {
    if (side === 'p') {
      setCreateTrialState((oldState) => {
        const newState = { ...oldState };
        newState.pWitnessCall = generateWitnessCall(
          oldState.pWitnessCall,
          position,
          witness,
        );
        return newState;
      });
    } else if (side === 'd') {
      setCreateTrialState((oldState) => {
        const newState = { ...oldState };
        const newDWitnessCall: [string, string, string] = [
          newState.dWitnessCall[0],
          newState.dWitnessCall[1],
          newState.dWitnessCall[2],
        ];
        newDWitnessCall[position] = witness;
        newState.dWitnessCall = newDWitnessCall;
        return newState;
      });
    }
  };

  return (
    <View style={[styles.container, inline && styles.containerInline]}>
      <WitnessSelectorCard
        side="p"
        color={colors.RED}
        witnesses={pWitnessCall}
        onWitnessSelect={handleWitnessSelect}
        inline={inline}
      />
      <WitnessSelectorCard
        side="d"
        color={colors.BLUE}
        witnesses={dWitnessCall}
        onWitnessSelect={handleWitnessSelect}
        inline={inline}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 10,
  },
  containerInline: {
    gap: 0,
  },
});

export default WitnessSelector;
