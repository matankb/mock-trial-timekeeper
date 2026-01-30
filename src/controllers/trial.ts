import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';
import merge from 'ts-deepmerge';

import { getSettings } from './settings';
import { Side } from '../types/side';
import { Json } from '../types/supabase';
import { supabase } from '../utils/supabase';
import { TrialStage } from '../constants/trial-stages';
import { trialMigrations } from '../migrations/trial-migrations';
import { RoundNumber } from '../types/round-number';
import { DeepNonNullable } from 'utility-types';
import { League } from '../constants/leagues';
import { getStorageItem } from '../migrations/migration';

export interface Trial {
  id: string;
  league: League;
  name: string;
  date: number;
  setup: TrialSetup;
  stage: TrialStage;
  times: TrialTimes;
  witnesses: TrialWitnesses;
  loss: number;
  details?: TrialDetails; // details are undefined if not connected to school account
}

interface UploadableTrial extends Trial {
  details: DeepNonNullable<TrialDetails>;
}

export interface TrialSetup {
  pretrialEnabled: boolean;
  rebuttalMaxEnabled: boolean;
  jointPrepClosingsEnabled: boolean;
  jointConferenceEnabled: boolean;
  statementsSeparate: boolean;
  allLossEnabled: boolean;
  reexaminationsEnabled: boolean;

  // see createNewTrial for more information
  flexEnabled: boolean;

  pretrialTime?: number;
  statementTime?: number;
  openTime?: number;
  closeTime?: number;
  rebuttalMaxTime?: number;
  directTime: number;
  crossTime: number;
  jointPrepClosingsTime?: number;
  jointConferenceTime?: number;
}

// Witness call

export interface TrialWitnesses {
  p: TrialWitnessCall;
  d: TrialWitnessCall;
}

// Trial details used to upload to school account
// All optional because user is not required to fill out details until upload is pressed.
export interface TrialDetails {
  tournamentId: string | null;
  round: RoundNumber | null;
  side: Side | null;
}

export type TrialWitnessCall = [string | null, string | null, string | null];

export interface StatementTimeSet {
  pros: number;
  def: number;
}

export interface WitnessTimeSet {
  direct: number;
  cross: number;
  redirect: number;
  recross: number;
}

export interface CaseInChief {
  witnessOne: WitnessTimeSet;
  witnessTwo: WitnessTimeSet;
  witnessThree: WitnessTimeSet;
}

export interface TrialTimes {
  pretrial: StatementTimeSet;
  open: StatementTimeSet;
  close: StatementTimeSet;
  prosCic: CaseInChief;
  defCic: CaseInChief;
  joint: {
    prepClosings: number;
    conference: number;
  };
  rebuttal: number;
}

const TRIALS_KEY = 'trials';
const TRIALS_SCHEMA_VERSION = '2.3.0';
const TRIAL_SCHEMA_VERSION_KEY = 'trials_schema_version';

export async function getTrialsFromStorage(): Promise<Trial[]> {
  return getStorageItem({
    key: TRIALS_KEY,
    schemaVersionKey: TRIAL_SCHEMA_VERSION_KEY,
    currentSchemaVersion: TRIALS_SCHEMA_VERSION,
    migrations: trialMigrations,
    defaultValue: [],
  });
}

export async function setTrialToStorage(trial: Trial) {
  const trials = await getTrialsFromStorage();
  const trialIndex = trials.findIndex((t) => t.id === trial.id);

  if (trialIndex === -1) {
    trials.push(trial);
  } else {
    trials[trialIndex] = trial;
  }

  AsyncStorage.setItem(TRIAL_SCHEMA_VERSION_KEY, TRIALS_SCHEMA_VERSION);
  return AsyncStorage.setItem(TRIALS_KEY, JSON.stringify(trials));
}

