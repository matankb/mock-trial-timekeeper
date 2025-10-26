import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { registerRootComponent } from 'expo';
import * as SplashScreen from 'expo-splash-screen';
import { FC } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import Navigation from './Navigation';
import ErrorBoundary from './components/ErrorBoundary';
import ContextProvider from './context/ContextProvider';

SplashScreen.preventAutoHideAsync();

const App: FC = () => {
  return (
    <ErrorBoundary>
      <ActionSheetProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <ContextProvider>
            <Navigation />
          </ContextProvider>
        </GestureHandlerRootView>
      </ActionSheetProvider>
    </ErrorBoundary>
  );
};

export default registerRootComponent(App);
