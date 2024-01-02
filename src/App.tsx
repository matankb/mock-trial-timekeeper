import { registerRootComponent } from 'expo';
import * as SplashScreen from 'expo-splash-screen';
import { FC } from 'react';
import { MenuProvider } from 'react-native-popup-menu';

import Navigation from './Navigation';
import ErrorBoundary from './components/ErrorBoundary';
import ContextProviders from './context/ContextProviders';

SplashScreen.preventAutoHideAsync();

const App: FC = () => {
  return (
    <ErrorBoundary>
      <MenuProvider>
        <ContextProviders>
          <Navigation />
        </ContextProviders>
      </MenuProvider>
    </ErrorBoundary>
  );
};

export default registerRootComponent(App);
