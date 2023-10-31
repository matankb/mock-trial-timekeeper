import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';
import merge from 'ts-deepmerge';

export interface Trial {
  id: string;
  name: string;
  date: number;
  setup: TrialSetup;
  stage: string;
  times: TrialTimes;
}

export interface TrialSetup {
  statementTime: number;
  directTime: number;
  crossTime: number;
  allLoss: number; // time of all-loss
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
  open: StatementTimeSet;
  close: StatementTimeSet;
  prosCic: CaseInChief;
  defCic: CaseInChief;
  rebuttal: number;
}

const TRIALS_KEY = 'trials';
const TRIAL_SCHEMA_VERSION_KEY = 'trials_schema_version';

export async function getTrialsFromStorage(): Promise<Trial[]> {
  const trials = await AsyncStorage.getItem(TRIALS_KEY);
  return trials ? JSON.parse(trials) : [];
}

export async function getTrialFromStorage(id: string) {
  const trials = await getTrialsFromStorage();
  return trials.find((trial) => trial.id === id);
}

export async function setTrialToStorage(trial: Trial) {
  const trials = await getTrialsFromStorage();
  const trialIndex = trials.findIndex((t) => t.id === trial.id);

  if (trialIndex === -1) {
    trials.push(trial);
  } else {
    trials[trialIndex] = trial;
  }

  AsyncStorage.setItem(TRIAL_SCHEMA_VERSION_KEY, '1.0.0');
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
  // setup: TrialSetup
  allLoss: number,
): Promise<Trial> {
  const id = uuid.v4() as string;
  const date = new Date().valueOf();

  const setup = {
    statementTime: 14 * 60,
    directTime: 25 * 60,
    crossTime: 25 * 60,
    allLoss,
  };

  const trial: Trial = {
    id,
    name,
    date,
    setup,
    stage: 'open.pros',
    times: {
      open: { pros: 0, def: 0 },
      close: { pros: 0, def: 0 },
      rebuttal: 0,
      prosCic: generateEmptyCaseInChief(),
      defCic: generateEmptyCaseInChief(),
    },
  };

  await setTrialToStorage(trial);
  return trial;
}

// TODO: there *must* be something better than this, jeez

const getTrialTimeChangeObject = (
  trial: Trial,
  newValue: number,
  stage: string,
): any => {
  switch (stage) {
    case 'open.pros':
      return { open: { pros: newValue } };
    case 'open.def':
      return { open: { def: newValue } };

    case 'cic.pros.one.direct':
      return {
        prosCic: {
          one: { direct: newValue },
        },
      };
    case 'cic.pros.one.cross':
      return {
        cic: {
          pros: {
            one: {
              cross: newValue,
            },
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
          one: { direct: newValue },
        },
      };
    case 'cic.def.one.cross':
      return {
        defCic: {
          one: { cross: newValue },
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
