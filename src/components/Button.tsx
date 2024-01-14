import React, { FC } from 'react';
import { StyleSheet, TouchableOpacity, Text, ViewStyle } from 'react-native';

import colors from '../constants/colors';

interface ButtonProps {
  title: string;
  style?: ViewStyle;
  onPress: () => void;
  disabled?: boolean;
}

const Button: FC<ButtonProps> = ({ title, style, disabled, onPress }) => {
  const containerStyle = {
    ...styles.container,
    ...(disabled && styles.disabled),
    ...style,
  };

  return (
    <TouchableOpacity onPress={onPress} style={containerStyle}>
      <Text style={styles.text}>{title}</Text>
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
