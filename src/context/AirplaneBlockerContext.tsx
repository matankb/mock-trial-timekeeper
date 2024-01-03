import { createContext } from 'react';

// If hide is enabled, then the AirplaneModeBlocker
// will not show for the rest of the session
export interface AirplaneBlockerState {
  hide: boolean;
}

export const AirplaneBlockerContext =
  createContext<[AirplaneBlockerState, React.Dispatch<AirplaneBlockerState>]>(
    null,
  );
