import TrialDetailsItem from './TrialDetailsItem';
import { RoundNumber } from '../../../types/round-number';
import TrialDetailsSelector from './TrialDetailsSelector';

interface RoundSelectorProps {
  round: RoundNumber | null;
  onSelect: (round: RoundNumber) => void;
  warning?: boolean;
  expanded?: boolean;
  onExpandChange: (expanded: boolean) => void;
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

const RoundSelector = ({
  round,
  onSelect,
  warning,
  expanded,
  onExpandChange,
}: RoundSelectorProps) => {
  const selector = (
    <TrialDetailsSelector
      items={roundOptionsArray}
      selected={round ?? undefined}
      onSelect={onSelect}
    />
  );

  return (
    <TrialDetailsItem
      title="Round"
      value={round ? `Round ${round}` : 'Not Set'}
      warning={warning}
      expandedContent={selector}
      expanded={expanded}
      onExpandChange={onExpandChange}
    />
  );
};

export default RoundSelector;
