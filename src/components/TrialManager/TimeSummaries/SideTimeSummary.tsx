import React, { FC, useMemo } from 'react';

import TimeSummaryRow from './TimeSummaryRow';
import colors from '../../../constants/colors';
import {
  getTotalTimeUsed,
  TotalTimeSet,
  Trial,
} from '../../../controllers/trial';
import { Side } from '../../../types/side';
import { getSideName, useLeagueFeatureFlag } from '../../../hooks/useLeague';
import TimeSummaryCard from './TimeSummaryCard';
import { League, LeagueFeature } from '../../../constants/leagues';
import { duration } from '../../../utils';

interface TimeSummaryProps {
  side: Side;
  trial: Trial;
  timeRemaining: TotalTimeSet;
  timeUsed: TotalTimeSet;
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
  Reexamination = 'Reexamination',
}

const SideTimeSummary: FC<TimeSummaryProps> = ({
  side,
  trial,
  timeRemaining,
  timeUsed,
  overtime,
  highlightRow,
  editingTimes,
}) => {
  const showOvertime = useLeagueFeatureFlag(LeagueFeature.SHOW_OVERTIME);
  const showTimeUsed = trial.league === League.Arizona;

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

  const arizonaCloseTimeRemaining = useMemo(() => {
    const totalTimeRemainingWithoutClose =
      duration.minutes(35) -
      (timeUsed.open ?? 0) -
      timeUsed.direct -
      timeUsed.cross;

    // The total time for close if the smaller of 5 minutes or total time remaining before close
    const totalTimeForClose = Math.min(
      totalTimeRemainingWithoutClose,
      duration.minutes(5),
    );

    return totalTimeForClose - (timeUsed.close ?? 0);
  }, [timeUsed.open, timeUsed.direct, timeUsed.cross, timeUsed.close]);

  // More special handling for Arizona
  const totalTimeUsedVisible = useMemo(() => {
    if (league !== League.Arizona) {
      return undefined;
    }

    if (
      trial.stage === 'close.pros' ||
      trial.stage === 'close.def' ||
      trial.stage === 'rebuttal'
    ) {
      return arizonaCloseTimeRemaining;
    }

    return duration.minutes(35) - getTotalTimeUsed(timeUsed);
  }, [trial.stage, arizonaCloseTimeRemaining, timeUsed, league]);

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
      total={
        showTimeUsed && totalTimeUsedVisible !== undefined
          ? totalTimeUsedVisible
          : undefined
      }
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
        league !== League.Arizona &&
        createRow(
          'Closing Statement',
          timeRemaining.close,
          TimeSummaryRowType.Close,
        )}
      {league === League.Arizona &&
        arizonaCloseTimeRemaining !== null &&
        createRow(
          'Closing Statement',
          arizonaCloseTimeRemaining,
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
