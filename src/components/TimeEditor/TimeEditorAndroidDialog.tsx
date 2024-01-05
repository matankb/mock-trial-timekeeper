import React, { FC, useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import Dialog from 'react-native-dialog';

interface TimeEditorAndroidDialogProps {
  visible: boolean;
  field: 'minutes' | 'seconds';
  stage: string;
  value: number;
  handleSave: (newValue: string) => void;
  handleCancel: () => void;
}

const TimeEditorAndroidDialog: FC<TimeEditorAndroidDialogProps> = (props) => {
  const [value, setValue] = useState(props.value.toString());

  useEffect(() => {
    setValue(props.value.toString());
  }, [props.value]);

  return (
    <Dialog.Container visible={props.visible}>
      <Dialog.Title style={styles.title}>
        Enter a new {props.field} value
      </Dialog.Title>
      <Dialog.Description>For {props.stage}</Dialog.Description>
      <Dialog.Input
        value={value}
        onChangeText={setValue}
        keyboardType="numeric"
        style={styles.input}
      />
      <Dialog.Button label="Cancel" onPress={props.handleCancel} />
      <Dialog.Button label="Save" onPress={() => props.handleSave(value)} />
    </Dialog.Container>
  );
};

const styles = StyleSheet.create({
  title: {
    color: 'black',
  },
  input: {
    color: 'black',
  },
});
export default TimeEditorAndroidDialog;
