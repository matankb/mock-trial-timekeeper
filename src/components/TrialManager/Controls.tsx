import { Entypo } from '@expo/vector-icons';
import React from 'react';
import { Text, View, StyleSheet, Pressable } from 'react-native';

import colors from '../../constants/colors';

interface ControlsProps {
  currentStageName: string;
  isPaused: boolean;

  handlePrevious: () => void;
  handleNext: () => void;
  handlePause: () => void;
  handlePlay: () => void;
}

const Controls = (props: ControlsProps) => {
  const ICON_COLOR = '#347cc3';

  return (
    <View style={styles.container}>
      <Text style={styles.currentStageLabel}>Current Stage&nbsp;&nbsp;</Text>
      <Text style={styles.currentStage}>{props.currentStageName}</Text>
      <View style={styles.buttonsContainer}>
        <Pressable style={styles.button} onPress={props.handlePrevious}>
          <Entypo name="chevron-left" size={55} color={ICON_COLOR} />
        </Pressable>
        {!props.isPaused ? (
          <Pressable style={styles.button} onPress={props.handlePause}>
            <Entypo name="controller-paus" size={50} color="orange" />
          </Pressable>
        ) : (
          <Pressable style={styles.button} onPress={props.handlePlay}>
            <Entypo name="controller-play" size={60} color={colors.GREEN} />
          </Pressable>
        )}

        <Pressable style={styles.button} onPress={props.handleNext}>
          <Entypo name="chevron-right" size={55} color={ICON_COLOR} />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    left: 'auto',
    right: 'auto',
    backgroundColor: 'white',
    // backgroundColor: 'blue',
    borderRadius: 10,
    width: '90%',
    paddingHorizontal: 10,
    paddingVertical: 15,
  },
  currentStage: {
    paddingHorizontal: 10,
    fontSize: 20,
    marginTop: 5,
    marginBottom: 20,
  },
  currentStageLabel: {
    color: 'gray',
    paddingHorizontal: 10,
  },
  buttonsContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  button: {
    width: 90,
    height: 90,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e5ebf8',
    borderRadius: 5,
  },
});

export default Controls;
