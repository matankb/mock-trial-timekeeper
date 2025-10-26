import { Picker as NativePicker } from '@react-native-picker/picker';
import { useEffect } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import colors from '../constants/colors';

type PickerItem<T> = { label: string; value: T };

interface PickerProps<T> {
  title: string;
  items: PickerItem<T>[];
  selected?: T;
  visible: boolean;
  onSelect: (value: T) => void;
  onClose: () => void;
}

const Picker = <T extends React.Key>({
  title,
  visible,
  onClose,
  onSelect,
  items,
  selected,
}: PickerProps<T>) => {
  // When the picker is opened for the first time, auto-select the first item
  useEffect(() => {
    if (visible && !selected && items.length > 0) {
      onSelect(items[0].value);
    }
  }, [visible, selected, items, onSelect]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.modalBackdrop} onPress={onClose} />

      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <TouchableOpacity onPress={onClose}>
          <Text style={styles.button}>Done</Text>
        </TouchableOpacity>
      </View>

      <NativePicker
        selectedValue={selected}
        onValueChange={onSelect}
        style={styles.pickerContainer}
      >
        {items.map((item) => (
          <NativePicker.Item
            key={item.value}
            label={item.label}
            value={item.value}
          />
        ))}
      </NativePicker>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  pickerContainer: {
    paddingBottom: 20,
    backgroundColor: 'lightgray',
  },
  header: {
    // borderTopLeftRadius: 10,
    // borderTopRightRadius: 10,
    padding: 15,
    backgroundColor: 'white',
    alignItems: 'flex-end',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 18,
    fontWeight: 500,
  },
  button: {
    color: colors.HEADER_BLUE,
    fontSize: 18,
  },
});

export default Picker;
