import { useState } from 'react';

import TrialDetailsItem from './TrialDetailsItem';
import Picker from '../../Picker';

interface RoundSelectorProps {
  round: number | null;
  onSelect: (round: number) => void;
  warning?: boolean;
}

const RoundSelector = ({ round, onSelect, warning }: RoundSelectorProps) => {
  const [open, setOpen] = useState(false);

  const roundOptions = [
    { label: 'Round 1', value: 1 },
    { label: 'Round 2', value: 2 },
    { label: 'Round 3', value: 3 },
    { label: 'Round 4', value: 4 },
  ];

  return [
    <TrialDetailsItem
      title="Round"
      value={round ? `Round ${round}` : 'Not Set'}
      onPress={() => setOpen(true)}
      warning={warning}
    />,
    <Picker
      title="Select Round"
      items={roundOptions}
      selected={round}
      onSelect={onSelect}
      onClose={() => setOpen(false)}
      visible={open}
    />,
  ];
};

export default RoundSelector;
