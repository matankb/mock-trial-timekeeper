import React, { FC } from 'react';
import {
  Button,
  ButtonProps,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';

import colors from '../constants/colors';

const LinkButton: FC<ButtonProps> = (props) => {
  if (Platform.OS === 'ios') {
    return <Button {...props} />;
  }

  return (
    // onPressOut needed for Android header buttons
    <TouchableOpacity onPressOut={props.onPress}>
      <Text style={styles.link}>{props.title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  link: {
    color: colors.HEADER_BLUE,
    fontSize: 18,
  },
});

export default LinkButton;
