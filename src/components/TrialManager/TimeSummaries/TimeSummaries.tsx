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
    statements:
      setup.statementTime -
      (times.open.pros + times.close.pros + times.rebuttal),
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

  const defenseTimeRemaining = {
    statements: setup.statementTime - (times.open.def + times.close.def),
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

  const getHighlightedRow = (side: string) => {
    const isOpenOrClose =
      (trial.stage.includes('open') || trial.stage.includes('close')) &&
      trial.stage.includes(side);
    const isRebuttal = trial.stage === 'rebuttal' && side === 'pros';
    const statementsHighlighted = isOpenOrClose || isRebuttal;

    const directHighlighted =
      trial.stage.includes(side) && trial.stage.includes('direct');

    const crossHighlighted =
      !trial.stage.includes(side) && trial.stage.includes('cross');

    if (statementsHighlighted) {
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
        title={piSideName}
        color={colors.RED}
        highlightRow={getHighlightedRow('pros')}
        timeRemaining={prosecutionTimeRemaining}
      />
      <TimeSummary
        title="Defense"
        color={colors.BLUE}
        highlightRow={getHighlightedRow('def')}
        timeRemaining={defenseTimeRemaining}
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
