import { MaterialIcons } from '@expo/vector-icons';
import React, { FC } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import Card from './Card';
import { Theme } from '../types/theme';
import useTheme from '../hooks/useTheme';

interface LinkProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onPress: () => void;
  border?: boolean;
  backgroundColor?: string;
  inline?: boolean;
  fullWidth?: boolean;
  orientation?: 'horizontal' | 'vertical';
}

const Link: FC<LinkProps> = ({
  title,
  subtitle,
  icon,
  rightIcon,
  onPress,
  border,
  inline,
  fullWidth,
  orientation = 'horizontal',
}) => {
  const theme = useTheme();

  return (
    <Card
      style={StyleSheet.flatten([
        styles.container,
        border && styles.containerBorder,
        inline && styles.containerInline,
        fullWidth && styles.containerFullWidth,
      ])}
    >
      <TouchableOpacity onPress={onPress}>
        <View style={styles.internalContainer}>
          <View style={styles.titleContainer}>
            {icon && <View style={styles.iconContainer}>{icon}</View>}
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
          {rightIcon || (
            <MaterialIcons
              name="navigate-next"
              size={25}
              color="gray"
              style={orientation === 'vertical' ? styles.iconVertical : {}}
            />
          )}
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
    backgroundColor: '#f5f5f55a',
    borderWidth: 1,
  },
  containerFullWidth: {
    width: '100%',
  },
  containerInline: {
    paddingLeft: 0,
    paddingRight: 0,
    paddingVertical: 0,
    width: '100%',
  },
  iconContainer: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  internalContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
