import TrialDetailsItem from './TrialDetailsItem';
import { Side } from '../../../types/side';
import { getSideName, useSettingsLeague } from '../../../hooks/useLeague';
import TrialDetailsSelector from './TrialDetailsSelector';

interface SideSelectorProps {
  side: Side | null;
  onSelect: (side: Side) => void;
  warning?: boolean;
  expanded?: boolean;
  onExpandChange: (expanded: boolean) => void;
}

interface SideOption {
  label: string;
  value: Side;
}

const SideSelector = ({
  side,
  onSelect,
  warning,
  expanded,
  onExpandChange,
}: SideSelectorProps) => {
  const league = useSettingsLeague();

  const sideOptions: SideOption[] = [
    { label: getSideName('p', league), value: 'p' },
    { label: 'Defense', value: 'd' },
  ];

  const sideLabel = side ? getSideName(side, league) : null;
  const label = sideLabel ?? 'Not Set';

  const selector = (
    <TrialDetailsSelector
      items={sideOptions}
      selected={side ?? undefined}
      onSelect={onSelect}
    />
  );

  return (
    <TrialDetailsItem
      title="Side"
      value={label}
      warning={warning}
      expandedContent={selector}
      expanded={expanded}
      onExpandChange={onExpandChange}
    />
  );
};

export default SideSelector;
