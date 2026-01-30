import { Mutable } from 'utility-types';
import { Trial } from '../controllers/trial';
import { Side } from '../types/side';
import { Prefixes } from '../utils';
import { getSideName } from '../hooks/useLeagueFeatureFlag';
import { League } from './leagues';

export const stages = [
  'pretrial.pros',
  'pretrial.def',
  'open.pros',
  'open.def',
  'cic.pros.one.direct',
  'cic.pros.one.cross',
  'cic.pros.one.redirect',
  'cic.pros.one.recross',
  'cic.pros.two.direct',
  'cic.pros.two.cross',
  'cic.pros.two.redirect',
  'cic.pros.two.recross',
  'cic.pros.three.direct',
  'cic.pros.three.cross',
  'cic.pros.three.redirect',
  'cic.pros.three.recross',
  'cic.def.one.direct',
  'cic.def.one.cross',
  'cic.def.one.redirect',
  'cic.def.one.recross',
  'cic.def.two.direct',
  'cic.def.two.cross',
  'cic.def.two.redirect',
  'cic.def.two.recross',
  'cic.def.three.direct',
  'cic.def.three.cross',
  'cic.def.three.redirect',
  'cic.def.three.recross',
  'joint.prep.closings',
  'close.pros',
  'close.def',
  'rebuttal',
  'joint.conference',
] as const;

export type TrialStage = (typeof stages)[number];

export function isTrialStage(stage: string): stage is TrialStage {
  return stages.includes(stage as TrialStage);
}

// get the stages that are in use for this trial
export function getTrialStages(trial: Trial): readonly Partial<TrialStage>[] {
  let trialStages: Mutable<Partial<TrialStage>>[] = [...stages];

  if (!trial.setup.pretrialEnabled) {
    trialStages = trialStages.filter(
      (stage) => stage !== 'pretrial.pros' && stage !== 'pretrial.def',
    );
  }

  if (!trial.setup.jointPrepClosingsEnabled) {
    trialStages = trialStages.filter(
      (stage) => stage !== 'joint.prep.closings',
    );
  }

  if (!trial.setup.jointConferenceEnabled) {
    trialStages = trialStages.filter((stage) => stage !== 'joint.conference');
  }

  if (!trial.setup.reexaminationsEnabled) {
    trialStages = trialStages.filter(
      (stage) => !stage.includes('redirect') && !stage.includes('recross'),
    );
  }

  return trialStages;
}

export const getNextStage = (trial: Trial) => {
  const trialStages = getTrialStages(trial);
  const index = trialStages.indexOf(trial.stage);
  if (index === trialStages.length - 1) {
    return trialStages[0];
  }
  return trialStages[index + 1];
};

export const getPrevStage = (trial: Trial) => {
  const trialStages = getTrialStages(trial);
  const index = trialStages.indexOf(trial.stage);
  if (index === 0) {
    return trialStages[trialStages.length - 1];
  }
  return trialStages[index - 1];
};

const getWitnessName = (trial: Trial, stage: TrialStage, side: Side) => {
  const { witnesses } = trial;
  const sideName = getSideName(side, trial.league, new Date(trial.date));

  const witnessNameMap: Partial<Record<Prefixes<TrialStage>, string | null>> = {
    'cic.pros.one': witnesses.p[0],
    'cic.pros.two': witnesses.p[1],
    'cic.pros.three': witnesses.p[2],
    'cic.def.one': witnesses.d[0],
    'cic.def.two': witnesses.d[1],
    'cic.def.three': witnesses.d[2],
  };

  // If the witness name has been set, use it
  for (const [prefix, name] of Object.entries(witnessNameMap)) {
    if (stage.startsWith(prefix) && name !== null) {
      return name;
    }
  }

  // If the witness name has not been set, use the default witness name
  if (stage.includes('one')) {
    return `${sideName} Witness #1`;
  } else if (stage.includes('two')) {
    return `${sideName} Witness #2`;
  } else if (stage.includes('three')) {
    return `${sideName} Witness #3`;
  } else {
    return `${sideName} Witness`;
  }
};

export const getCurrentStageName = (trial: Trial) => {
  const { stage } = trial;
  return getStageName(stage, trial);
};

/**
 *
 * @param minimal - If true, the side name and examination type is omitted. e.g., "Opening", "Witness #1" vs "Opening Statement", "Prosecution Witness #1"
 */
export const getStageName = (
  stage: TrialStage,
  trial: Trial,
  minimal: boolean = false,
) => {
  const side: Side = stage.includes('pros') ? 'p' : 'd';
  const sideName = getSideName(side, trial.league, new Date(trial.date));

  if (stage.startsWith('pretrial')) {
    return minimal ? 'Pretrial' : `${sideName} Pretrial`;
  } else if (stage.startsWith('cic')) {
    const examination = stage.includes('.direct') // testing for . is important, because .redirect also exists
      ? 'Direct'
      : stage.includes('.cross')
        ? 'Cross'
        : stage.includes('.redirect')
          ? 'Re-direct'
          : 'Re-cross';
    const name = getWitnessName(trial, stage, side);
    return minimal ? name : `${name} - ${examination}`;
  } else if (stage.startsWith('open')) {
    return minimal ? 'Opening' : `${sideName} Opening`;
  } else if (stage.startsWith('close')) {
    return minimal ? 'Closing' : `${sideName} Closing`;
  } else if (stage.startsWith('rebuttal')) {
    return 'Rebuttal';
  } else if (stage === 'joint.prep.closings') {
    return 'Preparation for Closings';
    // TODO: maybe rename this to "posttrial or something, to make it generic"
  } else if (stage === 'joint.conference') {
    if (trial.league === League.Idaho) {
      return 'Judge Comments (Regionals Only)';
    }
    return 'Team Conference';
  }

  return stage;
};
