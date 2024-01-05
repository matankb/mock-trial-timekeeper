import { createContext, useEffect, useState } from 'react';
import { Appearance } from 'react-native';

import {
  getSettings,
  settingsThemeToThemeContextTheme,
} from '../controllers/settings';

export enum Theme {
  LIGHT,
  DARK,
}

type ThemeContextType = ReturnType<typeof useState<Theme>>;

export const ThemeContext = createContext<ThemeContextType>(null);

export const useThemeContextInitializer = (): ThemeContextType => {
  const [theme, setTheme] = useState<Theme>();

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

  return [theme, setTheme];
};
