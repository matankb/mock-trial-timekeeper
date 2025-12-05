import { League } from '../constants/leagues';
import { isTrialStage, TrialStage } from '../constants/trial-stages';
import { defaultSettings } from '../controllers/settings';
import { Trial } from '../controllers/trial';
import { isRoundNumber, RoundNumber } from '../types/round-number';
import { createArrayMigration } from './migration';

interface TrialSchema_1_0_0 {
  id: string;
  name: string;
  date: number;
  stage: string;
  setup: {
    statementTime: number;
    directTime: number;
    crossTime: number;
    allLoss: number;
  };
  times: {
    open: { pros: number; def: number };
    close: { pros: number; def: number };
    rebuttal: number;
    prosCic: {
      witnessOne: { direct: number; cross: number };
      witnessTwo: { direct: number; cross: number };
      witnessThree: { direct: number; cross: number };
    };
    defCic: {
      witnessOne: { direct: number; cross: number };
      witnessTwo: { direct: number; cross: number };
      witnessThree: { direct: number; cross: number };
    };
  };
}

interface TrialSchema_2_1_0 {
  id: string;
  name: string;
  date: number;
  stage: string;
  loss: number;
  times: {
    pretrial: { pros: number; def: number };
    open: { pros: number; def: number };
    close: { pros: number; def: number };
    rebuttal: number;
    prosCic: {
      witnessOne: { direct: number; cross: number };
      witnessTwo: { direct: number; cross: number };
      witnessThree: { direct: number; cross: number };
    };
    defCic: {
      witnessOne: { direct: number; cross: number };
      witnessTwo: { direct: number; cross: number };
      witnessThree: { direct: number; cross: number };
    };
  };
  setup: {
    pretrialEnabled: boolean;
    statementsSeparate: boolean;
    allLossEnabled: boolean;
    flexEnabled: boolean;
    pretrialTime?: number;
    statementTime?: number;
    openTime?: number;
    closeTime?: number;
    directTime: number;
    crossTime: number;
  };
  details?: {
    witnesses: {
      p: [string | null, string | null, string | null];
      d: [string | null, string | null, string | null];
    };
    tournamentId: string;
    round: number;
    side: 'p' | 'd';
  };
}

interface TrialSchema_2_2_0 {
  id: string;
  name: string;
  date: number;
  stage: string;
  loss: number;
  times: {
    pretrial: { pros: number; def: number };
    open: { pros: number; def: number };
    close: { pros: number; def: number };
    rebuttal: number;
    prosCic: {
      witnessOne: { direct: number; cross: number };
      witnessTwo: { direct: number; cross: number };
      witnessThree: { direct: number; cross: number };
    };
    defCic: {
      witnessOne: { direct: number; cross: number };
      witnessTwo: { direct: number; cross: number };
      witnessThree: { direct: number; cross: number };
    };
  };
  setup: {
    pretrialEnabled: boolean;
    statementsSeparate: boolean;
    allLossEnabled: boolean;
    flexEnabled: boolean;
    pretrialTime?: number;
    statementTime?: number;
    openTime?: number;
    closeTime?: number;
    directTime: number;
    crossTime: number;
  };
  witnesses: {
    p: [string | null, string | null, string | null];
    d: [string | null, string | null, string | null];
  };
  details?: {
    tournamentId: string;
    round: number;
    side: 'p' | 'd';
  };
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type -- This is the current schema
interface TrialSchema_2_3_0 extends Trial {}

export const trialMigrations = [
  // 1.0.0 -> 2.1.0: Add pretrial and loss fields
  createArrayMigration<TrialSchema_1_0_0, TrialSchema_2_1_0>({
    from: '1.0.0',
    to: '2.1.0',
    migrate: (trial) => {
      return {
        ...trial,
        times: {
          ...trial.times,
          pretrial: {
            pros: 0,
            def: 0,
          },
        },
        loss: trial.setup.allLoss,
        setup: {
          pretrialEnabled: defaultSettings.setup.pretrialEnabled,
          statementsSeparate: defaultSettings.setup.statementsSeparate,
          allLossEnabled: defaultSettings.setup.allLossEnabled,
          flexEnabled: false,
          pretrialTime: defaultSettings.setup.pretrialTime,
          statementTime: trial.setup.statementTime,
          openTime: defaultSettings.setup.openTime,
          closeTime: defaultSettings.setup.closeTime,
          directTime: trial.setup.directTime,
          crossTime: trial.setup.crossTime,
        },
      };
    },
  }),

  // 2.1.0 -> 2.2.0: Moved witness names from details to main trial object
  createArrayMigration<TrialSchema_2_1_0, TrialSchema_2_2_0>({
    from: '2.1.0',
    to: '2.2.0',
    migrate: (trial) => {
      const newWitnesses = trial.details
        ? trial.details.witnesses
        : {
            p: [null, null, null] as [null, null, null],
            d: [null, null, null] as [null, null, null],
          };

      // this check should not be needed, since the new schema just adds a type-safety layer
      // to same constants, but we check anyways to avoid casting
      const newStage = isTrialStage(trial.stage) ? trial.stage : 'open.pros';

      const newTrial: TrialSchema_2_2_0 = {
        id: trial.id,
        name: trial.name,
        date: trial.date,
        loss: trial.loss,
        times: trial.times,
        setup: trial.setup,
        stage: newStage,
        witnesses: {
          p: newWitnesses.p,
          d: newWitnesses.d,
        },
      };

      if (trial.details) {
        const newRound = isRoundNumber(trial.details.round)
          ? trial.details.round
          : 1;

        newTrial.details = {
          tournamentId: trial.details.tournamentId,
          round: newRound,
          side: trial.details.side,
        };
      }

      return newTrial;
    },
  }),

  // 2.2.0 -> 2.3.0: Added league, joint trial times, and more setup options for MN release
  createArrayMigration<TrialSchema_2_2_0, TrialSchema_2_3_0>({
    from: '2.2.0',
    to: '2.3.0',
    migrate: (trial) => {
      return {
        ...trial,
        // this migration added multiple new stages, but no need to do any
        // actual migration for them, since it didn't remove any existing stages
        stage: trial.stage as TrialStage,
        // Any existing trial is assumed to be from AMTA, since it was the only league before this change
        league: League.AMTA,
        // Same for detils
        details: trial.details
          ? {
              ...trial.details,
              round: trial.details.round as RoundNumber | null,
            }
          : undefined,
        times: {
          ...trial.times,
          joint: {
            prepClosings: 0,
            conference: 0,
          },
        },
        setup: {
          ...trial.setup,
          rebuttalMaxEnabled: false,
          jointPrepClosingsEnabled: false,
          jointConferenceEnabled: false,
          rebuttalMaxTime: defaultSettings.setup.rebuttalMaxTime,
          jointPrepClosingsTime: 0,
          jointConferenceTime: 0,
        },
      };
    },
  }),
];
