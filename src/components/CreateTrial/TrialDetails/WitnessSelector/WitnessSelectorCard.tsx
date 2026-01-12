import React, { FC } from 'react';
import { StyleSheet, Text } from 'react-native';

import WitnessSelectorItem from './WitnessSelectorItem';
import { Side } from '../../../../types/side';
import Card from '../../../Card';
import { TrialWitnessCall } from '../../../../controllers/trial';
import { LeagueWitnessSet } from '../../../../constants/leagues';
import { useLeagueSideName } from '../../../../hooks/useLeagueFeatureFlag';

interface WitnessSelectorCardProps {
  side: Side;
  color: string;
  leagueWitnesses: LeagueWitnessSet;
  witnesses: TrialWitnessCall;
  onWitnessSelect: (
    side: Side,
    position: number,
    witness: string | null,
  ) => void;
  inline?: boolean;
}

const WitnessSelectorCard: FC<WitnessSelectorCardProps> = ({
  leagueWitnesses,
  side,
  color,
  witnesses,
  onWitnessSelect,
  inline,
}) => {
  const sideName = useLeagueSideName(side);
  const title = `${sideName} Witnesses`;

  return (
    <Card style={inline ? styles.inline : undefined}>
      <Text style={[styles.sideTitle, inline && styles.inlineTitle, { color }]}>
        {title}
      </Text>
      {witnesses.map((witness, position) => (
        <WitnessSelectorItem
          key={`${side}-${position}`}
          leagueWitnesses={leagueWitnesses}
          side={side}
          position={position}
          witness={witness}
          onSelect={(newWitness) => onWitnessSelect(side, position, newWitness)}
          inline={inline}
        />
      ))}
    </Card>
  );
};

const styles = StyleSheet.create({
  sideTitle: {
    padding: 10,
    paddingTop: 7,
    paddingBottom: 12,
    fontSize: 16,
    fontWeight: 'bold',
  },
  inline: {
    padding: 0,
  },
  inlineTitle: {
    paddingHorizontal: 0,
  },
});

export default WitnessSelectorCard;
