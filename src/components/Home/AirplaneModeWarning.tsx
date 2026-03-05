import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

const AirplaneModeWarning = () => {
  if (Platform.OS === 'web') {
    return null;
  }

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
