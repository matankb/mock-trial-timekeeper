import React, { FC } from "react";
import {
  StyleSheet,
  TextInput as NativeTextInput,
  TextInputProps as NativeTextInputProps,
} from "react-native";

interface TextInputProps extends NativeTextInputProps {
  border?: boolean;
  inline?: boolean;
  full?: boolean;
}

const TextInput: FC<TextInputProps> = ({
  border = false,
  inline = false,
  full = false,
  ...props
}) => {
  return (
    <NativeTextInput
      {...props}
      style={[
        styles.input,
        border && styles.border,
        inline && styles.inline,
        full && styles.full,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    padding: 15,
    fontSize: 16,
    backgroundColor: "white",
    width: "90%",
    alignSelf: "center",
    marginTop: 20,
    borderRadius: 10,
  },
  border: {
    borderWidth: 1,
    borderColor: "#b9b9b9",
    backgroundColor: "#f5f5f568",
  },
  inline: {
    flexGrow: 1,
  },
  full: {
    width: "100%",
  },
});

export default TextInput;
