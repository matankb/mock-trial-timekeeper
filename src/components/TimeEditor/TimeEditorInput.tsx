import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { pad } from '../../utils';

interface TimeEditorInputProps {
  value: number;
  inline?: boolean;
  highlighted?: boolean;

  // for mobile, call when the input is pressed
  onPress: () => void;

  // for web, call directly when the input is changed
  onChange: (value: string) => void;
}

export default function TimeEditorInput({
  value,
  inline,
  highlighted,
  onChange,
  onPress,
}: TimeEditorInputProps) {
  if (Platform.OS === 'web') {
    return (
      <View>
        <input
          type="text" // text to allow for leading zeros
          value={pad(value)}
          onChange={(e) => onChange(e.target.value)}
          style={styles.webInput}
        />
      </View>
    );
  }
  return (
    <View>
      <Pressable
        style={[styles.input, inline && styles.inputInline]}
        onPress={onPress}
      >
        <Text>{pad(value)}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 7,
    width: 40,
    height: 40,
  },
  inputInline: {
    width: 40,
    height: 'auto',
    padding: 6,
  },
  highlightedText: {
    color: 'white',
  },
  webInput: {
    width: 20,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: '#f0f0f0',
    borderRadius: 7,
    borderWidth: 0,
  },
});
