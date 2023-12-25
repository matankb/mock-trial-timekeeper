import { piSideName } from '../utils';

export const stages = [
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

export const getNextStage = (stage: string) => {
  const index = stages.indexOf(stage);
  if (index === stages.length - 1) {
    return stages[0];
  }
  return stages[index + 1];
};

export const getPrevStage = (stage: string) => {
  const index = stages.indexOf(stage);
  if (index === 0) {
    return stages[stages.length - 1];
  }
  return stages[index - 1];
};

export const getStageName = (stage: string) => {
  const map: Record<string, string> = {
    'open.pros': `${piSideName} Opening`,
    'open.def': 'Defense Opening',
    'cic.pros.one.direct': `${piSideName} Witness #1 - Direct`,
    'cic.pros.one.cross': `${piSideName} Witness #1 - Cross`,
    'cic.pros.two.direct': `${piSideName} Witness #2 - Direct`,
    'cic.pros.two.cross': `${piSideName} Witness #2 - Cross`,
    'cic.pros.three.direct': `${piSideName} Witness #3 - Direct`,
    'cic.pros.three.cross': `${piSideName} Witness #3 - Cross`,
    'cic.def.one.direct': 'Defense Witness #1 - Direct',
    'cic.def.one.cross': 'Defense Witness #1 - Cross',
    'cic.def.two.direct': 'Defense Witness #2 - Direct',
    'cic.def.two.cross': 'Defense Witness #2 - Cross',
    'cic.def.three.direct': 'Defense Witness #3 - Direct',
    'cic.def.three.cross': 'Defense Witness #3 - Cross',
    'close.pros': `${piSideName} Closing`,
    'close.def': 'Defense Closing',
    rebuttal: 'Rebuttal',
  };

  return map[stage] || stage;
};
