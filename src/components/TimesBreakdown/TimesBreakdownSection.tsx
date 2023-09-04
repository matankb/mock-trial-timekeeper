import React, { FC } from 'react';
import { View, StyleSheet, Text } from 'react-native';

import TimeEditor, { TimeEditHandler } from './TimeEditor';
import { formatTime } from '../../utils';

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
  const createTimeSection = (timeSection: TimeSection) =>
    timeSection.map(([name, value, onEdit]) => (
      <View style={styles.row} key={name}>
        <Text style={styles.name}>{name}</Text>
        {editing ? (
          <TimeEditor value={value} name={name} onChange={onEdit} />
        ) : (
          <Text style={styles.time}>{formatTime(value)}</Text>
        )}
      </View>
    ));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {times.map((timeSection, i) => (
        <View key={i}>
          {i > 0 && <View style={styles.divider} />}
          {createTimeSection(timeSection)}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  // TODO: potentially replace with Card
  container: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
  },
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
