import React, { FC } from 'react';
import { View, StyleSheet, Text, Alert, Pressable } from 'react-native';

import { pad } from '../../utils';

// TODO: refactor this somewhere else, I think
export type TimeEditHandler = (newValue: number) => any;

interface TimeEditorProps {
  value: number; // time in seconds
  name: string; // name of stage
  onChange: TimeEditHandler;
}

const TimeEditor: FC<TimeEditorProps> = ({ value, name, onChange }) => {
  const minutes = Math.floor(value / 60);
  const seconds = value % 60;

  const validateInput = (input: string) => {
    const number = Number(input);
    if (isNaN(number)) {
      return 'Please enter a number';
    } else if (number > 59) {
      return 'Please enter a number less than 60';
    } else if (number < 0) {
      return 'Please enter a positive number';
    } else if (Math.floor(number) !== number) {
      return 'Please enter a whole number';
    } else if (input.length === 0) {
      return 'Please enter a number';
    }
    return null;
  };

  const handleMinutesPress = () => {
    Alert.prompt(
      'Enter a new minutes value',
      `For ${name}`,
      // TODO: maybe extract this and seconds calculator to parent
      (newMinutes) => {
        const error = validateInput(newMinutes);
        if (error) {
          return Alert.alert(error);
        }
        onChange(parseInt(newMinutes) * 60 + seconds);
      },
      'plain-text',
      pad(minutes),
      'numeric',
    );
  };

  const handleSecondsPress = () => {
    Alert.prompt(
      'Enter a new seconds value',
      `For ${name}`,
      (newSeconds) => {
        const error = validateInput(newSeconds);
        if (error) {
          return Alert.alert(error);
        }
        onChange(minutes * 60 + parseInt(newSeconds));
      },
      'plain-text',
      pad(seconds),
      'numeric',
    );
  };

  return (
    <View style={styles.container}>
      <Pressable style={styles.input} onPress={handleMinutesPress}>
        <Text>{pad(minutes)}</Text>
      </Pressable>
      <Text>:</Text>
      <Pressable style={styles.input} onPress={handleSecondsPress}>
        <Text>{pad(seconds)}</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginBottom: 5,
    borderRadius: 7,
    justifyContent: 'space-between',
  },
  // TODO: it looks like this is slightly off...
  input: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 7,
    width: 40,
    height: 40,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default TimeEditor;
