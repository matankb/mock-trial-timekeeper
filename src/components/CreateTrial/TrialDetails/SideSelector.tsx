import { useState } from 'react';

import TrialDetailsItem from './TrialDetailsItem';
import { Side } from '../../../types/side';
import { getSideName, piSideName } from '../../../utils';
import Picker from '../../Picker';

interface SideSelectorProps {
  side: Side | null;
  onSelect: (side: Side) => void;
  warning?: boolean;
}

interface SideOption {
  label: string;
  value: Side;
}

const SideSelector = ({ side, onSelect, warning }: SideSelectorProps) => {
  const [open, setOpen] = useState(false);

  const sideOptions: SideOption[] = [
    { label: piSideName, value: 'p' },
    { label: 'Defense', value: 'd' },
  ];

  const sideLabel = side ? getSideName(side) : null;
  const label = sideLabel ?? 'Not Set';

  return [
    <TrialDetailsItem
      key="selector"
      title="Side"
      value={label}
      onPress={() => setOpen(true)}
      warning={warning}
    />,
    <Picker
      key="picker"
      title="Select Side"
      items={sideOptions}
      selected={side ?? undefined}
      onSelect={onSelect}
      onClose={() => setOpen(false)}
      visible={open}
    />,
  ];
};

export default SideSelector;
