import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';
import merge from 'ts-deepmerge';

import { getSettings } from './settings';
import { Side } from '../types/side';
import { Json } from '../types/supabase';
import { supabase } from '../utils/supabase';
import { TrialStage } from '../constants/trial-stages';
import { migrateTrialSchema } from '../migrations/trial-migrations';
import { RoundNumber } from '../types/round-number';
import { DeepNonNullable } from 'utility-types';

export interface Trial {
  id: string;
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
  statementsSeparate: boolean;
  allLossEnabled: boolean;
  // see createNewTrial for more information
  flexEnabled: boolean;
  pretrialTime?: number;
  statementTime?: number;
  openTime?: number;
  closeTime?: number;
  directTime: number;
  crossTime: number;
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
  rebuttal: number;
}

const TRIALS_KEY = 'trials';
const TRIALS_SCHEMA_VERSION = '2.2.0';
const TRIAL_SCHEMA_VERSION_KEY = 'trials_schema_version';

export async function getTrialsFromStorage(): Promise<Trial[]> {
  const trials = await AsyncStorage.getItem(TRIALS_KEY);
  const storedSchemaVersion = await AsyncStorage.getItem(
    TRIAL_SCHEMA_VERSION_KEY,
  );

  // if the stored schema version is missing, then we won't be able to migrate/recover
  // the stored trials, so return an empty array
  if (!trials || storedSchemaVersion === null) {
    return [];
  }

  if (storedSchemaVersion !== TRIALS_SCHEMA_VERSION) {
    const migratedTrials = migrateTrialSchema(
      JSON.parse(trials),
      storedSchemaVersion,
    );
    await AsyncStorage.setItem(TRIALS_KEY, JSON.stringify(migratedTrials));
    await AsyncStorage.setItem(TRIAL_SCHEMA_VERSION_KEY, TRIALS_SCHEMA_VERSION);
    return migratedTrials;
  }

  return JSON.parse(trials);
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

  const { setup } = await getSettings();

  const stage = setup.pretrialEnabled ? 'pretrial.pros' : 'open.pros';

  const trial: Trial = {
    id,
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
  stage: string,
): DeepPartial<TrialTimes> => {
  switch (stage) {
    case 'pretrial.pros':
      return { pretrial: { pros: newValue } };
    case 'pretrial.def':
      return { pretrial: { def: newValue } };
    case 'open.pros':
      return { open: { pros: newValue } };
    case 'open.def':
      return { open: { def: newValue } };

    case 'cic.pros.one.direct':
      return {
        prosCic: {
          witnessOne: { direct: newValue },
        },
      };
    case 'cic.pros.one.cross':
      return {
        prosCic: {
          witnessOne: {
            cross: newValue,
          },
        },
      };
    case 'cic.pros.two.direct':
      return {
        prosCic: {
          witnessTwo: { direct: newValue },
        },
      };
    case 'cic.pros.two.cross':
      return {
        prosCic: {
          witnessTwo: { cross: newValue },
        },
      };
    case 'cic.pros.three.direct':
      return {
        prosCic: {
          witnessThree: { direct: newValue },
        },
      };
    case 'cic.pros.three.cross':
      return {
        prosCic: {
          witnessThree: { cross: newValue },
        },
      };

    case 'cic.def.one.direct':
      return {
        defCic: {
          witnessOne: { direct: newValue },
        },
      };
    case 'cic.def.one.cross':
      return {
        defCic: {
          witnessOne: { cross: newValue },
        },
      };
    case 'cic.def.two.direct':
      return {
        defCic: {
          witnessTwo: { direct: newValue },
        },
      };
    case 'cic.def.two.cross':
      return {
        defCic: {
          witnessTwo: { cross: newValue },
        },
      };
    case 'cic.def.three.direct':
      return {
        defCic: {
          witnessThree: { direct: newValue },
        },
      };
    case 'cic.def.three.cross':
      return {
        defCic: {
          witnessThree: { cross: newValue },
        },
      };

    case 'close.pros':
      return { close: { pros: newValue } };
    case 'close.def':
      return { close: { def: newValue } };
    case 'rebuttal':
      return { rebuttal: newValue };

    default:
      return {};
  }
};

export const getStageTime = (trial: Trial, stage: string): any => {
  const { times } = trial;

  switch (stage) {
    case 'pretrial.pros':
      return times.pretrial.pros;
    case 'pretrial.def':
      return times.pretrial.def;
    case 'open.pros':
      return times.open.pros;
    case 'open.def':
      return times.open.def;
    case 'cic.pros.one.direct':
      return times.prosCic.witnessOne.direct;
    case 'cic.pros.one.cross':
      return times.prosCic.witnessOne.cross;
    case 'cic.pros.two.direct':
      return times.prosCic.witnessTwo.direct;
    case 'cic.pros.two.cross':
      return times.prosCic.witnessTwo.cross;
    case 'cic.pros.three.direct':
      return times.prosCic.witnessThree.direct;
    case 'cic.pros.three.cross':
      return times.prosCic.witnessThree.cross;
    case 'cic.def.one.direct':
      return times.defCic.witnessOne.direct;
    case 'cic.def.one.cross':
      return times.defCic.witnessOne.cross;
    case 'cic.def.two.direct':
      return times.defCic.witnessTwo.direct;
    case 'cic.def.two.cross':
      return times.defCic.witnessTwo.cross;
    case 'cic.def.three.direct':
      return times.defCic.witnessThree.direct;
    case 'cic.def.three.cross':
      return times.defCic.witnessThree.cross;
    case 'close.pros':
      return times.close.pros;
    case 'close.def':
      return times.close.def;
    case 'rebuttal':
      return times.rebuttal;
    default:
      alert('Error!');
      return null;
  }
};

export interface TotalTimeSet {
  pretrial: number | null;
  statements: number | null;
  open: number | null;
  close: number | null;
  direct: number;
  cross: number;
}

interface TotalTimeSide {
  remaining: TotalTimeSet;
  used: NonNullable<TotalTimeSet>;
}

// TODO: HEAVILY test this!
export const getTotalTimes = (trial: Trial): Record<Side, TotalTimeSide> => {
  const { setup, times } = trial;

  const prosecutionTimeUsed = {
    pretrial: times.pretrial.pros,
    statements: times.open.pros + times.close.pros + times.rebuttal,
    open: times.open.pros,
    close: times.close.pros,
    direct:
      times.prosCic.witnessOne.direct +
      times.prosCic.witnessTwo.direct +
      times.prosCic.witnessThree.direct,
    cross:
      times.defCic.witnessOne.cross +
      times.defCic.witnessTwo.cross +
      times.defCic.witnessThree.cross,
  };

  const defenseTimeUsed = {
    pretrial: times.pretrial.def,
    statements: times.open.def + times.close.def,
    open: times.open.def,
    close: times.close.def,
    direct:
      times.defCic.witnessOne.direct +
      times.defCic.witnessTwo.direct +
      times.defCic.witnessThree.direct,
    cross:
      times.prosCic.witnessOne.cross +
      times.prosCic.witnessTwo.cross +
      times.prosCic.witnessThree.cross,
  };

  const setupPretrialTime = setup.pretrialEnabled
    ? setup.pretrialTime
    : undefined;
  const setupStatementTime = setup.statementsSeparate
    ? setup.statementTime
    : undefined;
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
    p: { remaining: prosecutionTimeRemaining, used: prosecutionTimeUsed },
    d: { remaining: defenseTimeRemaining, used: defenseTimeUsed },
  };
};

export function calculateNewTrialTime(
  trial: Trial,
  newTime: number,
  stage: string,
): Trial {
  const change = getTrialTimeChangeObject(newTime, stage);
  const newTrial = merge(trial, { times: change }) as Trial;
  return newTrial;
}

/**
 * Validates that the trial details are present and complete
 */
export function validateTrialDetails(trial: Trial): trial is UploadableTrial {
  const { details } = trial;

  if (!details) {
    return false;
  }

  const allWitnessesSet =
    trial.witnesses.p.every((w) => w !== null) &&
    trial.witnesses.d.every((w) => w !== null);

  return Boolean(
    details.round && details.side && details.tournamentId && allWitnessesSet,
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
