import React, { FC, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import TrialListItem from '../TrialListItem';
import { Trial } from '../../../controllers/trial';
import Card from '../../Card';
import Text from '../../Text';
import colors from '../../../constants/colors';
import { Theme } from '../../../types/theme';
import useTheme from '../../../hooks/useTheme';

const HEADER_COLORS = [
  '#7EB8DA', // soft blue
  '#9ED0A6', // soft green
  '#E8A87C', // soft peach
  '#C49EC4', // soft lavender
  '#85C1C1', // soft teal
  '#E6B89C', // soft coral
  '#9ABEDC', // sky blue
  '#B5CA8D', // sage green
  '#D4A5A5', // dusty rose
  '#A8D0DB', // powder blue
  '#C9B1D4', // soft purple
  '#9DC3C1', // seafoam
];

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
  orderedTrials: trials,
  getTrialTitle,
  getTrialSubtitle,
  handleSelect,
  additionalTrialItems = [],
}) => {
  const theme = useTheme();
  const orderedTrials = trials.sort((a, b) => b.date - a.date);
  const hasAdditionalTrialItems = additionalTrialItems.some(Boolean);

  // Pick a consistent random color based on the title
  const headerColor = useMemo(() => {
    if (!title) return HEADER_COLORS[0];
    const hash = title
      .split('')
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return HEADER_COLORS[hash % HEADER_COLORS.length];
  }, [title]);

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
          <View style={[styles.header, { backgroundColor: headerColor }]}>
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
    paddingHorizontal: 12,
    borderTopLeftRadius: 10,
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
