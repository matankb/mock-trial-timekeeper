import { MaterialIcons } from '@expo/vector-icons';
import { FC } from 'react';
import { ErrorBoundary as ErrorBoundaryComponent } from 'react-error-boundary';
import { Linking, StyleSheet, Text, View } from 'react-native';

import Button from './Button';

const ErrorFallback = ({ error, resetErrorBoundary }) => {
  // reset: clear loaded trials, go back home
  return (
    <View style={styles.container}>
      <MaterialIcons
        name="error-outline"
        size={60}
        color="#636363"
        style={styles.icon}
      />

      <Text style={styles.text}>Something went wrong.</Text>
      <Text style={styles.instructions}>
        Please restart the app and try again. If the problem persists, please
        submit a bug report.
      </Text>
      <Button
        title="Submit Bug Report"
        onPress={() => {
          Linking.openURL(
            `mailto:205matan@gmail.com?subject=${encodeURIComponent(
              'Mock Trial Timekeeper - Bug Report',
            )}&body=${encodeURIComponent(`Please describe the bug:


            ------- Do not edit below this line -------
            ${error.stack}
          `)}`,
          );
        }}
      />
    </View>
  );
};

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

const ErrorBoundary: FC<ErrorBoundaryProps> = ({ children }) => {
  return (
    <ErrorBoundaryComponent fallbackRender={ErrorFallback}>
      {children}
    </ErrorBoundaryComponent>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    marginBottom: 50,
  },
  icon: {
    textAlign: 'center',
    marginBottom: 20,
  },
  text: {
    textAlign: 'center',
    fontSize: 30,
  },
  instructions: {
    textAlign: 'center',
    marginTop: 20,
    marginHorizontal: 20,
    fontSize: 18,
    color: '#636363',
  },
});

export default ErrorBoundary;
