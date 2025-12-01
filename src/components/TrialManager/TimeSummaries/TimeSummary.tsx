import React, { FC } from 'react';
import { StyleSheet, Text } from 'react-native';

import TimeSummaryRow from './TimeSummaryRow';
import colors from '../../../constants/colors';
import { TotalTimeSet, TrialSetup } from '../../../controllers/trial';
import { Side } from '../../../types/side';
import { getSideName } from '../../../utils';
import Card from '../../Card';

interface TimeSummaryProps {
  side: Side;
  setup: TrialSetup;
  timeRemaining: TotalTimeSet;
  highlightRow?: TimeSummaryRowType;
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
  side,
  timeRemaining,
  highlightRow,
  setup,
}) => {
  const color = side === 'p' ? colors.RED : colors.BLUE;
  const title = getSideName(side);

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

      {setup.pretrialEnabled && timeRemaining.pretrial !== null && (
        <TimeSummaryRow
          name="Pretrial"
          timeRemaining={timeRemaining.pretrial}
          highlighted={highlightRow === TimeSummaryRowType.Pretrial}
          highlightColor={color}
        />
      )}

      {setup.statementsSeparate && timeRemaining.open !== null && (
        <TimeSummaryRow
          name="Opening Statement"
          timeRemaining={timeRemaining.open}
          highlighted={highlightRow === TimeSummaryRowType.Open}
          highlightColor={color}
        />
      )}
      {!setup.statementsSeparate && timeRemaining.statements !== null && (
        <TimeSummaryRow
          name="Statements"
          timeRemaining={timeRemaining.statements}
          highlighted={highlightRow === TimeSummaryRowType.Statements}
          highlightColor={color}
        />
      )}
      <TimeSummaryRow
        name="Direct Examinations"
        timeRemaining={timeRemaining.direct}
        highlighted={highlightRow === TimeSummaryRowType.Direct}
        highlightColor={color}
      />
      <TimeSummaryRow
        name="Cross Examinations"
        timeRemaining={timeRemaining.cross}
        highlighted={highlightRow === TimeSummaryRowType.Cross}
        highlightColor={color}
      />
      {setup.statementsSeparate && timeRemaining.close !== null && (
        <TimeSummaryRow
          name="Closing Statement"
          timeRemaining={timeRemaining.close}
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
