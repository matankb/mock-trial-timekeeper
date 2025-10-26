import React, { FC, useMemo } from 'react';
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

const TOTAL_FLEX_TIME = 5 * 60; // five minutes of total flex time

const calculateTimeRemainingWithFlex = (
  firstStageRemainingRaw: number,
  secondStageRemainingRaw: number,
) => {
  // nothing changes, since when first stage is going, the second stage hasn't started yet
  const firstStageRemainingActual = firstStageRemainingRaw;

  // second stage actual is the raw time, minus the time that the first stage went over
  const secondStageRemainingActual =
    secondStageRemainingRaw + Math.min(firstStageRemainingRaw, 0);

  const firstStageFlexRemaining =
    TOTAL_FLEX_TIME + Math.min(firstStageRemainingActual, 0);

  const secondStageFlexRemaining =
    // first, calculate the flex time left over from the first stage:
    // however much positive time was left over from the first stage, but at most the total flex time
    Math.min(Math.max(firstStageRemainingRaw, 0), TOTAL_FLEX_TIME) +
    // then subtract however much the second stage is going over (added since Math.min(0, secondStageRemainingActual) is <= 0)
    Math.min(secondStageRemainingActual, 0);

  return {
    firstStageFlexRemaining,
    secondStageFlexRemaining,
    firstStageRemainingActual,
    secondStageRemainingActual,
  };
};

const TimeSummary: FC<TimeSummaryProps> = ({
  side,
  timeRemaining,
  highlightRow,
  setup,
}) => {
  const color = side === 'p' ? colors.RED : colors.BLUE;
  const title = getSideName(side);

  const {
    directTimeRemaining,
    crossTimeRemaining,
    directFlexTimeRemaining,
    crossFlexTimeRemaining,
  } = useMemo(() => {
    if (!setup.flexEnabled) {
      return {
        directTimeRemaining: timeRemaining.direct,
        crossTimeRemaining: timeRemaining.cross,
        directFlexTimeRemaining: 0,
        crossFlexTimeRemaining: 0, // flex time is not enabled
      };
    } else {
      if (side === 'p') {
        const {
          firstStageFlexRemaining,
          secondStageFlexRemaining,
          firstStageRemainingActual,
          secondStageRemainingActual,
        } = calculateTimeRemainingWithFlex(
          timeRemaining.direct,
          timeRemaining.cross,
        );

        return {
          directTimeRemaining: firstStageRemainingActual,
          crossTimeRemaining: secondStageRemainingActual,
          directFlexTimeRemaining: firstStageFlexRemaining,
          crossFlexTimeRemaining: secondStageFlexRemaining,
        };
      } else {
        const {
          firstStageFlexRemaining,
          secondStageFlexRemaining,
          firstStageRemainingActual,
          secondStageRemainingActual,
        } = calculateTimeRemainingWithFlex(
          timeRemaining.cross,
          timeRemaining.direct,
        );

        return {
          directTimeRemaining: secondStageRemainingActual,
          crossTimeRemaining: firstStageRemainingActual,
          directFlexTimeRemaining: secondStageFlexRemaining,
          crossFlexTimeRemaining: firstStageFlexRemaining,
        };
      }
    }
  }, [setup.flexEnabled, timeRemaining.direct, timeRemaining.cross, side]);

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
        timeRemaining={directTimeRemaining}
        highlighted={highlightRow === TimeSummaryRowType.Direct}
        highlightColor={color}
        flexEnabled={setup.flexEnabled}
        flexTimeRemaining={directFlexTimeRemaining}
      />
      <TimeSummaryRow
        name="Cross Examinations"
        timeRemaining={crossTimeRemaining}
        highlighted={highlightRow === TimeSummaryRowType.Cross}
        highlightColor={color}
        flexEnabled={setup.flexEnabled}
        flexTimeRemaining={crossFlexTimeRemaining}
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
