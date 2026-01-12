import React, { FC } from 'react';
import { View, StyleSheet } from 'react-native';

import WitnessSelectorCard from './WitnessSelectorCard';
import colors from '../../../../constants/colors';
import { TrialWitnessCall } from '../../../../controllers/trial';
import { Side } from '../../../../types/side';
import { useProvidedContext } from '../../../../context/ContextProvider';
import { useSettingsLeague } from '../../../../hooks/useSettings';
import {
  isLeagueWithWitnessSelection,
  leagueWitnesses,
} from '../../../../constants/leagues';

interface WitnessSelectorProps {
  inline?: boolean;
}

const WitnessSelector: FC<WitnessSelectorProps> = ({ inline }) => {
  const {
    createTrial: { createTrialState, setCreateTrialState },
  } = useProvidedContext();
  const league = useSettingsLeague();

  // Loading state
  if (!league) {
    return null;
  }

  const { pWitnessCall, dWitnessCall } = createTrialState;

  // This should never happen, but fall back just in case.
  // TODO: maybe throw an error in dev?
  if (!isLeagueWithWitnessSelection(league)) {
    return null;
  }

  // Given an existing witness call, generate a new witness call with the new witness
  const generateWitnessCall = (
    call: TrialWitnessCall,
    position: number,
    witness: string | null,
  ): TrialWitnessCall => {
    const newCall: TrialWitnessCall = [...call];
    newCall[position] = witness;
    return newCall;
  };

  const handleWitnessSelect = (
    side: Side,
    position: number,
    witness: string | null,
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
        newState.dWitnessCall = generateWitnessCall(
          oldState.dWitnessCall,
          position,
          witness,
        );
        return newState;
      });
    }
  };

  return (
    <View style={[styles.container, inline && styles.containerInline]}>
      <WitnessSelectorCard
        side="p"
        color={colors.RED}
        leagueWitnesses={leagueWitnesses[league]}
        witnesses={pWitnessCall}
        onWitnessSelect={handleWitnessSelect}
        inline={inline}
      />
      <WitnessSelectorCard
        side="d"
        color={colors.BLUE}
        leagueWitnesses={leagueWitnesses[league]}
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
