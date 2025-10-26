import { useMemo } from 'react';
import merge from 'ts-deepmerge';

import { Trial, setTrialToStorage } from '../controllers/trial';
import { useProvidedContext } from '../context/ContextProvider';

type UseTrial = [Trial, (newTrial: Partial<Trial>) => Promise<void>];

export default function useTrial(id: string): UseTrial {
  const { trials: trialContext } = useProvidedContext();
  const allTrials = trialContext.trials;

  if (!allTrials) {
    throw new Error(
      'Trials context attempted to be accessed before it was initialized.',
    );
  }

  const trial = useMemo(
    () => allTrials.find((trial) => trial.id === id),
    [allTrials, id],
  );

  if (!trial) {
    throw new Error(`Trial not found: ${id}`);
  }

  const setTrial = async (newTrial: Partial<Trial>) => {
    const newTrialData = merge.withOptions(
      { mergeArrays: false },
      {},
      trial,
      newTrial,
    ) as Trial;

    const newTrials = allTrials.map((t) => {
      if (t.id === id) {
        return newTrialData;
      }
      return t;
    });

    trialContext.setTrials(newTrials);
    return setTrialToStorage(newTrialData);
  };

  return [trial, setTrial];
}
