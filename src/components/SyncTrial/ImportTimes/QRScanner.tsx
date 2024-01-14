import { FontAwesome, Feather } from '@expo/vector-icons';
import { BarCodeScanner } from 'expo-barcode-scanner';
import React, { FC, useEffect, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';

import colors from '../../../constants/colors';

interface QRScannerProps {
  scanned: boolean;
  error: boolean;
  handleScan: (data: string) => void;
}

const QRScanner: FC<QRScannerProps> = ({ scanned, error, handleScan }) => {
  const [hasPermission, setHasPermission] = useState(null);

  useEffect(() => {
    BarCodeScanner.requestPermissionsAsync().then(({ status }) => {
      setHasPermission(status === 'granted');
    });
  }, []);

  const handleBarCodeScanned = ({ data }) => {
    // if we already scanned, don't do anything
    if (scanned || error) {
      return;
    }

    handleScan(data);
  };

  const loading = hasPermission === null;
  const noPermission = hasPermission === false;

  return (
    <View style={styles.container}>
      {scanned && (
        <View style={styles.iconWrap}>
          <View style={styles.checkmarkBackground}>
            <FontAwesome name="check" style={styles.icon} />
          </View>
        </View>
      )}
      {error && (
        <View style={styles.iconWrap}>
          <View style={styles.errorBackground}>
            <FontAwesome name="close" style={styles.icon} />
          </View>
        </View>
      )}
      {loading && (
        <View style={styles.loading}>
          <Text style={styles.text}>Loading...</Text>
        </View>
      )}
      {noPermission && (
        <View style={styles.loading}>
          <Feather name="camera-off" size={45} color="lightgray" />
          <Text style={styles.text}>Cannot access the camera</Text>
        </View>
      )}
      {!loading && !noPermission && (
        <BarCodeScanner
          onBarCodeScanned={handleBarCodeScanned}
          style={styles.scanner}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 5,
    borderColor: 'transparent',
    width: '90%',
  },
  iconWrap: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  icon: {
    color: 'white',
    fontSize: 100,
  },
  checkmarkBackground: {
    backgroundColor: colors.GREEN,
    borderRadius: 100,
    padding: 15,
  },
  errorBackground: {
    backgroundColor: colors.RED,
    borderRadius: 100,
    width: 120,
    height: 120,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
    paddingTop: 0,
  },
  scanner: {
    width: '100%',
    height: 300,
  },
  loading: {
    width: '100%',
    backgroundColor: 'black',
    height: 300,
    borderRadius: 7,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  text: {
    color: 'lightgray',
    fontSize: 20,
  },
});

export default QRScanner;
