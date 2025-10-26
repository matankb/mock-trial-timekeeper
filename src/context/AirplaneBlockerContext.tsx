import { useState } from 'react';

// If hide is enabled, then the AirplaneModeBlocker
// will not show for the rest of the session
export interface AirplaneBlockerState {
  hide: boolean;
}

const defaultState: AirplaneBlockerState = {
  hide: false,
};

export const useAirplaneBlockerContextInitializer = () => {
  const [airplaneBlockerState, setAirplaneBlockerState] =
    useState(defaultState);

  return {
    airplaneBlockerState,
    setAirplaneBlockerState,
  };
};
