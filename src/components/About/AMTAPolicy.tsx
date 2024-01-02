import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import useTheme from '../../hooks/useTheme';
import { Theme } from '../../context/ThemeContext';

export const amtaPolicyScreenOptions = {
  title: 'AMTA Policy',
};

const AMTAPolicy = () => {
  const theme = useTheme();

  const textStyle = {
    ...styles.text,
    ...(theme === Theme.DARK && { color: 'white' }),
  };

  return (
    <View style={styles.container}>
      <Text style={textStyle}>
        <Text style={styles.bold}>Summary:</Text> This app is permitted at all
        AMTA-sanctioned tournaments (Regionals, ORCS, and Nationals)
      </Text>
      <Text style={textStyle}>
        The American Mock Trial Association Rule 7.1(2)(c) states that:
      </Text>
      <Text style={textStyle}>
        1. "cell phones may be used to keep time for the round only by the
        timekeeper."
      </Text>
      <Text style={textStyle}>
        2. "the device must be in airplane mode at all times during the round"
      </Text>
      <Text style={textStyle}>
        3. "The devices must also stay in the trial room during any breaks in
        the round and cannot be used for any other purpose"
      </Text>
      <Text style={textStyle}>
        Usage of custom applications, such as this one, has been explicitly
        approved by AMTA. According to Elizabeth Smiley, AMTA's Rules and
        Intellectual Property Chair:
      </Text>
      <Text style={textStyle}>
        "[Rule 7.1(2)(c)] allows phone usage. It doesn't have a restriction on
        the exact time keeping application on the phone. So long as you comply
        with the requirements in the rule, you will be fine."
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  text: {
    marginBottom: 10,
    fontSize: 16,
  },
  bold: {
    fontWeight: 'bold',
  },
});

export default AMTAPolicy;
