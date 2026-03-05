import {
  Settings,
  setSettings as setSettingsToStorage,
} from '../controllers/settings';
import { useProvidedContext } from '../context/ContextProvider';

export const useSettings = () => {
  const { settings: settingsContext } = useProvidedContext();
  const settings = settingsContext.settings;

  if (!settings) {
    throw new Error('useSettings called without settings in provider context');
  }

  const setSettings = async (newSettings: Partial<Settings>) => {
    settingsContext.setSettings({ ...settings, ...newSettings });
    return setSettingsToStorage(newSettings);
  };

  return { settings, setSettings };
};
