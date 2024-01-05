import { PortalProvider } from '@gorhom/portal';
import { registerRootComponent } from 'expo';
import * as SplashScreen from 'expo-splash-screen';
import { FC } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { MenuProvider } from 'react-native-popup-menu';

import Navigation from './Navigation';
import ErrorBoundary from './components/ErrorBoundary';
import ContextProviders from './context/ContextProviders';

SplashScreen.preventAutoHideAsync();

const App: FC = () => {
  return (
    <ErrorBoundary>
      <MenuProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <ContextProviders>
            <PortalProvider>
              <Navigation />
            </PortalProvider>
          </ContextProviders>
        </GestureHandlerRootView>
      </MenuProvider>
    </ErrorBoundary>
  );
};

export default registerRootComponent(App);
