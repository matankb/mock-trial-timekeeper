import * as SplashScreen from 'expo-splash-screen';
import React, { FC, useEffect, useState } from 'react';
import { Appearance, useColorScheme } from 'react-native';

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

const ContextProviders: FC<ContextProviderProps> = ({ children }) => {
  const [trials, setTrials] = useState<Trial[]>(null);
  const [theme, setTheme] = useState<Theme>(null);

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
    console.log('adding listener');
    
    Appearance.addChangeListener(() => {
      console.log('Appearance changed');
      getSettings().then((settings) => {
        setTheme(settingsThemeToThemeContextTheme(settings.theme));
      });
    })
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
        {children}
      </ThemeContext.Provider>
    </TrialsContext.Provider>
  );
};

export default ContextProviders;
