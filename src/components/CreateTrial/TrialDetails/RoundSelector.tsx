import { useState } from 'react';

import TrialDetailsItem from './TrialDetailsItem';
import Picker from '../../Picker';
import { RoundNumber } from '../../../types/round-number';

interface RoundSelectorProps {
  round: RoundNumber | null;
  onSelect: (round: RoundNumber) => void;
  warning?: boolean;
}

interface RoundOption {
  label: string;
  value: RoundNumber;
}

// Enforce that all round numbers are represented in the options
type RoundOptions = { [K in RoundNumber]: RoundOption };

// Since round options will never change, this constant can be set outside the component
const roundOptions: RoundOptions = {
  1: { label: 'Round 1', value: 1 },
  2: { label: 'Round 2', value: 2 },
  3: { label: 'Round 3', value: 3 },
  4: { label: 'Round 4', value: 4 },
};
const roundOptionsArray = Object.values(roundOptions);

const RoundSelector = ({ round, onSelect, warning }: RoundSelectorProps) => {
  const [open, setOpen] = useState(false);

  return [
    <TrialDetailsItem
      key="round-selector"
      title="Round"
      value={round ? `Round ${round}` : 'Not Set'}
      onPress={() => setOpen(true)}
      warning={warning}
    />,
    <Picker
      key="round-picker"
      title="Select Round"
      items={roundOptionsArray}
      selected={round}
      onSelect={onSelect}
      onClose={() => setOpen(false)}
      visible={open}
    />,
  ];
};

export default RoundSelector;
