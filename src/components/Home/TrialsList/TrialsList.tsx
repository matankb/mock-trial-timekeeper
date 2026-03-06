import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';

import TrialListItem from '../TrialListItem';
import { Trial } from '../../../controllers/trial';
import Card from '../../Card';
import Text from '../../Text';
import colors from '../../../constants/colors';
import { Theme } from '../../../types/theme';
import useTheme from '../../../hooks/useTheme';

interface TrialsListProps {
  title?: string;
  orderedTrials: Trial[];
  getTrialTitle?: (trial: Trial) => string;
  getTrialSubtitle?: (trial: Trial) => string | null;
  handleSelect: (trial: Trial) => void;
  additionalTrialItems?: React.ReactNode[];
}

/**
 * @param param0
 * @returns
 */

const TrialsList: FC<TrialsListProps> = ({
  title,
  orderedTrials,
  getTrialTitle,
  getTrialSubtitle,
  handleSelect,
  additionalTrialItems = [],
}) => {
  const theme = useTheme();
  const hasAdditionalTrialItems = additionalTrialItems.some(Boolean);

  const createTrialListItem = (trial: Trial, i: number) => {
    const title = getTrialTitle?.(trial) ?? trial.name;
    const subtitle = getTrialSubtitle?.(trial);

    const isLastItem = i === orderedTrials.length - 1;

    return (
      <TrialListItem
        title={title}
        subtitle={subtitle ?? undefined}
        key={trial.id}
        onPress={() => handleSelect(trial)}
        divider={
          (orderedTrials.length > 1 && !isLastItem) || hasAdditionalTrialItems
        }
      />
    );
  };

  const contentStyle = {
    backgroundColor: theme === Theme.LIGHT ? 'white' : colors.BACKGROUND_GRAY,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  };

  return (
    <View>
      {title ? (
        <View style={styles.cardWrapper}>
          <View style={styles.header}>
            <Text style={styles.headerText}>{title}</Text>
          </View>
          <View style={contentStyle}>
            <View style={styles.content}>
              {orderedTrials.length === 0 && (
                <Text style={styles.noTrials}>No trials yet</Text>
              )}
              {orderedTrials.map((trial, i) => createTrialListItem(trial, i))}
              {additionalTrialItems}
            </View>
          </View>
        </View>
      ) : (
        <Card style={styles.container}>
          {orderedTrials.length === 0 && (
            <Text style={styles.noTrials}>No trials yet</Text>
          )}
          {orderedTrials.map((trial, i) => createTrialListItem(trial, i))}
          {additionalTrialItems}
        </Card>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 7,
  },
  cardWrapper: {
    width: '90%',
    alignSelf: 'center',
    marginTop: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
  header: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderTopLeftRadius: 10,
    backgroundColor: colors.GREEN,
    borderTopRightRadius: 10,
  },
  headerText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  content: {
    paddingVertical: 7,
  },
  noTrials: {
    paddingVertical: 12,
    fontSize: 16,
    textAlign: 'center',
    color: colors.PLACEHOLDER_GRAY,
  },
});
export default TrialsList;
