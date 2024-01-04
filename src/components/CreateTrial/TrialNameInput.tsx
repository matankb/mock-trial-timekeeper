import React, { FC } from 'react';
import { StyleSheet, TextInput } from 'react-native';

interface TrialNameInputProps {
  name: string;
  setName: (name: string) => void;
}

const TrialNameInput: FC<TrialNameInputProps> = ({ name, setName }) => {
  return (
    <TextInput
      style={styles.input}
      placeholder="Trial Name..."
      value={name}
      onChangeText={setName}
      placeholderTextColor="#4a4a4a"
      returnKeyType="done"
      autoFocus
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
});

export default TrialNameInput;
