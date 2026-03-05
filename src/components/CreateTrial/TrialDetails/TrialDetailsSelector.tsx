import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import colors from '../../../constants/colors';

type PickerItem<T> = { label: string; value: T };

interface TrialDetailsSelectorProps<T extends React.Key> {
  items: PickerItem<T>[];
  selected?: T;
  onSelect: (value: T) => void;
}

const TrialDetailsSelector = <T extends React.Key>({
  items,
  selected,
  onSelect,
}: TrialDetailsSelectorProps<T>) => {
  const handleOptionSelect = (value: T) => {
    onSelect(value);
  };

  return (
    <View style={styles.container}>
      {items.map((item) => {
        const isSelected = selected === item.value;
        return (
          <TouchableOpacity
            key={item.value}
            style={[styles.item, isSelected && styles.itemSelected]}
            onPress={() => handleOptionSelect(item.value)}
          >
            <Text
              style={[styles.itemText, isSelected && styles.itemTextSelected]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 5,
  },
  item: {
    flex: 1,
    backgroundColor: 'white',
    padding: 10,
    borderWidth: 0.2,
    borderColor: '#c3c3c3',
    borderRadius: 10,
    alignItems: 'center',
  },
  itemSelected: {
    backgroundColor: colors.ORANGE,
    borderColor: colors.ORANGE,
  },
  itemText: {
    color: 'black',
  },
  itemTextSelected: {
    color: 'white',
  },
});

export default TrialDetailsSelector;
