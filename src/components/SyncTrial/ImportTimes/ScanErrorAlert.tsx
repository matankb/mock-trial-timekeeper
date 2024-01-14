import React, { FC } from 'react';
import { StyleSheet } from 'react-native';

import Button from '../../Button';
import Card from '../../Card';
import Text from '../../Text';
import { ScanError } from '../SyncTrialTypes';

interface ScanErrorAlertProps {
  error: ScanError;
  handleScanAgain: () => void;
}

const ScanErrorAlert: FC<ScanErrorAlertProps> = ({
  error,
  handleScanAgain,
}) => {
  const errorMessageMap = {
    [ScanError.NotJSON]: 'Invalid QR Code',
    [ScanError.WrongKey]: 'Invalid QR Code',
    [ScanError.WrongSchema]: 'Different app versions',
  };

  return (
    <Card>
      <Text style={styles.title}>Error: {errorMessageMap[error]}</Text>
      <Button title="Scan Again" onPress={() => handleScanAgain()} />
    </Card>
  );
};

const styles = StyleSheet.create({
  title: {
    fontWeight: 'bold',
    paddingHorizontal: 20,
    paddingTop: 7,
    fontSize: 16,
  },
});

export default ScanErrorAlert;
