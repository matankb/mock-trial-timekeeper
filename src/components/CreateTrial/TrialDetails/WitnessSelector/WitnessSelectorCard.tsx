import React, { FC } from 'react';
import { StyleSheet, Text } from 'react-native';

import WitnessSelectorItem from './WitnessSelectorItem';
import { Side } from '../../../../types/side';
import { getSideName } from '../../../../utils';
import Card from '../../../Card';

interface WitnessSelectorCardProps {
  side: Side;
  color: string;
  witnesses: string[];
  onWitnessSelect: (side: Side, position: number, witness: string) => void;
  inline?: boolean;
}

const WitnessSelectorCard: FC<WitnessSelectorCardProps> = ({
  side,
  color,
  witnesses,
  onWitnessSelect,
  inline,
}) => {
  const title = `${getSideName(side)} Witnesses`;

  return (
    <Card style={inline && styles.inline}>
      <Text style={[styles.sideTitle, inline && styles.inlineTitle, { color }]}>
        {title}
      </Text>
      {witnesses.map((witness, position) => (
        <WitnessSelectorItem
          key={`${side}-${position}`}
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
