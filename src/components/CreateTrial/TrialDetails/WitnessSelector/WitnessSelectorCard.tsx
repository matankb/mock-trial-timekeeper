import React, { FC } from 'react';
import { StyleSheet, Text } from 'react-native';

import WitnessSelectorItem from './WitnessSelectorItem';
import { Side } from '../../../../types/side';
import { getSideName } from '../../../../utils';
import Card from '../../../Card';

interface WitnessSelectorCardProps {
  side: Side;
  title: string;
  color: string;
  witnesses: string[];
  onWitnessSelect: (side: Side, position: number, witness: string) => void;
}

const WitnessSelectorCard: FC<WitnessSelectorCardProps> = ({
  side,
  color,
  witnesses,
  onWitnessSelect,
}) => {
  const title = `${getSideName(side)} Witnesses`;

  return (
    <Card>
      <Text style={[styles.sideTitle, { color }]}>{title}</Text>
      {witnesses.map((witness, position) => (
        <WitnessSelectorItem
          key={`${side}-${position}`}
          side={side}
          position={position}
          witness={witness}
          onSelect={(newWitness) => onWitnessSelect(side, position, newWitness)}
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
});

export default WitnessSelectorCard;
