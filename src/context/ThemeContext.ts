import { useEffect, useState } from 'react';
import { Appearance } from 'react-native';

import {
  getSettings,
  settingsThemeToThemeContextTheme,
} from '../controllers/settings';
import { Theme } from '../types/theme';

export const useThemeContextInitializer = () => {
  const [theme, setTheme] = useState<Theme | null>(null);

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

  return {
    theme,
    setTheme,
  };
};
