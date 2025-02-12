import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import Text from '../Text';

interface OptionProps {
  name: string;
  loading?: boolean;
  handlePress?: () => void;
  children: React.ReactNode;
}

const Option: React.FC<OptionProps> = ({
  name,
  loading,
  handlePress,
  children,
}) => {
  const loadingIndicator = <ActivityIndicator size="small" color="gray" />;
  const components = (
    <>
      <Text style={styles.name}>{name}</Text>
      {loading ? loadingIndicator : children}
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
