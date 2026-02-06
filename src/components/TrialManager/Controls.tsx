import { Entypo } from '@expo/vector-icons';
import React from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import colors from '../../constants/colors';
import { Theme } from '../../types/theme';
import useTheme from '../../hooks/useTheme';

interface ControlsProps {
  currentStageName: string;
  isPaused: boolean;

  handlePrevious: () => void;
  handleNext: () => void;
  handlePause: () => void;
  handlePlay: () => void;
}

const Controls = (props: ControlsProps) => {
  const theme = useTheme();
  const isLightTheme = theme === Theme.LIGHT;
  const ICON_COLOR = isLightTheme ? '#347cc3' : '#57abff';
  const START_COLOR = isLightTheme ? colors.GREEN : colors.BRIGHT_GREEN;

  const buttonStyle = {
    ...styles.button,
    backgroundColor: isLightTheme ? '#e5ebf8' : '#383838',
  };

  return (
    <View
      style={{
        ...styles.container,
        backgroundColor: isLightTheme ? 'white' : colors.BACKGROUND_GRAY,
      }}
    >
      <Text
        style={{
          ...styles.currentStageLabel,
          color: isLightTheme ? 'gray' : 'darkgray',
        }}
      >
        Current Stage&nbsp;&nbsp;
      </Text>
      <Text
        style={{
          ...styles.currentStage,
          ...(!isLightTheme && { color: 'white' }),
        }}
      >
        {props.currentStageName}
      </Text>
      <View style={styles.buttonsContainer}>
        <Pressable style={buttonStyle} onPress={props.handlePrevious}>
          <Entypo name="chevron-left" size={55} color={ICON_COLOR} />
        </Pressable>
        {!props.isPaused ? (
          <Pressable style={buttonStyle} onPress={props.handlePause}>
            <Entypo name="controller-paus" size={50} color="orange" />
          </Pressable>
        ) : (
          <Pressable style={buttonStyle} onPress={props.handlePlay}>
            <Entypo name="controller-play" size={60} color={START_COLOR} />
          </Pressable>
        )}

        <Pressable style={buttonStyle} onPress={props.handleNext}>
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
    paddingHorizontal: 10,
  },
  buttonsContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    ...Platform.select({
      web: {
        justifyContent: 'center',
        gap: 20,
      },
    }),
  },
  button: {
    width: 90,
    height: 90,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
});

export default Controls;
