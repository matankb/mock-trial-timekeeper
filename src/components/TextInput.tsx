import React, { FC } from 'react';
import {
  StyleSheet,
  TextInput as NativeTextInput,
  TextInputProps as NativeTextInputProps,
} from 'react-native';
import colors from '../constants/colors';

interface TextInputProps extends NativeTextInputProps {
  border?: boolean;
  inline?: boolean;
  full?: boolean;
  error?: boolean;
}

const TextInput: FC<TextInputProps> = ({
  border = false,
  inline = false,
  full = false,
  placeholderTextColor = colors.PLACEHOLDER_GRAY,
  error = false,
  ...props
}) => {
  return (
    <NativeTextInput
      {...props}
      placeholderTextColor={placeholderTextColor}
      style={[
        styles.input,
        border && styles.border,
        inline && styles.inline,
        full && styles.full,
        error && styles.error,
        props.style,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    padding: 15,
    fontSize: 16,
    backgroundColor: 'white',
    width: '90%',
    alignSelf: 'center',
    marginTop: 20,
    borderRadius: 10,
  },
  border: {
    borderWidth: 1,
    borderColor: '#b9b9b9',
    backgroundColor: '#f5f5f568',
  },
  inline: {
    flexGrow: 1,
  },
  full: {
    width: '100%',
  },
  error: {
    backgroundColor: '#ffe7e768',
    borderColor: colors.WARNING_RED,
    borderWidth: 1,
  },
});

export default TextInput;
