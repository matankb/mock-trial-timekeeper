import { createContext, useEffect, useState } from 'react';

import { Trial, getTrialsFromStorage } from '../controllers/trial';

type TrialsContextType = ReturnType<typeof useState<Trial[]>>;

export const TrialsContext = createContext<TrialsContextType>(null);

export const useTrialsContextInitializer = (): TrialsContextType => {
  const [trials, setTrials] = useState<Trial[]>();

  useEffect(() => {
    getTrialsFromStorage().then((trials) => {
      setTrials(trials);
    });
  }, []);

  return [trials, setTrials];
};
