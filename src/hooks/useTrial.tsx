// TODO: use this hook throughout

import { useContext, useMemo } from 'react';
import merge from 'ts-deepmerge';

import { TrialsContext } from '../context/TrialsContext';
import { Trial, setTrialToStorage } from '../controllers/trial';

type UseTrial = [Trial, (newTrial: Partial<Trial>) => Promise<void>];

export default function useTrial(id: string): UseTrial {
  const [allTrials, setAllTrials] = useContext(TrialsContext);

  const trial = useMemo(
    () => allTrials.find((trial) => trial.id === id),
    [allTrials, id],
  );

  const setTrial = async (newTrial: Partial<Trial>) => {
    const newTrialData = merge({}, trial, newTrial);

    const newTrials = allTrials.map((t) => {
      if (t.id === id) {
        return newTrialData;
      }
      return t;
    });

    setAllTrials(newTrials);
    return setTrialToStorage(newTrialData);
  };

  return [trial, setTrial];
}
