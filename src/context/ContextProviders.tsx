import * as SplashScreen from 'expo-splash-screen';
import React, { FC, useEffect, useState } from 'react';
import { Appearance } from 'react-native';

import {
  AirplaneBlockerContext,
  AirplaneBlockerState,
} from './AirplaneBlockerContext';
import { Theme, ThemeContext } from './ThemeContext';
import { TrialsContext } from './TrialsContext';
import {
  getSettings,
  settingsThemeToThemeContextTheme,
} from '../controllers/settings';
import { Trial, getTrialsFromStorage } from '../controllers/trial';

interface ContextProviderProps {
  children: React.ReactNode;
}

// TODO: try to figure out a way to move the initializers to their own hook files

const ContextProviders: FC<ContextProviderProps> = ({ children }) => {
  const [trials, setTrials] = useState<Trial[]>(null);
  const [theme, setTheme] = useState<Theme>(null);
  const [airplaneBlockerState, setAirplaneBlockerState] =
    useState<AirplaneBlockerState>({
      hide: false,
    });

  // Trials

  useEffect(() => {
    if (!trials) {
      getTrialsFromStorage().then((trials) => {
        setTrials(trials);
        SplashScreen.hideAsync();
      });
    }
  }, [trials]);

  // Theme

  useEffect(() => {
    getSettings().then((settings) => {
      setTheme(settingsThemeToThemeContextTheme(settings.theme));
    });

    Appearance.addChangeListener(() => {
      getSettings().then((settings) => {
        setTheme(settingsThemeToThemeContextTheme(settings.theme));
      });
    });
  }, []);

  // Splash Screen

  useEffect(() => {
    if (theme !== null && trials !== null) {
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