export async function deleteTrial(id: string) {
  const trials = await getTrialsFromStorage();
  const trialIndex = trials.findIndex((t) => t.id === id);
  if (trialIndex > -1) {
    trials.splice(trialIndex, 1);
  }
  return AsyncStorage.setItem(TRIALS_KEY, JSON.stringify(trials));
}

function generateEmptyStatementTimeSet(): StatementTimeSet {
  return {
    pros: 0,
    def: 0,
  };
}

function generateEmptyWitnessTimeSet(): WitnessTimeSet {
  return {
    direct: 0,
    cross: 0,
    redirect: 0,
    recross: 0,
  };
}

function generateEmptyCaseInChief(): CaseInChief {
  return {
    witnessOne: generateEmptyWitnessTimeSet(),
    witnessTwo: generateEmptyWitnessTimeSet(),
    witnessThree: generateEmptyWitnessTimeSet(),
  };
}

function generateEmptyTrialTimes(): TrialTimes {
  return {
    // pretrial is always generated, is hidden by UI if not enabled
    pretrial: generateEmptyStatementTimeSet(),
    open: generateEmptyStatementTimeSet(),
    close: generateEmptyStatementTimeSet(),
    rebuttal: 0,
    prosCic: generateEmptyCaseInChief(),
    defCic: generateEmptyCaseInChief(),
    joint: {
      prepClosings: 0,
      conference: 0,
    },
  };
}

/**
 * DEFAULT SETUP:
  {
      statementTime: 14 * 60,
      directTime: 25 * 60,
      crossTime: 25 * 60,
    },
 */

export async function createNewTrial(
  name: string,
  allLoss: number,
  witnesses: TrialWitnesses,
  details?: TrialDetails,
): Promise<Trial> {
  const id = uuid.v4() as string;
  const date = new Date().valueOf();

  const { setup, league } = await getSettings();
  const selectedLeague = league.league ?? League.AMTA; // this should never be null, but handle it in case

  const stage = setup.pretrialEnabled ? 'pretrial.pros' : 'open.pros';

  const trial: Trial = {
    id,
    league: selectedLeague,
    name,
    date,
    setup: {
      ...setup,
      // In the Summer 2025 AMTA board meeting, flex timing was voted down.
      // Following that, in v1.7.0, flex timing was removed from the codebase
      // for simplicity. To keep type safety and avoid the need to migrate
      // in case it is brought back in the future, we always set it to false.
      // Note: the codebase does not currently handle flex timing,
      // even for old trials where it was enabled, since it is highly unlikely
      // that users will be looking at old trials with flex time from previous seasons.
      flexEnabled: false,
    },
    loss: allLoss,
    stage,
    witnesses,
    times: generateEmptyTrialTimes(),
    details,
  };

  await setTrialToStorage(trial);
  return trial;
}

type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};

