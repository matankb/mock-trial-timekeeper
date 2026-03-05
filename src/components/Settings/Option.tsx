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
  description?: string;
  color?: string;
  loading?: boolean;
  handlePress?: () => void;
  children: React.ReactNode;
}

const Option: React.FC<OptionProps> = ({
  name,
  description,
  color,
  loading,
  handlePress,
  children,
}) => {
  const loadingIndicator = <ActivityIndicator size="small" color="gray" />;
  const components = (
    <>
      <View style={styles.nameContainer}>
        <Text style={[styles.name, color && { color }]}>{name}</Text>
        {description && <Text style={styles.description}>{description}</Text>}
      </View>
      <View style={styles.childrenContainer}>
        {loading ? loadingIndicator : children}
      </View>
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
  nameContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    alignItems: 'flex-start',
    flex: 1,
  },
  description: {
    color: 'gray',
  },
  childrenContainer: { marginLeft: 20 },
});

export default Option;
