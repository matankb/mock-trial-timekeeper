import React, { FC } from 'react';
import { Text as RNText, TextProps as RNTextProps } from 'react-native';

import { Theme } from '../types/theme';
import useTheme from '../hooks/useTheme';

interface TextProps extends RNTextProps {
  lightColor?: string;
  darkColor?: string;
}

const Text: FC<TextProps> = ({
  style,
  lightColor = 'black',
  darkColor = 'white',
  ...props
}) => {
  const theme = useTheme();
  const color = theme === Theme.LIGHT ? lightColor : darkColor;

  return <RNText style={[{ color }, style]} {...props} />;
};

export default Text;
