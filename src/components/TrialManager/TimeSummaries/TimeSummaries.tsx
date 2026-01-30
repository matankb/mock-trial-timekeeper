import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';

import SideTimeSummary, { TimeSummaryRowType } from './SideTimeSummary';
import { getTotalTimes, Trial } from '../../../controllers/trial';
import JointTimeSummary from './JointTimeSummary';

interface TimeSummariesProps {
  trial: Trial;
  editingTimes: boolean;
}
const TimeSummaries: FC<TimeSummariesProps> = ({ trial, editingTimes }) => {
  const { setup, stage } = trial;
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

  const jointTimeVisible = stage.includes('joint');

  return (
    <View style={styles.container}>
      {!jointTimeVisible && (
        <>
          <SideTimeSummary
            side="p"
            trial={trial}
            highlightRow={getHighlightedRow('pros')}
            timeRemaining={totalTimes.p.remaining}
            overtime={totalTimes.p.overtime}
            editingTimes={editingTimes}
          />
          <SideTimeSummary
            side="d"
            trial={trial}
            highlightRow={getHighlightedRow('def')}
            timeRemaining={totalTimes.d.remaining}
            overtime={totalTimes.d.overtime}
            editingTimes={editingTimes}
          />
        </>
      )}

      {jointTimeVisible && (
        <JointTimeSummary trial={trial} editingTimes={editingTimes} />
      )}
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
