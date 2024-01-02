import { MaterialIcons } from '@expo/vector-icons';
import React, { FC } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';

import { Theme } from '../../context/ThemeContext';
import useTheme from '../../hooks/useTheme';

interface TrialListItemProps {
  title: string;
  divider: boolean;
  onPress: () => void;
}

const TrialListItem: FC<TrialListItemProps> = ({ title, divider, onPress }) => {
  const theme = useTheme();

  const nameComponent = (
    <Text
      style={{
        ...styles.name,
        color: theme === Theme.LIGHT ? 'black' : 'white',
      }}
    >
      {title}
    </Text>
  );

  const dividerComponent = (
    <View
      style={{
        ...styles.divider,
        borderColor: theme === Theme.LIGHT ? 'lightgray' : 'gray',
      }}
    />
  );

  return (
    <View>
      <TouchableOpacity onPress={() => onPress()} style={styles.row}>
        {nameComponent}
        <MaterialIcons name="navigate-next" size={25} color="gray" />
      </TouchableOpacity>
      {divider && dividerComponent}
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
    color: 'white',
  },
  divider: {
    borderColor: 'gray',
    borderTopWidth: 1,
  },
});

export default TrialListItem;
