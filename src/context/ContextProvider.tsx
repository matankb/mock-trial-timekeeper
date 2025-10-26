import * as SplashScreen from 'expo-splash-screen';
import React, { createContext, FC, useContext, useEffect } from 'react';

import { useAirplaneBlockerContextInitializer } from './AirplaneBlockerContext';
import { useCreateTrialContextInitializer } from './CreateTrialContext';
import { useThemeContextInitializer } from './ThemeContext';
import { useTrialsContextInitializer } from './TrialsContext';

interface ContextProviderProps {
  children: React.ReactNode;
}

const useInitializeContexts = () => {
  const trialContext = useTrialsContextInitializer();
  const themeContext = useThemeContextInitializer();
  const airplaneBlockerContext = useAirplaneBlockerContextInitializer();
  const createTrialContext = useCreateTrialContextInitializer();

  return {
    trials: trialContext,
    theme: themeContext,
    airplaneBlocker: airplaneBlockerContext,
    createTrial: createTrialContext,
  };
};

const isContextsReady = (contexts: ContextProviderValue) => {
  return contexts.theme.theme !== null && contexts.trials.trials !== null;
};

type ContextProviderValue = ReturnType<typeof useInitializeContexts>;

const useCheckContextsReady = (contexts: ContextProviderValue) => {
  useEffect(() => {
    if (isContextsReady(contexts)) {
      SplashScreen.hideAsync();
    }
  }, [contexts]);

  return isContextsReady(contexts);
};

const ProviderContext = createContext<ContextProviderValue | null>(null);

const ContextProvider: FC<ContextProviderProps> = ({ children }) => {
  const contexts = useInitializeContexts();
  const ready = useCheckContextsReady(contexts);

  if (!ready) {
    return null;
  }

  return (
    <ProviderContext.Provider value={contexts}>
      {children}
    </ProviderContext.Provider>
  );
};

export const useProvidedContext = () => {
  const context = useContext(ProviderContext);

  if (!context) {
    throw new Error(`ContextProvider is not initialized.`);
  }

  return context;
};

export default ContextProvider;
