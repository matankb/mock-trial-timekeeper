import { useState } from 'react';

import TrialDetailsItem from './TrialDetailsItem';
import { Side } from '../../../types/side';
import { getSideName, piSideName } from '../../../utils';
import Picker from '../../Picker';

interface SideSelectorProps {
  side: Side | null;
  onSelect: (side: Side | null) => void;
  warning?: boolean;
}

const SideSelector = ({ side, onSelect, warning }: SideSelectorProps) => {
  const [open, setOpen] = useState(false);

  const sideOptions = [
    { label: piSideName, value: 'p' },
    { label: 'Defense', value: 'd' },
  ];

  const label = side ? getSideName(side) : 'Not Set';

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
      selected={side}
      onSelect={onSelect}
      onClose={() => setOpen(false)}
      visible={open}
    />,
  ];
};

export default SideSelector;