const getTrialTimeChangeObject = (
  newValue: number,
  stage: TrialStage,
): DeepPartial<TrialTimes> => {
  const stageMap: Record<TrialStage, DeepPartial<TrialTimes>> = {
    'pretrial.pros': { pretrial: { pros: newValue } },
    'pretrial.def': { pretrial: { def: newValue } },
    'open.pros': { open: { pros: newValue } },
    'open.def': { open: { def: newValue } },
    'cic.pros.one.direct': { prosCic: { witnessOne: { direct: newValue } } },
    'cic.pros.one.cross': { prosCic: { witnessOne: { cross: newValue } } },
    'cic.pros.one.redirect': {
      prosCic: { witnessOne: { redirect: newValue } },
    },
    'cic.pros.one.recross': { prosCic: { witnessOne: { recross: newValue } } },
    'cic.pros.two.direct': { prosCic: { witnessTwo: { direct: newValue } } },
    'cic.pros.two.cross': { prosCic: { witnessTwo: { cross: newValue } } },
    'cic.pros.two.redirect': {
      prosCic: { witnessTwo: { redirect: newValue } },
    },
    'cic.pros.two.recross': { prosCic: { witnessTwo: { recross: newValue } } },
    'cic.pros.three.direct': {
      prosCic: { witnessThree: { direct: newValue } },
    },
    'cic.pros.three.cross': { prosCic: { witnessThree: { cross: newValue } } },
    'cic.pros.three.redirect': {
      prosCic: { witnessThree: { redirect: newValue } },
    },
    'cic.pros.three.recross': {
      prosCic: { witnessThree: { recross: newValue } },
    },
    'cic.def.one.direct': { defCic: { witnessOne: { direct: newValue } } },
    'cic.def.one.cross': { defCic: { witnessOne: { cross: newValue } } },
    'cic.def.one.redirect': { defCic: { witnessOne: { redirect: newValue } } },
    'cic.def.one.recross': { defCic: { witnessOne: { recross: newValue } } },
    'cic.def.two.direct': { defCic: { witnessTwo: { direct: newValue } } },
    'cic.def.two.cross': { defCic: { witnessTwo: { cross: newValue } } },
    'cic.def.two.redirect': { defCic: { witnessTwo: { redirect: newValue } } },
    'cic.def.two.recross': { defCic: { witnessTwo: { recross: newValue } } },
    'cic.def.three.direct': { defCic: { witnessThree: { direct: newValue } } },
    'cic.def.three.cross': { defCic: { witnessThree: { cross: newValue } } },
    'cic.def.three.redirect': {
      defCic: { witnessThree: { redirect: newValue } },
    },
    'cic.def.three.recross': {
      defCic: { witnessThree: { recross: newValue } },
    },
    'close.pros': { close: { pros: newValue } },
    'close.def': { close: { def: newValue } },
    rebuttal: { rebuttal: newValue },
    'joint.prep.closings': { joint: { prepClosings: newValue } },
    'joint.conference': { joint: { conference: newValue } },
  };

  if (!stageMap[stage]) {
    throw new Error(`Unknown stage: ${stage}`);
  }

  return stageMap[stage];
};

export const getStageTime = (trial: Trial, stage: TrialStage): number => {
  const { times } = trial;

  const stageTimeMap: Record<TrialStage, number> = {
    'pretrial.pros': times.pretrial.pros,
    'pretrial.def': times.pretrial.def,
    'open.pros': times.open.pros,
    'open.def': times.open.def,
    'cic.pros.one.direct': times.prosCic.witnessOne.direct,
    'cic.pros.one.cross': times.prosCic.witnessOne.cross,
    'cic.pros.one.redirect': times.prosCic.witnessOne.redirect,
    'cic.def.one.recross': times.defCic.witnessOne.recross,
    'cic.pros.two.direct': times.prosCic.witnessTwo.direct,
    'cic.pros.two.cross': times.prosCic.witnessTwo.cross,
    'cic.pros.two.redirect': times.prosCic.witnessTwo.redirect,
    'cic.def.two.recross': times.defCic.witnessTwo.recross,
    'cic.pros.three.direct': times.prosCic.witnessThree.direct,
    'cic.pros.three.cross': times.prosCic.witnessThree.cross,
    'cic.pros.three.redirect': times.prosCic.witnessThree.redirect,
    'cic.def.three.recross': times.defCic.witnessThree.recross,
    'cic.def.one.direct': times.defCic.witnessOne.direct,
    'cic.def.one.cross': times.defCic.witnessOne.cross,
    'cic.def.one.redirect': times.defCic.witnessOne.redirect,
    'cic.pros.one.recross': times.prosCic.witnessOne.recross,
    'cic.def.two.direct': times.defCic.witnessTwo.direct,
    'cic.def.two.cross': times.defCic.witnessTwo.cross,
    'cic.def.two.redirect': times.defCic.witnessTwo.redirect,
    'cic.pros.two.recross': times.prosCic.witnessTwo.recross,
    'cic.def.three.direct': times.defCic.witnessThree.direct,
    'cic.def.three.cross': times.defCic.witnessThree.cross,
    'cic.def.three.redirect': times.defCic.witnessThree.redirect,
    'cic.pros.three.recross': times.prosCic.witnessThree.recross,
    'close.pros': times.close.pros,
    'close.def': times.close.def,
    rebuttal: times.rebuttal,
    'joint.prep.closings': times.joint.prepClosings,
    'joint.conference': times.joint.conference,
  };

  const time = stageTimeMap[stage];

  if (time === undefined) {
    throw new Error(`Unknown stage: ${stage}`);
  }

  return time;
};

