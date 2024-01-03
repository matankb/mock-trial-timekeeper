import React, { FC } from 'react';
import { StyleSheet, TouchableOpacity, Text, ViewStyle } from 'react-native';

import colors from '../constants/colors';

interface ButtonProps {
  title: string;
  style: ViewStyle;
  onPress: () => void;
}

const Button: FC<ButtonProps> = ({ title, style, onPress }) => {
  const containerStyle = {
    ...styles.container,
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
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 10,
  },
  text: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default Button;
