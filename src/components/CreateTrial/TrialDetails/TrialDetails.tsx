import React, { useMemo, useState } from 'react';

import RoundSelector from './RoundSelector';
import SideSelector from './SideSelector';
import TrialDetailsItem from './TrialDetailsItem';
import { ScreenName } from '../../../constants/screen-names';
import { Side } from '../../../types/side';
import CreateTrialSection from '../CreateTrialSection';
import colors from '../../../constants/colors';
import { RoundNumber } from '../../../types/round-number';
import { useProvidedContext } from '../../../context/ContextProvider';
import { NavigationProp } from '../../../types/navigation';

interface TrialDetailsProps<Screen extends ScreenName> {
  // General
  navigation: NavigationProp<Screen>;

  // Trial Data
  side: Side | null;
  round: RoundNumber | null;

  // UI
  showWarnings: boolean;
  tournamentLoading: boolean;

  // Callbacks
  setSide: (side: Side | null) => void;
  setRound: (round: RoundNumber | null) => void;
}

const TrialDetails = <Screen extends ScreenName>({
  navigation,
  side,
  round,
  setSide,
  setRound,
  showWarnings,
  tournamentLoading,
}: TrialDetailsProps<Screen>) => {
  const [expandedSelector, setExpandedSelector] = useState<
    'round' | 'side' | null
  >(null);

  // State shared between screens, see CreateTrialContext.tsx for more information
  const {
    createTrial: { createTrialState },
  } = useProvidedContext();
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
      return `${witnessSelectedCount} of 6 Selected`;
    } else {
      return 'Not Set';
    }
  }, [witnessSelectedCount]);

  return (
    <CreateTrialSection title="Trial Details" color={colors.ORANGE}>
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
        expanded={expandedSelector === 'round'}
        onExpandChange={(expanded) =>
          setExpandedSelector(expanded ? 'round' : null)
        }
      />
      <SideSelector
        side={side}
        onSelect={setSide}
        warning={showWarnings && !side}
        expanded={expandedSelector === 'side'}
        onExpandChange={(expanded) =>
          setExpandedSelector(expanded ? 'side' : null)
        }
      />
      <TrialDetailsItem
        title="Witness Call"
        badge={
          showWarnings && witnessSelectedCount !== 6 ? 'Optional' : undefined
        }
        value={witnessSelectorLabel}
        onPress={() => {
          navigation.navigate(ScreenName.WITNESS_SELECTOR);
        }}
      />
    </CreateTrialSection>
  );
};

export default TrialDetails;
