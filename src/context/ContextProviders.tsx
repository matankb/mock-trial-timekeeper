import * as SplashScreen from 'expo-splash-screen';
import React, { FC, useEffect } from 'react';

import {
  AirplaneBlockerContext,
  useAirplaneBlockerContextInitializer,
} from './AirplaneBlockerContext';
import { ThemeContext, useThemeContextInitializer } from './ThemeContext';
import { TrialsContext, useTrialsContextInitializer } from './TrialsContext';

interface ContextProviderProps {
  children: React.ReactNode;
}

const ContextProviders: FC<ContextProviderProps> = ({ children }) => {
  const [trials, setTrials] = useTrialsContextInitializer();
  const [theme, setTheme] = useThemeContextInitializer();
  const [airplaneBlockerState, setAirplaneBlockerState] =
    useAirplaneBlockerContextInitializer();

  useEffect(() => {
    if (theme !== null || trials !== null) {
      SplashScreen.hideAsync();
    }
  }, [theme, trials]);

  return (
    <TrialsContext.Provider value={[trials, setTrials]}>
      <ThemeContext.Provider value={[theme, setTheme]}>
        <AirplaneBlockerContext.Provider
          value={[airplaneBlockerState, setAirplaneBlockerState]}
        >
          {children}
        </AirplaneBlockerContext.Provider>
      </ThemeContext.Provider>
    </TrialsContext.Provider>
  );
};

export default ContextProviders;