export interface TotalTimeSet {
  pretrial: number | null;
  statements: number | null;
  open: number | null;
  close: number | null;
  rebuttal?: number;
  direct: number;
  cross: number;
}

interface TotalTimeSide {
  remaining: TotalTimeSet;
  used: NonNullable<TotalTimeSet>;
  overtime: number;
}

// TODO: HEAVILY test this!
export const getTotalTimes = (trial: Trial): Record<Side, TotalTimeSide> => {
  const { setup, times } = trial;

  const prosecutionTimeUsed = {
    pretrial: times.pretrial.pros,
    statements: times.open.pros + times.close.pros + times.rebuttal,
    open: times.open.pros,
    close: times.close.pros + times.rebuttal,
    direct:
      times.prosCic.witnessOne.direct +
      times.prosCic.witnessTwo.direct +
      times.prosCic.witnessThree.direct +
      (setup.reexaminationsEnabled
        ? times.prosCic.witnessOne.redirect +
          times.prosCic.witnessTwo.redirect +
          times.prosCic.witnessThree.redirect
        : 0),
    cross:
      times.defCic.witnessOne.cross +
      times.defCic.witnessTwo.cross +
      times.defCic.witnessThree.cross +
      (setup.reexaminationsEnabled
        ? times.defCic.witnessOne.recross +
          times.defCic.witnessTwo.recross +
          times.defCic.witnessThree.recross
        : 0),
  };

  const defenseTimeUsed = {
    pretrial: times.pretrial.def,
    statements: times.open.def + times.close.def,
    open: times.open.def,
    close: times.close.def,
    direct:
      times.defCic.witnessOne.direct +
      times.defCic.witnessTwo.direct +
      times.defCic.witnessThree.direct +
      (setup.reexaminationsEnabled
        ? times.defCic.witnessOne.redirect +
          times.defCic.witnessTwo.redirect +
          times.defCic.witnessThree.redirect
        : 0),
    cross:
      times.prosCic.witnessOne.cross +
      times.prosCic.witnessTwo.cross +
      times.prosCic.witnessThree.cross +
      (setup.reexaminationsEnabled
        ? times.prosCic.witnessOne.recross +
          times.prosCic.witnessTwo.recross +
          times.prosCic.witnessThree.recross
        : 0),
  };

  const setupPretrialTime = setup.pretrialEnabled
    ? setup.pretrialTime
    : undefined;
  const setupStatementTime = setup.statementsSeparate
    ? undefined
    : setup.statementTime;
  const setupOpenTime = setup.statementsSeparate ? setup.openTime : undefined;
  const setupCloseTime = setup.statementsSeparate ? setup.closeTime : undefined;

  const prosecutionTimeRemaining = {
    pretrial:
      setupPretrialTime !== undefined
        ? setupPretrialTime - prosecutionTimeUsed.pretrial
        : null,
    statements:
      setupStatementTime !== undefined
        ? setupStatementTime - prosecutionTimeUsed.statements
        : null,
    open:
      setupOpenTime !== undefined
        ? setupOpenTime - prosecutionTimeUsed.open
        : null,
    close:
      setupCloseTime !== undefined
        ? setupCloseTime - prosecutionTimeUsed.close
        : null,
    direct: setup.directTime - prosecutionTimeUsed.direct,
    cross: setup.crossTime - prosecutionTimeUsed.cross,
    rebuttal: getRebuttalTimeRemaining(trial), // only used when rebuttal max is enabled
  };

  const defenseTimeRemaining = {
    pretrial:
      setup.pretrialEnabled && setup.pretrialTime !== undefined
        ? setup.pretrialTime - defenseTimeUsed.pretrial
        : null,
    statements:
      setupStatementTime !== undefined
        ? setupStatementTime - defenseTimeUsed.statements
        : null,
    open:
      setupOpenTime !== undefined ? setupOpenTime - defenseTimeUsed.open : null,
    close:
      setupCloseTime !== undefined
        ? setupCloseTime - defenseTimeUsed.close
        : null,
    direct: setup.directTime - defenseTimeUsed.direct,
    cross: setup.crossTime - defenseTimeUsed.cross,
  };

  return {
    p: {
      remaining: prosecutionTimeRemaining,
      used: prosecutionTimeUsed,
      overtime: getOvertime(prosecutionTimeRemaining),
    },
    d: {
      remaining: defenseTimeRemaining,
      used: defenseTimeUsed,
      overtime: getOvertime(defenseTimeRemaining),
    },
  };
};

