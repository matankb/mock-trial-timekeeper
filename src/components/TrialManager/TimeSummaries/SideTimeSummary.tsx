import React, { FC } from 'react';

import TimeSummaryRow from './TimeSummaryRow';
import colors from '../../../constants/colors';
import { TotalTimeRemaining, Trial } from '../../../controllers/trial';
import { Side } from '../../../types/side';
import {
  getSideName,
  useLeagueFeatureFlag,
} from '../../../hooks/useLeagueFeatureFlag';
import TimeSummaryCard from './TimeSummaryCard';
import { LeagueFeature } from '../../../constants/leagues';

interface TimeSummaryProps {
  side: Side;
  trial: Trial;
  timeRemaining: TotalTimeRemaining;
  overtime: number;
  highlightRow?: TimeSummaryRowType;
  editingTimes: boolean;
}

export enum TimeSummaryRowType {
  Pretrial = 'Pretrial',
  Statements = 'Statements',
  Open = 'Opening Statement',
  Close = 'Closing Statement',
  Direct = 'Direct Examinations',
  Cross = 'Cross Examinations',
  JointConference = 'Team Conference',
  JointPrepClosings = 'Preparation for Closings',
}

const SideTimeSummary: FC<TimeSummaryProps> = ({
  side,
  trial,
  timeRemaining,
  overtime,
  highlightRow,
  editingTimes,
}) => {
  const showOvertime = useLeagueFeatureFlag(LeagueFeature.SHOW_OVERTIME);

  const { setup, stage: currentStage, league } = trial;
  const color = side === 'p' ? colors.RED : colors.BLUE;
  const title = `${getSideName(
    side,
    league,
    new Date(trial.date),
  )} Time Remaining`;

  // TODO: document this.
  const showRebuttal =
    setup.rebuttalMaxEnabled &&
    currentStage === 'rebuttal' &&
    side === 'p' &&
    setup.rebuttalMaxTime !== undefined &&
    timeRemaining.rebuttal !== undefined;

  const createRow = (
    name: string,
    timeRemaining: number,
    rowType: TimeSummaryRowType,
  ) => (
    <TimeSummaryRow
      side={side}
      name={name}
      timeRemaining={timeRemaining}
      highlighted={highlightRow === rowType}
      highlightColor={color}
      editingTimes={editingTimes}
      rowType={rowType}
      league={league}
    />
  );

  return (
    <TimeSummaryCard
      title={title}
      color={color}
      overtime={showOvertime ? overtime : undefined}
    >
      {setup.pretrialEnabled &&
        timeRemaining.pretrial !== null &&
        createRow(
          'Pretrial',
          timeRemaining.pretrial,
          TimeSummaryRowType.Pretrial,
        )}

      {setup.statementsSeparate &&
        timeRemaining.open !== null &&
        createRow(
          'Opening Statement',
          timeRemaining.open,
          TimeSummaryRowType.Open,
        )}
      {!setup.statementsSeparate &&
        timeRemaining.statements !== null &&
        createRow(
          'Statements',
          timeRemaining.statements,
          TimeSummaryRowType.Statements,
        )}
      {createRow(
        'Direct Examinations',
        timeRemaining.direct,
        TimeSummaryRowType.Direct,
      )}
      {createRow(
        'Cross Examinations',
        timeRemaining.cross,
        TimeSummaryRowType.Cross,
      )}
      {setup.statementsSeparate &&
        timeRemaining.close !== null &&
        !showRebuttal &&
        createRow(
          'Closing Statement',
          timeRemaining.close,
          TimeSummaryRowType.Close,
        )}
      {showRebuttal &&
        timeRemaining.rebuttal !== undefined &&
        // TODO: is it OK for the close row type to be used for the rebuttal?
        createRow('Rebuttal', timeRemaining.rebuttal, TimeSummaryRowType.Close)}
    </TimeSummaryCard>
  );
};

export default SideTimeSummary;
