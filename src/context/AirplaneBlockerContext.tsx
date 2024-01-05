import { createContext, useState } from 'react';

// If hide is enabled, then the AirplaneModeBlocker
// will not show for the rest of the session
export interface AirplaneBlockerState {
  hide: boolean;
}

type AirplaneBlockerContextType = ReturnType<
  typeof useState<AirplaneBlockerState>
>;

export const AirplaneBlockerContext =
  createContext<AirplaneBlockerContextType>(null);

export const useAirplaneBlockerContextInitializer =
  (): AirplaneBlockerContextType => {
    const defaultState: AirplaneBlockerState = {
      hide: false,
    };

    return useState(defaultState);
  };
