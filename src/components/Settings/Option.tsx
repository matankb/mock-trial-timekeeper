import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import Text from '../Text';

interface OptionProps {
  name: string;
  handlePress?: () => void;
  children: React.ReactNode;
}

const Option: React.FC<OptionProps> = ({ name, handlePress, children }) => {
  const components = (
    <>
      <Text style={styles.name}>{name}</Text>
      {children}
    </>
  );

  if (handlePress) {
    return (
      <TouchableOpacity
        style={styles.container}
        onPress={() => handlePress?.()}
      >
        {components}
      </TouchableOpacity>
    );
  }

  return <View style={styles.container}>{components}</View>;
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 16,
  },
});

export default Option;
