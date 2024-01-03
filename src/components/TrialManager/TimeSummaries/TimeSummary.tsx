import React, { FC } from 'react';
import { StyleSheet, Text } from 'react-native';

import TimeSummaryRow from './TimeSummaryRow';
import { TrialSetup } from '../../../controllers/trial';
import Card from '../../Card';

interface TimeSummaryProps {
  title: string;
  color: string;
  setup: TrialSetup;
  timeRemaining: TimeRemaining;
  highlightRow: TimeSummaryRowType;
}

interface TimeRemaining {
  pretrial: number;
  statements: number;
  open: number;
  close: number;
  direct: number;
  cross: number;
}

export enum TimeSummaryRowType {
  Pretrial,
  Statements,
  Open,
  Close,
  Direct,
  Cross,
}

const TimeSummary: FC<TimeSummaryProps> = ({
  title,
  color,
  timeRemaining,
  highlightRow,
  setup,
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

      {setup.pretrialEnabled && (
        <TimeSummaryRow
          name="Pretrial"
          time={timeRemaining.pretrial}
          highlighted={highlightRow === TimeSummaryRowType.Pretrial}
          highlightColor={color}
        />
      )}

      {setup.statementsSeparate && (
        <TimeSummaryRow
          name="Opening Statement"
          time={timeRemaining.open}
          highlighted={highlightRow === TimeSummaryRowType.Open}
          highlightColor={color}
        />
      )}
      {!setup.statementsSeparate && (
        <TimeSummaryRow
          name="Statements"
          time={timeRemaining.statements}
          highlighted={highlightRow === TimeSummaryRowType.Statements}
          highlightColor={color}
        />
      )}
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
      {setup.statementsSeparate && (
        <TimeSummaryRow
          name="Closing Statement"
          time={timeRemaining.close}
          highlighted={highlightRow === TimeSummaryRowType.Close}
          highlightColor={color}
        />
      )}
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
