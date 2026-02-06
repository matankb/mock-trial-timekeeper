import React, { FC } from 'react';

import TimeSummaryCard from './TimeSummaryCard';
import TimeSummaryRow from './TimeSummaryRow';
import colors from '../../../constants/colors';
import { getStageName } from '../../../constants/trial-stages';
import { getStageTime, Trial } from '../../../controllers/trial';
import { defaultSettings } from '../../../controllers/settings';
import { StyleSheet, View } from 'react-native';
import { TimeSummaryRowType } from './SideTimeSummary';

interface JointTimeSummaryProps {
  trial: Trial;
  editingTimes: boolean;
}

const JointTimeSummary: FC<JointTimeSummaryProps> = ({
  trial,
  editingTimes,
}) => {
  const { stage, setup } = trial;

  const {
    jointPrepClosingsEnabled,
    jointConferenceEnabled,
    jointPrepClosingsTime,
    jointConferenceTime,
  } = setup;

  const isEnabled = jointPrepClosingsEnabled || jointConferenceEnabled;
  const isCurrentStage =
    stage === 'joint.prep.closings' || stage === 'joint.conference';

  if (!isEnabled || !isCurrentStage) {
    return null;
  }

  const prepClosingsTimeRemaining =
    // TODO: not sure if this is the best way - to fall back to defaultSettings?? - lowkey what if I just make it a required property??
    (jointPrepClosingsTime || defaultSettings.setup.jointPrepClosingsTime) -
    getStageTime(trial, 'joint.prep.closings');

  const conferenceTimeRemaining =
    (jointConferenceTime || defaultSettings.setup.jointConferenceTime) -
    getStageTime(trial, 'joint.conference');

  const stageName = getStageName(stage, trial);

  return (
    <View style={styles.container}>
      <TimeSummaryCard
        title={stageName}
        color={colors.PLACEHOLDER_GRAY}
        fullWidth={true} // since these are displayed by themselves
      >
        {jointPrepClosingsEnabled && stage === 'joint.prep.closings' && (
          <TimeSummaryRow
            side="joint"
            name={'Time Remaining'}
            timeRemaining={prepClosingsTimeRemaining}
            highlighted={stage === 'joint.prep.closings'}
            highlightColor={colors.PLACEHOLDER_GRAY}
            editingTimes={editingTimes}
            rowType={TimeSummaryRowType.JointPrepClosings}
            league={trial.league}
          />
        )}
        {jointConferenceEnabled && stage === 'joint.conference' && (
          <TimeSummaryRow
            side="joint"
            name={'Time Remaining'}
            timeRemaining={conferenceTimeRemaining}
            highlighted={stage === 'joint.conference'}
            highlightColor={colors.PLACEHOLDER_GRAY}
            editingTimes={editingTimes}
            rowType={TimeSummaryRowType.JointConference}
            league={trial.league}
          />
        )}
      </TimeSummaryCard>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    gap: 20,
  },
  text: {
    fontSize: 14,
    color: 'gray',
    textAlign: 'center',
    paddingHorizontal: 30,
  },
});

export default JointTimeSummary;
