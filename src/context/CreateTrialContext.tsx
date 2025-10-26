import { useState } from 'react';

import { TrialWitnessCall } from '../controllers/trial';

// Since CreateTrial involves multiple screens that must communicate with each other,
// we use this context to pass data between the screens

export interface CreateTrialState {
  // Tournament Selector
  tournamentId: string | null;
  tournamentName: string | null;
  teamId: string | null; // teamId is only used by the Tournament Selector screen, but we store it in context so it persists

  // Witness Call
  pWitnessCall: TrialWitnessCall;
  dWitnessCall: TrialWitnessCall;
}

export const emptyCreateTrialState: CreateTrialState = {
  tournamentId: null,
  tournamentName: null,
  teamId: null,
  pWitnessCall: [null, null, null],
  dWitnessCall: [null, null, null],
};

export const useCreateTrialContextInitializer = () => {
  const [createTrialState, setCreateTrialState] = useState(
    emptyCreateTrialState,
  );

  return {
    createTrialState,
    setCreateTrialState,
  };
};
