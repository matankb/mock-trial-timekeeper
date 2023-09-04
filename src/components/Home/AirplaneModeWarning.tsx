import * as Network from 'expo-network';
import React, { useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';

const AirplaneModeWarning = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Airplane Mode must be enabled during rounds
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 17,
  },
  text: {
    color: 'gray',
    fontStyle: 'italic',
    textAlign: 'center',
  },
});

export default AirplaneModeWarning;
