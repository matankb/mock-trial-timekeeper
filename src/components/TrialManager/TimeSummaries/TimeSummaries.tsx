import React, { FC } from 'react';
import { View, StyleSheet } from 'react-native';

import TimeSummary, { TimeSummaryRowType } from './TimeSummary';
import { getTotalTimes, Trial } from '../../../controllers/trial';

interface TimeSummariesProps {
  trial: Trial;
}

const TimeSummaries: FC<TimeSummariesProps> = ({ trial }) => {
  const { setup } = trial;
  const totalTimes = getTotalTimes(trial);

  const getHighlightedRow = (side: string) => {
    const isPretrial =
      trial.stage.includes('pretrial') && trial.stage.includes(side);
    const isOpen = trial.stage.includes('open') && trial.stage.includes(side);
    const isClose = trial.stage.includes('close') && trial.stage.includes(side);
    const isRebuttal = trial.stage === 'rebuttal' && side === 'pros';

    const statementsHighlighted = isOpen || isClose || isRebuttal;
    const directHighlighted =
      trial.stage.includes(side) && trial.stage.includes('direct');

    const crossHighlighted =
      !trial.stage.includes(side) && trial.stage.includes('cross');

    if (isPretrial) {
      return TimeSummaryRowType.Pretrial;
    } else if (statementsHighlighted) {
      if (setup.statementsSeparate) {
        if (isOpen) {
          return TimeSummaryRowType.Open;
        } else if (isClose || isRebuttal) {
          return TimeSummaryRowType.Close;
        }
      }

      return TimeSummaryRowType.Statements;
    } else if (directHighlighted) {
      return TimeSummaryRowType.Direct;
    } else if (crossHighlighted) {
      return TimeSummaryRowType.Cross;
    }

    return undefined;
  };

  return (
    <View style={styles.container}>
      <TimeSummary
        side="p"
        highlightRow={getHighlightedRow('pros')}
        timeRemaining={totalTimes.p.remaining}
        setup={setup}
      />
      <TimeSummary
        side="d"
        highlightRow={getHighlightedRow('def')}
        timeRemaining={totalTimes.d.remaining}
        setup={setup}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
  },
});

export default TimeSummaries;
