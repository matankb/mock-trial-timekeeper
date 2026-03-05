import { StyleSheet, View } from 'react-native';
import { getStageTime, Trial } from '../../../controllers/trial';
import TimeSummaryCard from './TimeSummaryCard';
import { getSideName } from '../../../hooks/useLeague';
import colors from '../../../constants/colors';
import { FC, useMemo } from 'react';
import TimeSummaryRow from './TimeSummaryRow';
import { getStageName } from '../../../constants/trial-stages';
import { TimeSummaryRowType } from './SideTimeSummary';

// TODO: this does NOT support editingTimes, so does not support leagues (e.g., MN)
interface IndependentReexaminationTimeSummaryProps {
  trial: Trial;
}

const IndependentReexaminationTimeSummary: FC<
  IndependentReexaminationTimeSummaryProps
> = ({ trial }) => {
  const side = useMemo(() => {
    if (trial.stage.includes('redirect')) {
      if (trial.stage.includes('pros')) {
        return 'p';
      } else {
        return 'd';
      }
    } else if (trial.stage.includes('recross')) {
      // recrosses are always against the other side
      if (trial.stage.includes('pros')) {
        return 'd';
      } else {
        return 'p';
      }
    }

    return undefined;
  }, [trial.stage]);

  if (!side) {
    return null;
  }

  const sideName = getSideName(side, trial.league);
  const title = `${sideName} Time Remaining`;

  const timeRemaining =
    trial.setup.reexaminationIndependentTime - getStageTime(trial, trial.stage);

  const color = side === 'p' ? colors.RED : colors.BLUE;

  return (
    <View style={styles.container}>
      <TimeSummaryCard
        title={title}
        color={color}
        fullWidth={true} // since these are displayed by themselves
      >
        <TimeSummaryRow
          side="joint"
          name={getStageName(trial.stage, trial)}
          timeRemaining={timeRemaining}
          highlighted={true}
          highlightColor={color}
          editingTimes={false}
          rowType={TimeSummaryRowType.Reexamination}
          league={trial.league}
        />
      </TimeSummaryCard>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
});

export default IndependentReexaminationTimeSummary;
