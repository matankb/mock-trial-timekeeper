import { useEffect, useState } from 'react';

import {
  Settings,
  getSettings as getSettingsFromStorage,
} from '../controllers/settings';

export const useSettingsContextInitializer = () => {
  const [settings, setSettings] = useState<Settings | null>(null);

  useEffect(() => {
    getSettingsFromStorage()
      .then((settings) => {
        setSettings(settings);
      })
      // TODO: handle this error in the UI better? Maybe not idk. This won't happen.
      .catch((error) => {
        console.error('error getting settings from storage', error);
      });
  }, []);

  return {
    settings,
    setSettings,
  };
};
