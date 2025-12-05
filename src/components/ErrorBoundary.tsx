import { MaterialIcons } from '@expo/vector-icons';
import { FC } from 'react';
import {
  ErrorBoundary as ErrorBoundaryComponent,
  FallbackProps,
} from 'react-error-boundary';
import { StyleSheet, Text, View } from 'react-native';

import Button from './Button';
import { openBugReportEmail } from '../utils/bug-report';

const ErrorFallback = ({ error }: FallbackProps) => {
  console.log('error', error);
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
        onPress={() => openBugReportEmail(error as Error)}
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
