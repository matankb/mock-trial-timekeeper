import { createContext } from 'react';

import { Trial } from '../controllers/trial';

export const TrialsContext =
  createContext<[Trial[], React.Dispatch<Trial[]>]>(null);
