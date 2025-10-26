import { useEffect, useState } from 'react';

import { Trial, getTrialsFromStorage } from '../controllers/trial';

export const useTrialsContextInitializer = () => {
  const [trials, setTrials] = useState<Trial[] | null>(null);

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

  return {
    trials,
    setTrials,
  };
};
