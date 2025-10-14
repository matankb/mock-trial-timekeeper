import { isTrialStage } from '../constants/trial-stages';
import { defaultSettings } from '../controllers/settings';
import { Trial } from '../controllers/trial';
import { isRoundNumber } from '../types/round-number';

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

// eslint-disable-next-line @typescript-eslint/no-empty-object-type -- This is the current schema
interface TrialSchema_2_2_0 extends Trial {}

export function migrateTrialSchema(
  oldTrials: any[],
  oldVersion: string,
): Trial[] {
  let latestTrials: any[] = oldTrials;

  // Important: each migration should *not* break after the case, to allow for cascading migrations
  switch (oldVersion) {
    /**
     * Migration: 1.0.0 to 2.1.0
     * - Added pretrial to time set
     * - Added custom setups (v1.0.0 only had default setups)
     * Note: v2.0.0 never existed
     */
    case '1.0.0':
      latestTrials = latestTrials.map((trial: TrialSchema_1_0_0) => {
        const newTrial: TrialSchema_2_1_0 = {
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

        return newTrial;
      }) satisfies TrialSchema_2_1_0[]; // Intentionally no break.
    /**
     * Migration: 2.1.0 to 2.2.0
     * - Moved witness names from details to main trial object
     */
    case '2.1.0':
      latestTrials = latestTrials.map((trial: TrialSchema_2_1_0) => {
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
      }) satisfies TrialSchema_2_2_0[]; // Intentionally no break.
  }

  return latestTrials;
}
