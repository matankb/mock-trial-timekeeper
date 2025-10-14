import { createContext, useEffect, useState } from 'react';

import { Trial, getTrialsFromStorage } from '../controllers/trial';

type TrialsContextType = ReturnType<typeof useState<Trial[]>>;

export const TrialsContext = createContext<TrialsContextType>(null);

export const useTrialsContextInitializer = (): TrialsContextType => {
  const [trials, setTrials] = useState<Trial[]>();

  useEffect(() => {
    getTrialsFromStorage()
      .then((trials) => {
        setTrials(trials);
      })
      // TODO: handle this error in the UI better
      .catch((error) => {
        console.error('error getting trials from storage', error);
      });
  }, []);

  return [trials, setTrials];
};
