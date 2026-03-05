import React, { FC } from 'react';
import { StyleSheet, TouchableOpacity, Text, ViewStyle } from 'react-native';

import colors from '../constants/colors';

interface ButtonProps {
  title: string;
  style?: ViewStyle;
  onPress: () => void;
  disabled?: boolean;
  textColor?: string;
  fullWidth?: boolean;
}

const Button: FC<ButtonProps> = ({
  title,
  style,
  disabled,
  onPress,
  textColor,
  fullWidth,
}) => {
  const containerStyle = {
    ...styles.container,
    ...(disabled && styles.disabled),
    ...style,
    ...(fullWidth && styles.fullWidth),
  };

  const textStyle = {
    ...styles.text,
    ...(textColor && { color: textColor }),
  };

  return (
    <TouchableOpacity onPress={onPress} style={containerStyle}>
      <Text style={textStyle}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.BLUE,
    padding: 15,
    width: '90%',
    alignSelf: 'center',
    marginTop: 20,
    borderRadius: 10,
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    backgroundColor: 'lightgray',
    pointerEvents: 'none',
  },
  text: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default Button;
