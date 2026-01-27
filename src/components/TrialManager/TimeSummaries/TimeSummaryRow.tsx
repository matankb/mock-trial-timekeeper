import React, { FC } from 'react';
import { View, StyleSheet, Text } from 'react-native';

import colors from '../../../constants/colors';
import { Theme } from '../../../types/theme';
import useTheme from '../../../hooks/useTheme';
import TimeEditor from '../../TimeEditor/TimeEditor';
import { formatTime } from '../../../utils';
import { getSideName } from '../../../hooks/useLeagueFeatureFlag';
import { Side } from '../../../types/side';
import { useRoute } from '../../../types/navigation';
import { ScreenName } from '../../../constants/screen-names';
import useTrial from '../../../hooks/useTrial';
import {
  calculateNewTrialTime,
  getStageTime,
} from '../../../controllers/trial';
import { TimeSummaryRowType } from './SideTimeSummary';
import { TrialStage } from '../../../constants/trial-stages';
import { League } from '../../../constants/leagues';

interface TimeSummaryRowProps {
  name: string;
  timeRemaining: number;
  highlighted: boolean;
  highlightColor: string;
  editingTimes: boolean;
  side: Side | 'joint'; // TODO: improve this typing here...
  rowType: TimeSummaryRowType;
  league: League;
}

/**
 * Given a TimeSummaryRowType for a Side, return an arbitrary stage that falls in that row.
 * TODO: explain more!
 */
function getTrialStageFromTimeSummaryRowType(
  rowType: TimeSummaryRowType,
  side: Side | 'joint',
): TrialStage {
  const pRowTypeMap: Record<
    Exclude<
      TimeSummaryRowType,
      TimeSummaryRowType.JointConference | TimeSummaryRowType.JointPrepClosings
    >,
    TrialStage
  > = {
    [TimeSummaryRowType.Pretrial]: 'pretrial.pros',
    [TimeSummaryRowType.Statements]: 'open.pros',
    [TimeSummaryRowType.Open]: 'open.pros',
    [TimeSummaryRowType.Close]: 'close.pros',
    [TimeSummaryRowType.Direct]: 'cic.pros.one.direct',
    [TimeSummaryRowType.Cross]: 'cic.def.one.cross', // Crosses of D witnesses count against P time
  };

  const dRowTypeMap: Record<
    Exclude<
      TimeSummaryRowType,
      TimeSummaryRowType.JointConference | TimeSummaryRowType.JointPrepClosings
    >,
    TrialStage
  > = {
    [TimeSummaryRowType.Pretrial]: 'pretrial.def',
    [TimeSummaryRowType.Statements]: 'open.def',
    [TimeSummaryRowType.Open]: 'open.def',
    [TimeSummaryRowType.Close]: 'close.def',
    [TimeSummaryRowType.Direct]: 'cic.def.one.direct',
    [TimeSummaryRowType.Cross]: 'cic.pros.one.cross',
  };

  const jointRowTypeMap: Record<
    TimeSummaryRowType.JointConference | TimeSummaryRowType.JointPrepClosings,
    TrialStage
  > = {
    [TimeSummaryRowType.JointConference]: 'joint.conference',
    [TimeSummaryRowType.JointPrepClosings]: 'joint.prep.closings',
  };

  // TODO: improve this typing here...
  if (side === 'p') {
    return pRowTypeMap[rowType];
  } else if (side === 'd') {
    return dRowTypeMap[rowType];
  } else if (side === 'joint') {
    return jointRowTypeMap[rowType];
  }
}

const TimeSummaryRow: FC<TimeSummaryRowProps> = ({
  name,
  timeRemaining,
  highlighted,
  highlightColor,
  editingTimes,
  side,
  rowType,
  league,
}) => {
  const route = useRoute<ScreenName.TRIAL_MANAGER>();
  const [trial, setTrial] = useTrial(route.params.trialId);

  const theme = useTheme();

  const defaultRowBackground =
    theme === Theme.LIGHT ? 'white' : colors.BACKGROUND_GRAY;

  const rowStyle = {
    ...styles.row,
    backgroundColor: highlighted ? highlightColor : defaultRowBackground,
  };

  const defaultTextColor = theme === Theme.LIGHT ? 'black' : 'white';

  const textStyle = {
    ...styles.text,
    color: highlighted ? 'white' : defaultTextColor,
  };

  const editorName =
    side === 'p' || side === 'd'
      ? `${getSideName(side, league, new Date(trial.date))}`
      : name;

  const handleTimeEdit = (newTimeRemaining: number) => {
    // todo: maybe move this to a controller
    // TODO: this could lead to stages being negative, which I guess is fine for just MN,
    // because they'll never see the individual stage breakdown.
    const timeToAdd = timeRemaining - newTimeRemaining;

    // no change
    if (timeToAdd === 0) {
      return;
    }

    const stage = getTrialStageFromTimeSummaryRowType(rowType, side);
    const currentStageTime = getStageTime(trial, stage);
    const newStageTime = currentStageTime + timeToAdd;
    const newTrial = calculateNewTrialTime(trial, newStageTime, stage);

    setTrial(newTrial);
  };

  return (
    <View style={[rowStyle, editingTimes && styles.rowEditing]}>
      <Text style={textStyle}>{name}</Text>
      {editingTimes ? (
        <TimeEditor
          value={timeRemaining}
          name={editorName}
          inline
          highlighted={highlighted}
          onChange={handleTimeEdit}
          minutesLabel={'Edit minutes remaining'}
          secondsLabel={'Edit seconds remaining'}
        />
      ) : (
        <Text style={textStyle}>{formatTime(timeRemaining)}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    paddingVertical: 12,
    borderColor: 'lightgray',
    borderRadius: 5,
  },
  rowEditing: {
    paddingVertical: 7,
  },
  text: {
    fontSize: 16,
  },
});
export default TimeSummaryRow;
