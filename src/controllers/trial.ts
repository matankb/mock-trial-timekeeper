import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';
import merge from 'ts-deepmerge';

import { defaultSettings, getSettings } from './settings';

export interface Trial {
  id: string;
  name: string;
  date: number;
  setup: TrialSetup;
  stage: string;
  times: TrialTimes;
  loss: number;
}

export interface TrialSetup {
  pretrialEnabled: boolean;
  statementsSeparate: boolean;
  allLossEnabled: boolean;
  pretrialTime?: number;
  statementTime?: number;
  openTime?: number;
  closeTime?: number;
  directTime: number;
  crossTime: number;
}

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
const TRIALS_SCHEMA_VERSION = '2.1.0';
const TRIAL_SCHEMA_VERSION_KEY = 'trials_schema_version';

function migrateSchemaVersion(oldTrials: any, oldVersion: string): Trial[] {
  if (oldVersion === '1.0.0') {
    return oldTrials.map((trial: any) => {
      const newTrial: Trial = {
        ...trial,
        times: {
          ...trial.times,
          pretrial: generateEmptyStatementTimeSet(),
        },
        loss: trial.setup.allLoss,
        // Version 1.0.0 only had default setups
        setup: defaultSettings.setup,
      };

      return newTrial;
    });
  }

  return oldTrials;
}

export async function getTrialsFromStorage(): Promise<Trial[]> {
  const trials = await AsyncStorage.getItem(TRIALS_KEY);
  const schemaVersion = await AsyncStorage.getItem(TRIAL_SCHEMA_VERSION_KEY);

  if (!trials) {
    return [];
  }

  if (schemaVersion !== TRIALS_SCHEMA_VERSION) {
    const migratedTrials = migrateSchemaVersion(
      JSON.parse(trials),
      schemaVersion,
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
): Promise<Trial> {
  const id = uuid.v4() as string;
  const date = new Date().valueOf();

  const { setup } = await getSettings();

  const stage = setup.pretrialEnabled ? 'pretrial.pros' : 'open.pros';

  const trial: Trial = {
    id,
    name,
    date,
    setup,
    loss: allLoss,
    stage,
    times: generateEmptyTrialTimes(),
  };

  await setTrialToStorage(trial);
  return trial;
}

// TODO: there *must* be something better than this, jeez

type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};

// TODO: can the first arg be removed?
const getTrialTimeChangeObject = (
  trial: Trial,
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

export function calculateNewTrialTime(
  trial: Trial,
  newTime: number,
  stage: string,
): Trial {
  const change = getTrialTimeChangeObject(trial, newTime, stage);
  const newTrial = merge(trial, { times: change }) as Trial;
  return newTrial;
}
