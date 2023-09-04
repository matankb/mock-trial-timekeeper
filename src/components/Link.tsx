import { MaterialIcons } from '@expo/vector-icons';
import React, { FC } from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  Text,
  TouchableOpacity,
} from 'react-native';

import Card from './Card';

interface LinkProps {
  title: string;
  onPress: () => void;
  border?: boolean;
}

const Link: FC<LinkProps> = ({ title, onPress, border }) => {
  return (
    <Card
      style={{
        ...styles.container,
        ...(border ? styles.containerBorder : {}),
      }}
    >
      <TouchableOpacity onPress={onPress}>
        <View style={styles.internalContainer}>
          <Text style={styles.text}>{title}</Text>
          <MaterialIcons name="navigate-next" size={25} color="gray" />
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
  internalContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
  },
});
export default Link;
