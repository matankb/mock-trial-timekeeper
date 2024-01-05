import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

import colors from '../constants/colors';
import { Theme } from '../context/ThemeContext';
import useTheme from '../hooks/useTheme';

interface CardProps {
  style?: ViewStyle;
  children: React.ReactNode;
}

const Card = (props: CardProps) => {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.container,
        props.style,
        {
          backgroundColor:
            theme === Theme.LIGHT ? 'white' : colors.BACKGROUND_GRAY,
        },
      ]}
    >
      {props.children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '90%',
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
    alignSelf: 'center',
  },
});

export default Card;
