import { createContext } from 'react';

import { Trial, getTrialsFromStorage } from '../controllers/trial';

export const TrialsContext =
  createContext<[Trial[], React.Dispatch<Trial[]>]>(null);

export async function initializeTrialsContext(
  setTrials: React.Dispatch<Trial[]>,
) {
  const trials = await getTrialsFromStorage();
  setTrials(trials);
}
