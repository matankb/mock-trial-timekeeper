import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { registerRootComponent } from 'expo';
import * as SplashScreen from 'expo-splash-screen';
import { FC } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PostHogProvider } from 'posthog-react-native';

import Navigation from './Navigation';
import ErrorBoundary from './components/ErrorBoundary';
import ContextProvider from './context/ContextProvider';
import { posthog } from './utils/posthog';

SplashScreen.preventAutoHideAsync();

const App: FC = () => {
  return (
    <PostHogProvider
      client={posthog}
      autocapture={{
        captureScreens: false,
        captureTouches: false,
      }}
    >
      <ErrorBoundary>
        <ActionSheetProvider>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <ContextProvider>
              <Navigation />
            </ContextProvider>
          </GestureHandlerRootView>
        </ActionSheetProvider>
      </ErrorBoundary>
    </PostHogProvider>
  );
};

export default registerRootComponent(App);
