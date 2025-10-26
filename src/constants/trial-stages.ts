import { Trial } from '../controllers/trial';
import { Side } from '../types/side';
import { getSideName } from '../utils';

export const stages = [
  'pretrial.pros',
  'pretrial.def',
  'open.pros',
  'open.def',
  'cic.pros.one.direct',
  'cic.pros.one.cross',
  'cic.pros.two.direct',
  'cic.pros.two.cross',
  'cic.pros.three.direct',
  'cic.pros.three.cross',
  'cic.def.one.direct',
  'cic.def.one.cross',
  'cic.def.two.direct',
  'cic.def.two.cross',
  'cic.def.three.direct',
  'cic.def.three.cross',
  'close.pros',
  'close.def',
  'rebuttal',
] as const;

export type TrialStage = (typeof stages)[number];

export function isTrialStage(stage: string): stage is TrialStage {
  return stages.includes(stage as TrialStage);
}

// get the stages that are in use for this trial
export function getTrialStages(trial: Trial) {
  if (trial.setup.pretrialEnabled) {
    return stages;
  }

  return stages.filter((stage) => !stage.includes('pretrial'));
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
  const sideName = getSideName(side);

  const witnessNameMap: Partial<Record<TrialStage, string | null>> = {
    'cic.pros.one.direct': witnesses.p[0],
    'cic.pros.one.cross': witnesses.p[0],
    'cic.pros.two.direct': witnesses.p[1],
    'cic.pros.two.cross': witnesses.p[1],
    'cic.pros.three.direct': witnesses.p[2],
    'cic.pros.three.cross': witnesses.p[2],
    'cic.def.one.direct': witnesses.d[0],
    'cic.def.one.cross': witnesses.d[0],
    'cic.def.two.direct': witnesses.d[1],
    'cic.def.two.cross': witnesses.d[1],
    'cic.def.three.direct': witnesses.d[2],
    'cic.def.three.cross': witnesses.d[2],
  };

  const detailedWitnessName = witnessNameMap[stage];

  // If the witness name has been set, use it
  if (detailedWitnessName) {
    return detailedWitnessName;
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
  const sideName = getSideName(side);

  if (stage.startsWith('pretrial')) {
    return minimal ? 'Pretrial' : `${sideName} Pretrial`;
  } else if (stage.startsWith('cic')) {
    const examination = stage.includes('direct') ? 'Direct' : 'Cross';
    const name = getWitnessName(trial, stage, side);
    return minimal ? name : `${name} - ${examination}`;
  } else if (stage.startsWith('open')) {
    return minimal ? 'Opening' : `${sideName} Opening`;
  } else if (stage.startsWith('close')) {
    return minimal ? 'Closing' : `${sideName} Closing`;
  } else if (stage.startsWith('rebuttal')) {
    return 'Rebuttal';
  }

  return stage;
};
