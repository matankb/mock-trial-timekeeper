import { MaterialIcons } from '@expo/vector-icons';
import React, { FC } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';

import Card from './Card';
import { Theme } from '../types/theme';
import useTheme from '../hooks/useTheme';

interface LinkProps {
  title: string;
  subtitle?: string;
  onPress: () => void;
  border?: boolean;
  inline?: boolean;
  orientation?: 'horizontal' | 'vertical';
}

const Link: FC<LinkProps> = ({
  title,
  subtitle,
  onPress,
  border,
  inline,
  orientation = 'horizontal',
}) => {
  const theme = useTheme();

  return (
    <Card
      style={StyleSheet.flatten([
        styles.container,
        border && styles.containerBorder,
        inline && styles.containerInline,
      ])}
    >
      <TouchableOpacity onPress={onPress}>
        <View style={styles.internalContainer}>
          <View style={styles.titleContainer}>
            <Text
              style={{
                ...styles.text,
                ...(theme === Theme.DARK && { color: 'white' }),
              }}
            >
              {title}
            </Text>
            {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
          </View>
          <MaterialIcons
            name="navigate-next"
            size={25}
            color="gray"
            style={orientation === 'vertical' ? styles.iconVertical : {}}
          />
        </View>
      </TouchableOpacity>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    paddingLeft: 20,
    paddingRight: 10,
  },
  containerBorder: {
    borderColor: 'lightgray',
    borderWidth: 1,
  },
  containerInline: {
    paddingLeft: 0,
    paddingRight: 0,
    paddingVertical: 0,
    width: '100%',
  },
  internalContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  text: {
    fontSize: 16,
  },
  subtitle: {
    fontSize: 16,
    color: 'gray',
  },
  iconVertical: {
    transform: [{ rotate: '90deg' }],
  },
});
export default Link;
