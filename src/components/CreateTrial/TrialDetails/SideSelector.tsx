import { useState } from 'react';

import TrialDetailsItem from './TrialDetailsItem';
import { Side } from '../../../types/side';
import Picker from '../../Picker';
import { getSideName } from '../../../hooks/useLeagueFeatureFlag';
import { useSettingsLeague } from '../../../hooks/useSettings';

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
  const league = useSettingsLeague();
  const [open, setOpen] = useState(false);

  if (!league) {
    return null;
  }

  const sideOptions: SideOption[] = [
    { label: getSideName('p', league), value: 'p' },
    { label: 'Defense', value: 'd' },
  ];

  const sideLabel = side ? getSideName(side, league) : null;
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
