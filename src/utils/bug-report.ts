import { Alert, Linking, Platform } from 'react-native';
import * as Updates from 'expo-updates';
import * as Device from 'expo-device';
import Constants from 'expo-constants';

import { posthog } from './posthog';

export function showBugReportAlert(
  title: string,
  subtitle: string,
  error: Error,
) {
  posthog.capture('error', {
    message: title,
    error: JSON.stringify(error),
  });

  Alert.alert(title, subtitle, [
    {
      text: 'Contact Support',
      onPress: () => openBugReportEmail(error),
    },
    {
      text: 'Close',
      style: 'cancel',
    },
  ]);
}

export function openBugReportEmail(error: Error) {
  Linking.openURL(
    `mailto:205matan@gmail.com?subject=${encodeURIComponent(
      'Mock Trial Timer - Bug Report',
    )}&body=${encodeURIComponent(`Please describe the bug:

    
    ------- Do not edit below this line -------
    ${error.name}
    ${error.cause}
    ${error.message}
    ${error.stack}
    Device: ${Device.modelId} - ${Device.osBuildId} - ${Device.osVersion}
    Platform: ${Platform.OS}
    Native Version: ${Constants.expoConfig?.version}
    Update ID: ${Updates.updateId ?? 'unknown'}
  `)}`,
  );
}

export function openSupportEmail() {
  Linking.openURL(
    `mailto:205matan@gmail.com?subject=${encodeURIComponent(
      'Mock Trial Timer',
    )}`,
  );
}
