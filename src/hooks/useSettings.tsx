import { useEffect, useState } from 'react';

import { getSettings, Settings } from '../controllers/settings';

export const useSettings = (): Settings | null => {
  const [settings, setSettings] = useState<Settings | null>(null);

  useEffect(() => {
    getSettings().then((settings) => setSettings(settings));
  }, []);

  return settings;
};
