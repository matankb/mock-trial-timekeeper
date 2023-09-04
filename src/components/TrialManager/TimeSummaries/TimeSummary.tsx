import React, { FC } from 'react';
import { View, StyleSheet, Text } from 'react-native';

import TimeSummaryRow from './TimeSummaryRow';
import Card from '../../Card';

interface TimeSummaryProps {
  title: string;
  color: string;
  timeRemaining: TimeRemaining;
  highlightRow: TimeSummaryRowType;
}

interface TimeRemaining {
  statements: number;
  direct: number;
  cross: number;
}

export enum TimeSummaryRowType {
  Statements,
  Direct,
  Cross,
}

const TimeSummary: FC<TimeSummaryProps> = ({
  title,
  color,
  timeRemaining,
  highlightRow,
}) => {
  return (
    <Card>
      <Text
        style={{
          ...styles.title,
          color,
        }}
      >
        {title} Time Remaining
      </Text>

      <TimeSummaryRow
        name="Statements"
        time={timeRemaining.statements}
        highlighted={highlightRow === TimeSummaryRowType.Statements}
        highlightColor={color}
      />
      <TimeSummaryRow
        name="Direct Examinations"
        time={timeRemaining.direct}
        highlighted={highlightRow === TimeSummaryRowType.Direct}
        highlightColor={color}
      />
      <TimeSummaryRow
        name="Cross Examinations"
        time={timeRemaining.cross}
        highlighted={highlightRow === TimeSummaryRowType.Cross}
        highlightColor={color}
      />
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
});
export default TimeSummary;
