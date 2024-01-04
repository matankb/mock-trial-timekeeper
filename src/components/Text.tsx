import React, { FC } from 'react';
import { Text as RNText, TextProps } from 'react-native';

import { Theme } from '../context/ThemeContext';
import useTheme from '../hooks/useTheme';

const Text: FC<TextProps> = ({ style, ...props }) => {
  const theme = useTheme();
  const color = theme === Theme.LIGHT ? 'black' : 'white';

  return <RNText style={[{ color }, style]} {...props} />;
};

export default Text;
