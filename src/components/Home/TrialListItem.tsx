import { MaterialIcons } from '@expo/vector-icons';
import React, { FC } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';

import { Theme } from '../../types/theme';
import useTheme from '../../hooks/useTheme';

interface TrialListItemProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  divider: boolean;
  onPress: () => void;
}

const TrialListItem: FC<TrialListItemProps> = ({
  title,
  subtitle,
  icon,
  divider,
  onPress,
}) => {
  const theme = useTheme();

  const nameComponent = (
    <View style={styles.nameContainer}>
      {icon}
      <Text
        style={{
          ...styles.name,
          color: theme === Theme.LIGHT ? 'black' : 'white',
        }}
        numberOfLines={1}
      >
        {title}
      </Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
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
  nameContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  name: {
    fontSize: 16,
    color: 'white',
  },
  subtitle: {
    fontSize: 16,
    color: 'gray',
  },
  divider: {
    borderColor: 'gray',
    borderTopWidth: 1,
  },
});

export default TrialListItem;
