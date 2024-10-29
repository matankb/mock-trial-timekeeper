import React, { FC } from 'react';
import { View, StyleSheet } from 'react-native';

import TimeSummary, { TimeSummaryRowType } from './TimeSummary';
import colors from '../../../constants/colors';
import { Trial } from '../../../controllers/trial';
import { piSideName } from '../../../utils';

interface TimeSummariesProps {
  trial: Trial;
}

const TimeSummaries: FC<TimeSummariesProps> = ({ trial }) => {
  const { setup, times } = trial;

  const prosecutionTimeRemaining = {
    pretrial: setup.pretrialTime - times.pretrial.pros,
    statements:
      setup.statementTime -
      (times.open.pros + times.close.pros + times.rebuttal),
    open: setup.openTime - times.open.pros,
    close: setup.closeTime - times.close.pros,
    direct:
      setup.directTime -
      (times.prosCic.witnessOne.direct +
        times.prosCic.witnessTwo.direct +
        times.prosCic.witnessThree.direct),
    cross:
      setup.crossTime -
      (times.defCic.witnessOne.cross +
        times.defCic.witnessTwo.cross +
        times.defCic.witnessThree.cross),
  };

  if (setup.flexEnabled) {
    if (prosecutionTimeRemaining.direct < 0) {
      // direct is negative, so add it (thereby subtracting) from cross
      prosecutionTimeRemaining.cross += prosecutionTimeRemaining.direct;
    }
  }

  const defenseTimeRemaining = {
    pretrial: setup.pretrialTime - times.pretrial.def,
    statements: setup.statementTime - (times.open.def + times.close.def),
    open: setup.openTime - times.open.def,
    close: setup.closeTime - times.close.def,
    direct:
      setup.directTime -
      (times.defCic.witnessOne.direct +
        times.defCic.witnessTwo.direct +
        times.defCic.witnessThree.direct),
    cross:
      setup.crossTime -
      (times.prosCic.witnessOne.cross +
        times.prosCic.witnessTwo.cross +
        times.prosCic.witnessThree.cross),
  };

  if (setup.flexEnabled) {
    // switched around on defense
    if (defenseTimeRemaining.cross < 0) {
      // cross is negative, so add it (thereby subtracting) from direct
      defenseTimeRemaining.direct += defenseTimeRemaining.cross;
    }
  }

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

    return null;
  };

  return (
    <View style={styles.container}>
      <TimeSummary
        side="p"
        highlightRow={getHighlightedRow('pros')}
        timeRemaining={prosecutionTimeRemaining}
        setup={setup}
      />
      <TimeSummary
        side="d"
        highlightRow={getHighlightedRow('def')}
        timeRemaining={defenseTimeRemaining}
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
