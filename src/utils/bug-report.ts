import { Alert, Linking } from 'react-native';

export function showBugReportAlert(
  title: string,
  subtitle: string,
  error: Error,
) {
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
      'Mock Trial Timekeeper - Bug Report',
    )}&body=${encodeURIComponent(`Please describe the bug:


    ------- Do not edit below this line -------
    ${error.name}
    ${error.cause}
    ${error.message}
    ${error.stack}
  `)}`,
  );
}
