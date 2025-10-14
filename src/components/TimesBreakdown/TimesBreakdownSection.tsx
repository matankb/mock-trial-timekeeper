import React, { FC } from 'react';
import { View, StyleSheet, Text } from 'react-native';

import { Theme } from '../../types/theme';
import useTheme from '../../hooks/useTheme';
import { formatTime } from '../../utils';
import Card from '../Card';
import TimeEditor from '../TimeEditor/TimeEditor';
import { getStageName, TrialStage } from '../../constants/trial-stages';
import { getStageTime, Trial } from '../../controllers/trial';

export type TimeSection = TrialStage[];

/**
 * Each TimeSection is a list of stages which are grouped visually.
 */
interface TimesBreakdownSectionProps {
  title: string;
  trial: Trial;
  timeSections: TimeSection[];
  editing: boolean;
  onEdit: (stage: TrialStage, value: number) => void;
}

const TimesBreakdownSection: FC<TimesBreakdownSectionProps> = ({
  title,
  trial,
  timeSections,
  editing,
  onEdit,
}) => {
  const theme = useTheme();

  const createTimeSection = (stages: TrialStage[]) => {
    return stages.map((stage) => {
      const name = getStageName(stage, trial);
      const value = getStageTime(trial, stage);

      return (
        <View style={styles.row} key={stage}>
          <Text
            style={{
              ...styles.name,
              ...(theme === Theme.DARK && { color: 'white' }),
            }}
          >
            {name}
          </Text>
          {editing ? (
            <TimeEditor
              value={value}
              name={stage}
              onChange={(newTime) => onEdit(stage, newTime)}
            />
          ) : (
            <Text
              style={{
                ...styles.time,
                ...(theme === Theme.DARK && { color: 'white' }),
              }}
            >
              {formatTime(value)}
            </Text>
          )}
        </View>
      );
    });
  };

  return (
    <Card>
      <Text
        style={{
          ...styles.title,
          ...(theme === Theme.DARK && { color: 'white' }),
        }}
      >
        {title}
      </Text>
      {timeSections.map((stages, i) => (
        <View key={i}>
          {i > 0 && (
            <View
              style={{
                ...styles.divider,
                ...(theme === Theme.DARK && { borderColor: 'gray' }),
              }}
            />
          )}
          {createTimeSection(stages)}
        </View>
      ))}
    </Card>
  );
};

const styles = StyleSheet.create({
  title: {
    padding: 10,
    paddingTop: 7,
    paddingBottom: 12,
    fontSize: 16,
    fontWeight: 'bold',
  },
  divider: {
    borderBottomWidth: 1,
    borderColor: 'lightgray',

    marginBottom: 5,
    marginLeft: 10,
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    padding: 10,
    paddingTop: 7,
    paddingBottom: 12,
    fontSize: 16,
  },
  time: {
    paddingRight: 10,
  },
});
export default TimesBreakdownSection;