// TODO: right now, this only works with Idaho's setup. Not sure if it is generalizable at the moment.
function getOvertime(timeRemaining: TotalTimeSet): number {
  let overtime = 0;

  const remaining = [
    timeRemaining.direct,
    timeRemaining.cross,
    timeRemaining.open,
    timeRemaining.close,
  ];

  for (const time of remaining) {
    if (time !== null && time < 0) {
      overtime += Math.abs(time);
    }
  }

  return overtime;
}

const getRebuttalTimeRemaining = (trial: Trial): number => {
  const { setup, times } = trial;

  const setupMaxRebuttalTime = setup.rebuttalMaxEnabled
    ? setup.rebuttalMaxTime
    : undefined;
  const currentRebuttalTime = times.rebuttal;

  // Calculate how much time is available for the rebuttal, before the rebuttal is started and before incorporating the max time
  let totalRebuttalTimeBeforeMax;
  if (setup.statementsSeparate) {
    // TODO: UGH the bangs. I should run a migration that makes these all not null. Okay I'm
    totalRebuttalTimeBeforeMax = setup.closeTime! - times.close.pros;
  } else {
    totalRebuttalTimeBeforeMax =
      setup.statementTime! - times.open.pros - times.close.pros;
  }

  // Calculate how much time is actually available for the rebuttal, before the rebuttal is started
  let totalRebuttalTime;
  if (setup.rebuttalMaxEnabled) {
    totalRebuttalTime = Math.min(
      totalRebuttalTimeBeforeMax,
      setupMaxRebuttalTime!,
    ); // TODO: UGH the bangs.
  } else {
    totalRebuttalTime = totalRebuttalTimeBeforeMax;
  }

  // Subtract the current rebuttal time from the total rebuttal time to get the remaining rebuttal time
  return totalRebuttalTime - currentRebuttalTime;
};

export function calculateNewTrialTime(
  trial: Trial,
  newTime: number,
  stage: TrialStage,
): Trial {
  const change = getTrialTimeChangeObject(newTime, stage);
  const newTrial = merge(trial, { times: change }) as Trial;
  return newTrial;
}

/**
 * Validates that the trial details are present and complete
 */
export function validateTrialDetails(
  trial: Trial,
  checkWitnesses: boolean = true,
): trial is UploadableTrial {
  const { details } = trial;

  if (!details) {
    return false;
  }

  const allWitnessesSet =
    trial.witnesses.p.every((w) => w !== null) &&
    trial.witnesses.d.every((w) => w !== null);

  return Boolean(
    details.round &&
    details.side &&
    details.tournamentId &&
    (checkWitnesses ? allWitnessesSet : true),
  );
}

export async function uploadTrialToSchoolAccount(trial: UploadableTrial) {
  const { error } = await supabase.from('trials').upsert({
    id: trial.id, // mirror the id
    tournament_id: trial.details.tournamentId,
    data: trial as unknown as Json,
  });

  return { error };
}
