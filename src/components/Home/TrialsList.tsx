import React, { FC } from 'react';
import { StyleSheet } from 'react-native';

import TrialListItem from './TrialListItem';
import { Trial } from '../../controllers/trial';
import Card from '../Card';
import Text from '../Text';

interface TrialsListProps {
  trials: Trial[];
  handleSelect: (trial: Trial) => void;
  showAllTrialsLink: boolean;
  onAllTrialsPress?: () => void;
}

/**
 * @param param0
 * @returns
 */

const TrialsList: FC<TrialsListProps> = ({
  trials,
  handleSelect,
  showAllTrialsLink,
  onAllTrialsPress,
}) => {
  const orderedTrials = trials.sort((a, b) => b.date - a.date);

  return (
    <Card style={styles.container}>
      {trials.length === 0 && (
        <Text style={styles.noTrials}>
          No trials yet! Tap New Trial to get started.
        </Text>
      )}
      {orderedTrials.map((trial, i) => (
        <TrialListItem
          title={trial.name}
          key={trial.id}
          onPress={() => handleSelect(trial)}
          divider={
            (i < trials.length - 1 && trials.length > 1) || showAllTrialsLink
          }
        />
      ))}
      {showAllTrialsLink && (
        <TrialListItem
          title="Older Trials..."
          key="all_trials"
          onPress={() => onAllTrialsPress?.()}
          divider={false}
        />
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 7,
  },
  noTrials: {
    paddingVertical: 12,
    fontSize: 16,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
export default TrialsList;
