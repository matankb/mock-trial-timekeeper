import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { FC, useContext, useMemo } from 'react';
import { StyleSheet } from 'react-native';

import RoundSelector from './RoundSelector';
import SideSelector from './SideSelector';
import TrialDetailsItem from './TrialDetailsItem';
import { ScreenName } from '../../../constants/screen-names';
import { CreateTrialContext } from '../../../context/CreateTrialContext';
import { Side } from '../../../types/side';
import CreateTrialSection from '../CreateTrialSection';

interface TrialDetailsProps {
  // General
  navigation: NativeStackNavigationProp<any, any>;

  // Trial Data
  side: Side | null;
  round: number | null;

  // UI
  showWarnings: boolean;
  tournamentLoading: boolean;

  // Callbacks
  setSide: (side: Side | null) => void;
  setRound: (round: number | null) => void;
}

const TrialDetails: FC<TrialDetailsProps> = ({
  navigation,
  side,
  round,
  setSide,
  setRound,
  showWarnings,
  tournamentLoading,
}) => {
  // State shared between screens, see CreateTrialContext.tsx for more information
  const [createTrialState] = useContext(CreateTrialContext);
  const { tournamentName, pWitnessCall, dWitnessCall } = createTrialState;

  const witnessSelectedCount = useMemo(() => {
    const selectedCount =
      pWitnessCall.filter((witness) => witness !== null).length +
      dWitnessCall.filter((witness) => witness !== null).length;

    return selectedCount;
  }, [pWitnessCall, dWitnessCall]);

  const witnessSelectorLabel = useMemo(() => {
    if (witnessSelectedCount === 6) {
      return 'All Witnesses Selected';
    } else if (witnessSelectedCount > 0) {
      const nounLabel = witnessSelectedCount > 1 ? 'Witnesses' : 'Witness';
      return `${witnessSelectedCount} ${nounLabel} Selected`;
    } else {
      return 'Not Set';
    }
  }, [witnessSelectedCount]);

  return (
    <CreateTrialSection title="Trial Details" color="#ff9500">
      <TrialDetailsItem
        title="Tournament"
        value={tournamentName || 'Not Set'}
        onPress={() => {
          navigation.navigate(ScreenName.TOURNAMENT_SELECTOR);
        }}
        warning={showWarnings && !tournamentName}
        loading={tournamentLoading}
      />
      <RoundSelector
        round={round}
        onSelect={setRound}
        warning={showWarnings && !round}
      />
      <SideSelector
        side={side}
        onSelect={setSide}
        warning={showWarnings && !side}
      />
      <TrialDetailsItem
        title="Witness Call"
        value={witnessSelectorLabel}
        onPress={() => {
          navigation.navigate(ScreenName.WITNESS_SELECTOR);
        }}
        warning={showWarnings && witnessSelectedCount !== 6}
      />
    </CreateTrialSection>
  );
};

export default TrialDetails;
