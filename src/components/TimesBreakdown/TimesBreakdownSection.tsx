import React, { FC } from 'react';
import { View, StyleSheet, Text } from 'react-native';

import { Theme } from '../../types/theme';
import useTheme from '../../hooks/useTheme';
import { formatTime } from '../../utils';
import Card from '../Card';
import TimeEditor, { TimeEditHandler } from '../TimeEditor/TimeEditor';

type TimeItem = [string, number, TimeEditHandler];
type TimeSection = TimeItem[];

/**
 * Each TimeSectionData is a list of [name, value] pairs, and is divided visually
 */
interface TimesBreakdownSectionProps {
  title: string;
  times: TimeSection[];
  editing: boolean;
}

const TimesBreakdownSection: FC<TimesBreakdownSectionProps> = ({
  title,
  times,
  editing,
}) => {
  const theme = useTheme();

  const createTimeSection = (timeSection: TimeSection) =>
    timeSection.map(([name, value, onEdit]) => (
      <View style={styles.row} key={name}>
        <Text
          style={{
            ...styles.name,
            ...(theme === Theme.DARK && { color: 'white' }),
          }}
        >
          {name}
        </Text>
        {editing ? (
          <TimeEditor value={value} name={name} onChange={onEdit} />
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
    ));

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
      {times.map((timeSection, i) => (
        <View key={i}>
          {i > 0 && (
            <View
              style={{
                ...styles.divider,
                ...(theme === Theme.DARK && { borderColor: 'gray' }),
              }}
            />
          )}
          {createTimeSection(timeSection)}
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
