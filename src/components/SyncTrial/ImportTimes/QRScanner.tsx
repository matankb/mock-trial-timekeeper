import { FontAwesome } from '@expo/vector-icons';
import { BarCodeScanner } from 'expo-barcode-scanner';
import React, { FC, useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';

import colors from '../../../constants/colors';
import Text from '../../Text';

interface QRScannerProps {
  scanned: boolean;
  handleScan: (data: string) => void;
}

const QRScanner: FC<QRScannerProps> = ({ scanned, handleScan }) => {
  const [hasPermission, setHasPermission] = useState(null);

  useEffect(() => {
    BarCodeScanner.requestPermissionsAsync().then(({ status }) => {
      setHasPermission(status === 'granted');
    });
  }, []);

  const handleBarCodeScanned = ({ data }) => {
    // if we already scanned, don't do anything
    if (scanned) {
      return;
    }

    handleScan(data);
  };

  // loading camera permission
  if (hasPermission === null) {
    return <Text>Loading...</Text>;
  }

  // no permission
  if (hasPermission === false) {
    return <Text>No permission!</Text>;
  }

  return (
    <View style={styles.container}>
      {scanned && (
        <View style={styles.checkmarkWrap}>
          <View style={styles.checkmarkBackground}>
            <FontAwesome name="check" style={styles.checkmark} />
          </View>
        </View>
      )}
      <BarCodeScanner
        onBarCodeScanned={handleBarCodeScanned}
        style={{
          width: '100%',
          height: 300,
          borderRadius: 7,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 5,
    borderColor: 'transparent',
    width: '90%',
  },
  checkmarkWrap: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  checkmark: {
    color: 'white',
    fontSize: 100,
  },
  checkmarkBackground: {
    backgroundColor: colors.GREEN,
    borderRadius: 100,
    padding: 15,
  },
});

export default QRScanner;
