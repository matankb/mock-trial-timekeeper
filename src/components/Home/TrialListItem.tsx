import { MaterialIcons } from '@expo/vector-icons';
import React, { FC } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';

interface TrialListItemProps {
  title: string;
  divider: boolean;
  onPress: () => void;
}

const TrialListItem: FC<TrialListItemProps> = ({ title, divider, onPress }) => {
  return (
    <View>
      <TouchableOpacity onPress={() => onPress()} style={styles.row}>
        <Text style={styles.name}>{title}</Text>
        <MaterialIcons name="navigate-next" size={25} color="gray" />
      </TouchableOpacity>
      {divider && <View style={styles.divider} />}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingLeft: 20,
    paddingRight: 10,
  },
  name: {
    fontSize: 16,
  },
  divider: {
    borderColor: 'lightgray',
    borderTopWidth: 1,
  },
});
export default TrialListItem;
