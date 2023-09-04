import React, { FC } from 'react';
import { StyleSheet, TouchableOpacity, Text } from 'react-native';

import colors from '../constants/colors';

interface ButtonProps {
  title: string;
  onPress: () => void;
}

const Button: FC<ButtonProps> = ({ title, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
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
