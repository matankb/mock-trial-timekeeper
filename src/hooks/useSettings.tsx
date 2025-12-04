import { useEffect, useState } from 'react';

import { getSettings, Settings } from '../controllers/settings';
import { League } from '../constants/leagues';

export const useSettings = (): Settings | null => {
  const [settings, setSettings] = useState<Settings | null>(null);

  useEffect(() => {
    getSettings().then((settings) => setSettings(settings));
  }, []);

  return settings;
};

export const useSettingsLeague = (): League | null => {
  const settings = useSettings();

  // While settings are loading, return null
  if (!settings) {
    return null;
  }

  // Once settings are loaded, return the league, defaulting to AMTA if not set
  // (this should never happen, but fall back just in case)
  return settings.league.league ?? League.AMTA;
};
