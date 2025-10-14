import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import colors from '../constants/colors';
import { Theme } from '../types/theme';
import useTheme from '../hooks/useTheme';

interface CardProps {
  style?: ViewStyle;
  children: React.ReactNode;
  onPress?: () => void;
}

const Card = (props: CardProps) => {
  const theme = useTheme();

  const style = [
    styles.container,
    {
      backgroundColor: theme === Theme.LIGHT ? 'white' : colors.BACKGROUND_GRAY,
    },
    props.style,
  ];

  if (props.onPress) {
    return (
      <TouchableOpacity
        style={style}
        onPress={props.onPress}
        activeOpacity={0.7}
      >
        {props.children}
      </TouchableOpacity>
    );
  }

  return <View style={style}>{props.children}</View>;
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
