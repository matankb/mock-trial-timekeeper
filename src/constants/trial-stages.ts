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
];

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

const getWitnessName = (trial: Trial, side: Side) => {
  const { stage, details } = trial;

  if (!details) {
    if (stage.includes('one')) {
      return `${side} Witness #1`;
    } else if (stage.includes('two')) {
      return `${side} Witness #2`;
    } else if (stage.includes('three')) {
      return `${side} Witness #3`;
    } else {
      return `${side} Witness`;
    }
  }

  const witnessNameMap = {
    'cic.pros.one.direct': details.witnesses.p[0],
    'cic.pros.one.cross': details.witnesses.p[0],
    'cic.pros.two.direct': details.witnesses.p[1],
    'cic.pros.two.cross': details.witnesses.p[1],
    'cic.pros.three.direct': details.witnesses.p[2],
    'cic.pros.three.cross': details.witnesses.p[2],
    'cic.def.one.direct': details.witnesses.d[0],
    'cic.def.one.cross': details.witnesses.d[0],
    'cic.def.two.direct': details.witnesses.d[1],
    'cic.def.two.cross': details.witnesses.d[1],
    'cic.def.three.direct': details.witnesses.d[2],
    'cic.def.three.cross': details.witnesses.d[2],
  };

  return witnessNameMap[stage];
};

export const getStageName = (trial: Trial) => {
  const { stage } = trial;
  const side: Side = stage.includes('pros') ? 'p' : 'd';
  const sideName = getSideName(side);

  if (stage.startsWith('pretrial')) {
    return `${sideName} Pretrial`;
  } else if (stage.startsWith('cic')) {
    const examination = stage.includes('direct') ? 'Direct' : 'Cross';
    const name = getWitnessName(trial, side);
    return `${name} - ${examination}`;
  } else if (stage.startsWith('open')) {
    return `${sideName} Opening`;
  } else if (stage.startsWith('close')) {
    return `${sideName} Closing`;
  } else if (stage.startsWith('rebuttal')) {
    return 'Rebuttal';
  }

  return stage;
};
